package org.pertitrack.backend.config;

import org.junit.jupiter.api.Nested;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.pertitrack.backend.util.DatabaseMonitoring;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.boot.actuate.health.Status;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@ActiveProfiles("test")
class HealthCheckConfigTest {

    @Mock
    private JdbcTemplate jdbcTemplate;

    @Mock
    private DatabaseMonitoring databaseMonitoring;

    @InjectMocks
    private HealthCheckConfig healthCheckConfig;

    @Nested
    class DatabaseHealthIndicatorTests {

        @Test
        void databaseHealthIndicator_WhenDatabaseIsHealthy_ReturnsUpStatus() {
            // Arrange
            when(jdbcTemplate.queryForObject(anyString(), eq(Integer.class))).thenReturn(1);

            HealthIndicator indicator = healthCheckConfig.databaseHealthIndicator(jdbcTemplate);

            // Act
            Health health = indicator.health();

            // Assert
            assertEquals(Status.UP, health.getStatus());
            assertEquals("Connected", health.getDetails().get("database"));
            assertEquals("OPERATIONAL", health.getDetails().get("status"));
            assertNotNull(health.getDetails().get("responseTime"));
            assertTrue(health.getDetails().get("responseTime").toString().endsWith("ms"));
        }

        @Test
        void databaseHealthIndicator_WhenResponseTimeSlow_ReturnsUpButDegraded() throws InterruptedException {
            // Arrange
            when(jdbcTemplate.queryForObject(anyString(), eq(Integer.class))).thenAnswer(invocation -> {
                Thread.sleep(1100); // Simulate slow query (>1000ms)
                return 1;
            });

            HealthIndicator indicator = healthCheckConfig.databaseHealthIndicator(jdbcTemplate);

            // Act
            Health health = indicator.health();

            // Assert
            assertEquals(Status.UP, health.getStatus());
            assertEquals("Connected but slow", health.getDetails().get("database"));
            assertEquals("DEGRADED", health.getDetails().get("status"));
            String responseTime = health.getDetails().get("responseTime").toString();
            assertTrue(responseTime.endsWith("ms"));
            // Response time should be >= 1000ms
            int time = Integer.parseInt(responseTime.replace("ms", ""));
            assertTrue(time >= 1000);
        }

        @Test
        void databaseHealthIndicator_WhenDatabaseConnectionFails_ReturnsDownStatus() {
            // Arrange
            when(jdbcTemplate.queryForObject(anyString(), eq(Integer.class)))
                    .thenThrow(new RuntimeException("Connection refused"));

            HealthIndicator indicator = healthCheckConfig.databaseHealthIndicator(jdbcTemplate);

            // Act
            Health health = indicator.health();

            // Assert
            assertEquals(Status.DOWN, health.getStatus());
            assertEquals("Connection failed", health.getDetails().get("database"));
            assertEquals("Connection refused", health.getDetails().get("error"));
            assertEquals("DOWN", health.getDetails().get("status"));
        }

        @Test
        void databaseHealthIndicator_WhenQueryThrowsException_ReturnsDownWithErrorDetails() {
            // Arrange
            when(jdbcTemplate.queryForObject(anyString(), eq(Integer.class)))
                    .thenThrow(new RuntimeException("SQL syntax error"));

            HealthIndicator indicator = healthCheckConfig.databaseHealthIndicator(jdbcTemplate);

            // Act
            Health health = indicator.health();

            // Assert
            assertEquals(Status.DOWN, health.getStatus());
            assertTrue(health.getDetails().get("error").toString().contains("SQL syntax error"));
        }
    }

    @Nested
    class ApplicationHealthIndicatorTests {

        @Test
        void applicationHealthIndicator_WhenMemoryUsageNormal_ReturnsUpStatus() {
            // Arrange
            HealthIndicator indicator = healthCheckConfig.applicationHealthIndicator();

            // Act
            Health health = indicator.health();

            // Assert
            assertEquals(Status.UP, health.getStatus());
            assertEquals("PerTiTrack", health.getDetails().get("application"));
            assertEquals("RUNNING", health.getDetails().get("status"));
            assertNotNull(health.getDetails().get("memoryUsage"));
            assertNotNull(health.getDetails().get("heapMemory"));
            assertNotNull(health.getDetails().get("freeMemory"));
            assertNotNull(health.getDetails().get("maxMemory"));

            // Verify memory usage is reported as percentage
            String memoryUsage = health.getDetails().get("memoryUsage").toString();
            assertTrue(memoryUsage.endsWith("%"));
        }

        @Test
        void applicationHealthIndicator_FormatsMemoryCorrectly() {
            // Arrange
            HealthIndicator indicator = healthCheckConfig.applicationHealthIndicator();

            // Act
            Health health = indicator.health();

            // Assert
            String heapMemory = health.getDetails().get("heapMemory").toString();
            String freeMemory = health.getDetails().get("freeMemory").toString();
            String maxMemory = health.getDetails().get("maxMemory").toString();

            // All memory values should end with B (bytes unit)
            assertTrue(heapMemory.endsWith("B"));
            assertTrue(freeMemory.endsWith("B"));
            assertTrue(maxMemory.endsWith("B"));
        }
    }

    @Nested
    class ApiHealthIndicatorTests {

        @Test
        void apiHealthIndicator_ReturnsUpStatus() {
            // Arrange
            HealthIndicator indicator = healthCheckConfig.apiHealthIndicator();

            // Act
            Health health = indicator.health();

            // Assert
            assertEquals(Status.UP, health.getStatus());
            assertEquals("Available", health.getDetails().get("api"));
            assertEquals("1.0", health.getDetails().get("version"));
            assertEquals("All endpoints operational", health.getDetails().get("endpoints"));
        }
    }

    @Nested
    class DetailedDatabaseHealthIndicatorTests {

        @Test
        void detailedDatabaseHealthIndicator_WhenStatsAvailable_ReturnsUpWithDetails() {
            // Arrange
            Map<String, Object> mockStats = new HashMap<>();
            mockStats.put("activeConnections", 5);
            mockStats.put("databaseSize", "10.50 MB");
            mockStats.put("tableCount", 15);
            mockStats.put("slowQueries", 0);

            when(databaseMonitoring.getDatabaseStats()).thenReturn(mockStats);

            HealthIndicator indicator = healthCheckConfig.detailedDatabaseHealthIndicator(databaseMonitoring);

            // Act
            Health health = indicator.health();

            // Assert
            assertEquals(Status.UP, health.getStatus());
            assertEquals("Connected", health.getDetails().get("database"));
            assertEquals(5, health.getDetails().get("activeConnections"));
            assertEquals("10.50 MB", health.getDetails().get("databaseSize"));
            assertEquals(15, health.getDetails().get("tableCount"));
            assertEquals(0, health.getDetails().get("slowQueries"));
        }

        @Test
        void detailedDatabaseHealthIndicator_WhenErrorRetrievingStats_ReturnsDownStatus() {
            // Arrange
            when(databaseMonitoring.getDatabaseStats())
                    .thenThrow(new RuntimeException("Database connection error"));

            HealthIndicator indicator = healthCheckConfig.detailedDatabaseHealthIndicator(databaseMonitoring);

            // Act
            Health health = indicator.health();

            // Assert
            assertEquals(Status.DOWN, health.getStatus());
            assertEquals("Error retrieving stats", health.getDetails().get("database"));
            assertEquals("Database connection error", health.getDetails().get("error"));
        }

        @Test
        void detailedDatabaseHealthIndicator_IncludesAllStats() {
            // Arrange
            Map<String, Object> mockStats = new HashMap<>();
            mockStats.put("activeConnections", 10);
            mockStats.put("databaseSize", "25.75 GB");
            mockStats.put("tableCount", 50);
            mockStats.put("slowQueries", 2);

            when(databaseMonitoring.getDatabaseStats()).thenReturn(mockStats);

            HealthIndicator indicator = healthCheckConfig.detailedDatabaseHealthIndicator(databaseMonitoring);

            // Act
            Health health = indicator.health();

            // Assert
            assertTrue(health.getDetails().containsKey("activeConnections"));
            assertTrue(health.getDetails().containsKey("databaseSize"));
            assertTrue(health.getDetails().containsKey("tableCount"));
            assertTrue(health.getDetails().containsKey("slowQueries"));
        }
    }

    @Nested
    class FormatBytesTests {

        @Test
        void formatBytes_WithBytesLessThan1024_ReturnsBytes() throws Exception {
            // Arrange
            java.lang.reflect.Method method = HealthCheckConfig.class.getDeclaredMethod("formatBytes", long.class);
            method.setAccessible(true);

            // Act
            String result = (String) method.invoke(healthCheckConfig, 512L);

            // Assert
            assertEquals("512 B", result);
        }

        @Test
        void formatBytes_WithKilobytes_ReturnsKB() throws Exception {
            // Arrange
            java.lang.reflect.Method method = HealthCheckConfig.class.getDeclaredMethod("formatBytes", long.class);
            method.setAccessible(true);

            // Act
            String result = (String) method.invoke(healthCheckConfig, 2048L);

            // Assert
            assertEquals("2,00 KB", result);
        }

        @Test
        void formatBytes_WithMegabytes_ReturnsMB() throws Exception {
            // Arrange
            java.lang.reflect.Method method = HealthCheckConfig.class.getDeclaredMethod("formatBytes", long.class);
            method.setAccessible(true);

            // Act
            String result = (String) method.invoke(healthCheckConfig, 10485760L); // 10 MB

            // Assert
            assertEquals("10,00 MB", result);
        }

        @Test
        void formatBytes_WithGigabytes_ReturnsGB() throws Exception {
            // Arrange
            java.lang.reflect.Method method = HealthCheckConfig.class.getDeclaredMethod("formatBytes", long.class);
            method.setAccessible(true);

            // Act
            String result = (String) method.invoke(healthCheckConfig, 1073741824L); // 1 GB

            // Assert
            assertEquals("1,00 GB", result);
        }

        @Test
        void formatBytes_WithZeroBytes_ReturnsZeroB() throws Exception {
            // Arrange
            java.lang.reflect.Method method = HealthCheckConfig.class.getDeclaredMethod("formatBytes", long.class);
            method.setAccessible(true);

            // Act
            String result = (String) method.invoke(healthCheckConfig, 0L);

            // Assert
            assertEquals("0 B", result);
        }
    }

}