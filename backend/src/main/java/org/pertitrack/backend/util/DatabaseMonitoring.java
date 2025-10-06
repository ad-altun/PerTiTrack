package org.pertitrack.backend.util;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

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
        if (bytes < 1024) return bytes + " B";
        int exp = (int) (Math.log(bytes) / Math.log(1024));
        String pre = "KMGTPE".charAt(exp - 1) + "";
        return String.format(Locale.US, "%.2f %sB", bytes / Math.pow(1024, exp), pre);
    }

}
