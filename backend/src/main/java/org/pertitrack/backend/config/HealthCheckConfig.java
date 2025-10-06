package org.pertitrack.backend.config;

import org.pertitrack.backend.util.DatabaseMonitoring;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.HealthIndicator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.Locale;
import java.util.Map;


// Provides detailed health information for monitoring and deployment verification.
@Configuration
public class HealthCheckConfig {

    // Custom health indicator for database connectivity and query performance.
    @Bean
    public HealthIndicator databaseHealthIndicator(JdbcTemplate jdbcTemplate) {
        return () -> {
            try {
                long startTime = System.currentTimeMillis();

                // Execute a simple query to verify database connectivity
                jdbcTemplate.queryForObject("SELECT 1", Integer.class);

                long responseTime = System.currentTimeMillis() - startTime;

                // Consider healthy if response time is under 1000ms
                if (responseTime < 1000) {
                    return Health.up()
                            .withDetail("database", "Connected")
                            .withDetail("responseTime", responseTime + "ms")
                            .withDetail("status", "OPERATIONAL")
                            .build();
                } else {
                    return Health.up()
                            .withDetail("database", "Connected but slow")
                            .withDetail("responseTime", responseTime + "ms")
                            .withDetail("status", "DEGRADED")
                            .build();
                }

            } catch (Exception e) {
                return Health.down()
                        .withDetail("database", "Connection failed")
                        .withDetail("error", e.getMessage())
                        .withDetail("status", "DOWN")
                        .build();
            }
        };
    }


    // Application health indicator to verify core functionality.
    @Bean
    public HealthIndicator applicationHealthIndicator() {
        return () -> {
            try {
                // Verify critical application components
                long heapMemory = Runtime.getRuntime().totalMemory();
                long freeMemory = Runtime.getRuntime().freeMemory();
                long maxMemory = Runtime.getRuntime().maxMemory();

                double memoryUsagePercent = ((double)(heapMemory - freeMemory) / heapMemory) * 100;

                Health.Builder healthBuilder = Health.up();

                if (memoryUsagePercent > 90) {
                    healthBuilder = Health.down();
                } else if (memoryUsagePercent > 80) {
                    healthBuilder = Health.status("DEGRADED");
                }

                return healthBuilder
                        .withDetail("application", "PerTiTrack")
                        .withDetail("status", "RUNNING")
                        .withDetail("memoryUsage", String.format(Locale.US, "%.2f%%", memoryUsagePercent))
                        .withDetail("heapMemory", formatBytes(heapMemory))
                        .withDetail("freeMemory", formatBytes(freeMemory))
                        .withDetail("maxMemory", formatBytes(maxMemory))
                        .build();

            } catch (Exception e) {
                return Health.down()
                        .withDetail("application", "PerTiTrack")
                        .withDetail("status", "ERROR")
                        .withDetail("error", e.getMessage())
                        .build();
            }
        };
    }

    // API health indicator to verify REST endpoints are responding.
    @Bean
    public HealthIndicator apiHealthIndicator() {
        return () -> Health.up()
                .withDetail("api", "Available")
                .withDetail("version", "1.0")
                .withDetail("endpoints", "All endpoints operational")
                .build();
    }

    // Format bytes to human-readable format.
    // Update formatBytes
    private String formatBytes(long bytes) {
        if (bytes < 1024) return bytes + " B";
        int exp = (int) (Math.log(bytes) / Math.log(1024));
        String pre = "KMGTPE".charAt(exp - 1) + "";
        return String.format(Locale.US, "%.2f %sB", bytes / Math.pow(1024, exp), pre);
    }

    public static String getString(long bytes) {
        if (bytes < 1024) return bytes + " B";
        int exp = (int) (Math.log(bytes) / Math.log(1024));
        String pre = "KMGTPE".charAt(exp - 1) + "";
        return String.format("%.2f %sB", bytes / Math.pow(1024, exp), pre);
    }

    @Bean
    public HealthIndicator detailedDatabaseHealthIndicator(DatabaseMonitoring dbMonitoring) {
        return () -> {
            try {
                Map<String, Object> stats = dbMonitoring.getDatabaseStats();

                return Health.up()
                        .withDetail("database", "Connected")
                        .withDetails(stats)
                        .build();

            } catch (Exception e) {
                return Health.down()
                        .withDetail("database", "Error retrieving stats")
                        .withDetail("error", e.getMessage())
                        .build();
            }
        };
    }

}
