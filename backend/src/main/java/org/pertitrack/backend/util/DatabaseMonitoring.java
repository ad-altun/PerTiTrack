package org.pertitrack.backend.util;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

import static org.pertitrack.backend.config.HealthCheckConfig.getString;

@Component
public class DatabaseMonitoring {

    private final JdbcTemplate jdbcTemplate;

    public DatabaseMonitoring(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public Map<String, Object> getDatabaseStats() {
        Map<String, Object> stats = new HashMap<>();

        // Active connections
        Integer activeConnections = jdbcTemplate.queryForObject(
                "SELECT count(*) FROM pg_stat_activity WHERE state = 'active'",
                Integer.class
        );
        stats.put("activeConnections", activeConnections);

        // Database size
        Long dbSize = jdbcTemplate.queryForObject(
                "SELECT pg_database_size(current_database())",
                Long.class
        );
        stats.put("databaseSize", formatBytes(dbSize));

        // Table count
        Integer tableCount = jdbcTemplate.queryForObject(
                "SELECT count(*) FROM information_schema.tables WHERE table_schema = 'public'",
                Integer.class
        );
        stats.put("tableCount", tableCount);

        // Slow queries (queries taking > 1 second)
        Integer slowQueries = jdbcTemplate.queryForObject(
                "SELECT count(*) FROM pg_stat_activity WHERE state = 'active' AND now() - query_start > interval '1 second'",
                Integer.class
        );
        stats.put("slowQueries", slowQueries);

        return stats;
    }

    private String formatBytes(Long bytes) {
        return getString(bytes);
    }

}
