package org.pertitrack.backend.util;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;

import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@ActiveProfiles("test")
class DatabaseMonitoringTest {

    @Mock
    private JdbcTemplate jdbcTemplate;

    @InjectMocks
    private DatabaseMonitoring databaseMonitoring;

    @Nested
    class GetDatabaseStatsTests {

        @Test
        void getDatabaseStats_ReturnsAllStatistics() {
            // Arrange
            when(jdbcTemplate.queryForObject(
                    eq("SELECT count(*) FROM pg_stat_activity WHERE state = 'active'"),
                    eq(Integer.class)))
                    .thenReturn(5);

            when(jdbcTemplate.queryForObject(
                    eq("SELECT pg_database_size(current_database())"),
                    eq(Long.class)))
                    .thenReturn(10485760L); // 10 MB

            when(jdbcTemplate.queryForObject(
                    eq("SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public'"),
                    eq(Integer.class)))
                    .thenReturn(15);

            when(jdbcTemplate.queryForObject(
                    eq("SELECT count(*) FROM pg_stat_activity WHERE state = 'active' AND now() - query_start > interval '1 second'"),
                    eq(Integer.class)))
                    .thenReturn(2);

            // Act
            Map<String, Object> stats = databaseMonitoring.getDatabaseStats();

            // Assert
            assertNotNull(stats);
            assertEquals(4, stats.size());
            assertEquals(5, stats.get("activeConnections"));
            assertEquals("10.00 MB", stats.get("databaseSize"));
            assertEquals(15, stats.get("tableCount"));
            assertEquals(2, stats.get("slowQueries"));
        }

        @Test
        void getDatabaseStats_WithZeroActiveConnections_ReturnsZero() {
            // Arrange
            when(jdbcTemplate.queryForObject(
                    eq("SELECT count(*) FROM pg_stat_activity WHERE state = 'active'"),
                    eq(Integer.class)))
                    .thenReturn(0);

            when(jdbcTemplate.queryForObject(anyString(), eq(Long.class)))
                    .thenReturn(1024L);

            when(jdbcTemplate.queryForObject(
                    eq("SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public'"),
                    eq(Integer.class)))
                    .thenReturn(10);

            when(jdbcTemplate.queryForObject(
                    eq("SELECT count(*) FROM pg_stat_activity WHERE state = 'active' AND now() - query_start > interval '1 second'"),
                    eq(Integer.class)))
                    .thenReturn(0);

            // Act
            Map<String, Object> stats = databaseMonitoring.getDatabaseStats();

            // Assert
            assertEquals(0, stats.get("activeConnections"));
        }

        @Test
        void getDatabaseStats_WithNoSlowQueries_ReturnsZero() {
            // Arrange
            when(jdbcTemplate.queryForObject(
                    eq("SELECT count(*) FROM pg_stat_activity WHERE state = 'active'"),
                    eq(Integer.class)))
                    .thenReturn(3);

            when(jdbcTemplate.queryForObject(anyString(), eq(Long.class)))
                    .thenReturn(1024L);

            when(jdbcTemplate.queryForObject(
                    eq("SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public'"),
                    eq(Integer.class)))
                    .thenReturn(10);

            when(jdbcTemplate.queryForObject(
                    eq("SELECT count(*) FROM pg_stat_activity WHERE state = 'active' AND now() - query_start > interval '1 second'"),
                    eq(Integer.class)))
                    .thenReturn(0);

            // Act
            Map<String, Object> stats = databaseMonitoring.getDatabaseStats();

            // Assert
            assertEquals(0, stats.get("slowQueries"));
        }

        @Test
        void getDatabaseStats_WithLargeDatabase_FormatsCorrectly() {
            // Arrange
            when(jdbcTemplate.queryForObject(
                    eq("SELECT count(*) FROM pg_stat_activity WHERE state = 'active'"),
                    eq(Integer.class)))
                    .thenReturn(10);

            when(jdbcTemplate.queryForObject(
                    eq("SELECT pg_database_size(current_database())"),
                    eq(Long.class)))
                    .thenReturn(1073741824L); // 1 GB

            when(jdbcTemplate.queryForObject(
                    eq("SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public'"),
                    eq(Integer.class)))
                    .thenReturn(50);

            when(jdbcTemplate.queryForObject(
                    eq("SELECT count(*) FROM pg_stat_activity WHERE state = 'active' AND now() - query_start > interval '1 second'"),
                    eq(Integer.class)))
                    .thenReturn(1);

            // Act
            Map<String, Object> stats = databaseMonitoring.getDatabaseStats();

            // Assert
            assertEquals("1.00 GB", stats.get("databaseSize"));
        }

        @Test
        void getDatabaseStats_WithManyTables_ReturnsCorrectCount() {
            // Arrange
            when(jdbcTemplate.queryForObject(
                    eq("SELECT count(*) FROM pg_stat_activity WHERE state = 'active'"),
                    eq(Integer.class)))
                    .thenReturn(5);

            when(jdbcTemplate.queryForObject(anyString(), eq(Long.class)))
                    .thenReturn(1024L);

            when(jdbcTemplate.queryForObject(
                    eq("SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public'"),
                    eq(Integer.class)))
                    .thenReturn(100);

            when(jdbcTemplate.queryForObject(
                    eq("SELECT count(*) FROM pg_stat_activity WHERE state = 'active' AND now() - query_start > interval '1 second'"),
                    eq(Integer.class)))
                    .thenReturn(0);

            // Act
            Map<String, Object> stats = databaseMonitoring.getDatabaseStats();

            // Assert
            assertEquals(100, stats.get("tableCount"));
        }

        @Test
        void getDatabaseStats_WhenDatabaseError_ThrowsException() {
            // Arrange
            when(jdbcTemplate.queryForObject(anyString(), eq(Integer.class)))
                    .thenThrow(new RuntimeException("Database connection failed"));

            // Act & Assert
            assertThrows(RuntimeException.class, () -> {
                databaseMonitoring.getDatabaseStats();
            });
        }
    }

    @Nested
    class FormatBytesTests {

        @Test
        void formatBytes_WithBytesLessThan1024_ReturnsBytes() throws Exception {
            // Arrange
            java.lang.reflect.Method method = DatabaseMonitoring.class.getDeclaredMethod("formatBytes", Long.class);
            method.setAccessible(true);

            // Act
            String result = (String) method.invoke(databaseMonitoring, 512L);

            // Assert
            assertEquals("512 B", result);
        }

        @Test
        void formatBytes_WithExactly1024Bytes_ReturnsKB() throws Exception {
            // Arrange
            java.lang.reflect.Method method = DatabaseMonitoring.class.getDeclaredMethod("formatBytes", Long.class);
            method.setAccessible(true);

            // Act
            String result = (String) method.invoke(databaseMonitoring, 1024L);

            // Assert
            assertEquals("1.00 KB", result);
        }

        @Test
        void formatBytes_WithKilobytes_ReturnsKB() throws Exception {
            // Arrange
            java.lang.reflect.Method method = DatabaseMonitoring.class.getDeclaredMethod("formatBytes", Long.class);
            method.setAccessible(true);

            // Act
            String result = (String) method.invoke(databaseMonitoring, 2048L);

            // Assert
            assertEquals("2.00 KB", result);
        }

        @Test
        void formatBytes_WithMegabytes_ReturnsMB() throws Exception {
            // Arrange
            java.lang.reflect.Method method = DatabaseMonitoring.class.getDeclaredMethod("formatBytes", Long.class);
            method.setAccessible(true);

            // Act
            String result = (String) method.invoke(databaseMonitoring, 10485760L); // 10 MB

            // Assert
            assertEquals("10.00 MB", result);
        }

        @Test
        void formatBytes_WithGigabytes_ReturnsGB() throws Exception {
            // Arrange
            java.lang.reflect.Method method = DatabaseMonitoring.class.getDeclaredMethod("formatBytes", Long.class);
            method.setAccessible(true);

            // Act
            String result = (String) method.invoke(databaseMonitoring, 1073741824L); // 1 GB

            // Assert
            assertEquals("1.00 GB", result);
        }

        @Test
        void formatBytes_WithTerabytes_ReturnsTB() throws Exception {
            // Arrange
            java.lang.reflect.Method method = DatabaseMonitoring.class.getDeclaredMethod("formatBytes", Long.class);
            method.setAccessible(true);

            // Act
            String result = (String) method.invoke(databaseMonitoring, 1099511627776L); // 1 TB

            // Assert
            assertEquals("1.00 TB", result);
        }

        @Test
        void formatBytes_WithZeroBytes_ReturnsZeroB() throws Exception {
            // Arrange
            java.lang.reflect.Method method = DatabaseMonitoring.class.getDeclaredMethod("formatBytes", Long.class);
            method.setAccessible(true);

            // Act
            String result = (String) method.invoke(databaseMonitoring, 0L);

            // Assert
            assertEquals("0 B", result);
        }

        @Test
        void formatBytes_WithOddNumber_FormatsCorrectly() throws Exception {
            // Arrange
            java.lang.reflect.Method method = DatabaseMonitoring.class.getDeclaredMethod("formatBytes", Long.class);
            method.setAccessible(true);

            // Act
            String result = (String) method.invoke(databaseMonitoring, 5242880L); // 5 MB

            // Assert
            assertEquals("5.00 MB", result);
        }

        @Test
        void formatBytes_WithDecimalResult_RoundsToTwoDecimals() throws Exception {
            // Arrange
            java.lang.reflect.Method method = DatabaseMonitoring.class.getDeclaredMethod("formatBytes", Long.class);
            method.setAccessible(true);

            // Act
            String result = (String) method.invoke(databaseMonitoring, 1536L); // 1.5 KB

            // Assert
            assertEquals("1.50 KB", result);
        }
    }

    @Nested
    class IntegrationTests {

        @Test
        void getDatabaseStats_AllQueriesExecuted() {
            // Arrange
            when(jdbcTemplate.queryForObject(anyString(), eq(Integer.class)))
                    .thenReturn(1);
            when(jdbcTemplate.queryForObject(anyString(), eq(Long.class)))
                    .thenReturn(1024L);

            // Act
            databaseMonitoring.getDatabaseStats();

            // Assert
            verify(jdbcTemplate, times(3)).queryForObject(anyString(), eq(Integer.class));
            verify(jdbcTemplate, times(1)).queryForObject(anyString(), eq(Long.class));
        }

        @Test
        void getDatabaseStats_ReturnsMapWithCorrectKeys() {
            // Arrange
            when(jdbcTemplate.queryForObject(anyString(), eq(Integer.class)))
                    .thenReturn(1);
            when(jdbcTemplate.queryForObject(anyString(), eq(Long.class)))
                    .thenReturn(1024L);

            // Act
            Map<String, Object> stats = databaseMonitoring.getDatabaseStats();

            // Assert
            assertTrue(stats.containsKey("activeConnections"));
            assertTrue(stats.containsKey("databaseSize"));
            assertTrue(stats.containsKey("tableCount"));
            assertTrue(stats.containsKey("slowQueries"));
        }

        @Test
        void getDatabaseStats_ValueTypesAreCorrect() {
            // Arrange
            when(jdbcTemplate.queryForObject(anyString(), eq(Integer.class)))
                    .thenReturn(5);
            when(jdbcTemplate.queryForObject(anyString(), eq(Long.class)))
                    .thenReturn(10485760L);

            // Act
            Map<String, Object> stats = databaseMonitoring.getDatabaseStats();

            // Assert
            assertInstanceOf(Integer.class, stats.get("activeConnections"));
            assertInstanceOf(String.class, stats.get("databaseSize"));
            assertInstanceOf(Integer.class, stats.get("tableCount"));
            assertInstanceOf(Integer.class, stats.get("slowQueries"));
        }
    }

}