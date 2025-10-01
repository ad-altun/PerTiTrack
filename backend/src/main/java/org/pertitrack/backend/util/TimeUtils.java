package org.pertitrack.backend.util;

import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

// Utility class for consistent time and date handling across the application
@Component
public class TimeUtils {

    // Standard formatters to ensure consistency
    public static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    public static final DateTimeFormatter TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm:ss");
    public static final DateTimeFormatter SHORT_TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");
    public static final DateTimeFormatter DATETIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss");

    // Standard work day duration
    public static final Duration STANDARD_WORK_DAY = Duration.ofHours(8);


    // Get current date in ISO format (YYYY-MM-DD)
    public static String getCurrentDateString() {
        return LocalDate.now().format(DATE_FORMATTER);
    }

    // Get current time in ISO format (HH:mm:ss)
    public static String getCurrentTimeString() {
        return LocalTime.now().format(TIME_FORMATTER);
    }

    // Get current datetime in ISO format (YYYY-MM-DDTHH:mm:ss)
    public static String getCurrentDateTimeString() {
        return LocalDateTime.now().format(DATETIME_FORMATTER);
    }

    // Format LocalDateTime to consistent string format
    public static String formatDateTime(LocalDateTime dateTime) {
        if (dateTime == null) return null;
        return dateTime.format(DATETIME_FORMATTER);
    }

    // Format LocalDate to consistent string format
    public static String formatDate(LocalDate date) {
        if (date == null) return null;
        return date.format(DATE_FORMATTER);
    }

    // Format LocalTime to consistent string format
    public static String formatTime(LocalTime time) {
        if (time == null) return null;
        return time.format(TIME_FORMATTER);
    }

    // Format LocalTime to consistent string format
    public static String shortFormatTime(LocalTime time) {
        if (time == null) return null;
        return time.format(SHORT_TIME_FORMATTER);
    }

     // Parse date string to LocalDate
    public static LocalDate parseDate(String dateString) {
        if (dateString == null || dateString.trim().isEmpty()) return null;
        return LocalDate.parse(dateString, DATE_FORMATTER);
    }


     // Parse time string to LocalTime
    public static LocalTime parseTime(String timeString) {
        if (timeString == null || timeString.trim().isEmpty()) return null;
        return LocalTime.parse(timeString, TIME_FORMATTER);
    }


     // Parse datetime string to LocalDateTime
    public static LocalDateTime parseDateTime(String dateTimeString) {
        if (dateTimeString == null || dateTimeString.trim().isEmpty()) return null;
        return LocalDateTime.parse(dateTimeString, DATETIME_FORMATTER);
    }


     // Format duration to HH:mm:ss string
    public static String formatDuration(Duration duration) {
        if (duration == null) return "00:00:00";

        long totalSeconds = duration.getSeconds();
        long hours = totalSeconds / 3600;
        long minutes = (totalSeconds % 3600) / 60;
        long seconds = totalSeconds % 60;

        return String.format("%02d:%02d:%02d", hours, minutes, seconds);
    }


     // Format duration with sign for flex time display
    public static String formatFlexTime(Duration flexTime) {
        if (flexTime == null) return "+00:00:00";

        String sign = flexTime.isNegative() ? "-" : "+";
        Duration abs = flexTime.abs();

        return sign + formatDuration(abs);
    }


     // Parse duration from HH:mm:ss string
    public static Duration parseDuration(String durationString) {
        if (durationString == null || durationString.trim().isEmpty()) {
            return Duration.ZERO;
        }

        // Handle signed duration (flex time)
        boolean negative = durationString.startsWith("-");
        String cleanDuration = durationString.replaceFirst("^[+-]", "");

        String[] parts = cleanDuration.split(":");
        if (parts.length != 3) {
            throw new IllegalArgumentException("Duration must be in HH:mm:ss format");
        }

        try {
            long hours = Long.parseLong(parts[0]);
            long minutes = Long.parseLong(parts[1]);
            long seconds = Long.parseLong(parts[2]);

            Duration duration = Duration.ofHours(hours)
                    .plusMinutes(minutes)
                    .plusSeconds(seconds);

            return negative ? duration.negated() : duration;
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException("Invalid duration format: " + durationString, e);
        }
    }


     // Calculate flex time based on working duration
    public static Duration calculateFlexTime(Duration workingTime) {
        if (workingTime == null) workingTime = Duration.ZERO;
        return workingTime.minus(STANDARD_WORK_DAY);
    }


     // Get start of day for a given date
    public static LocalDateTime getStartOfDay(LocalDate date) {
        return date.atStartOfDay();
    }


     // Get end of day for a given date
    public static LocalDateTime getEndOfDay(LocalDate date) {
        return date.atTime(23, 59, 59);
    }


     // Check if a datetime is today
    public static boolean isToday(LocalDateTime dateTime) {
        return dateTime.toLocalDate().equals(LocalDate.now());
    }


     // Check if a date is today
    public static boolean isToday(LocalDate date) {
        return date.equals(LocalDate.now());
    }

}
