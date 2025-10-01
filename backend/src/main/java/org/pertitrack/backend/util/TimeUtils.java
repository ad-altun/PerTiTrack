package org.pertitrack.backend.util;

import org.springframework.stereotype.Component;

import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

// Utility class for consistent time and date handling across the application
@Component
public class TimeUtils {

    // Standard formatters to ensure consistency
    public static final DateTimeFormatter SHORT_TIME_FORMATTER = DateTimeFormatter.ofPattern("HH:mm");

    // Standard work day duration
//    public static final Duration STANDARD_WORK_DAY = Duration.ofHours(8);

    // Format LocalTime to consistent string format
    public static String shortFormatTime(LocalTime time) {
        if (time == null) return null;
        return time.format(SHORT_TIME_FORMATTER);
    }

     // Format duration to HH:mm:ss string
//    public static String formatDuration(Duration duration) {
//        if (duration == null) return "00:00:00";
//
//        long totalSeconds = duration.getSeconds();
//        long hours = totalSeconds / 3600;
//        long minutes = (totalSeconds % 3600) / 60;
//        long seconds = totalSeconds % 60;
//
//        return String.format("%02d:%02d:%02d", hours, minutes, seconds);
//    }


     // Calculate flex time based on working duration
//    public static Duration calculateFlexTime(Duration workingTime) {
//        if (workingTime == null) workingTime = Duration.ZERO;
//        return workingTime.minus(STANDARD_WORK_DAY);
//    }


     // Get start of day for a given date
//    public static LocalDateTime getStartOfDay(LocalDate date) {
//        return date.atStartOfDay();
//    }


     // Get end of day for a given date
//    public static LocalDateTime getEndOfDay(LocalDate date) {
//        return date.atTime(23, 59, 59);
//    }


     // Check if a datetime is today
//    public static boolean isToday(LocalDateTime dateTime) {
//        return dateTime.toLocalDate().equals(LocalDate.now());
//    }


     // Check if a date is today
//    public static boolean isToday(LocalDate date) {
//        return date.equals(LocalDate.now());
//    }

}
