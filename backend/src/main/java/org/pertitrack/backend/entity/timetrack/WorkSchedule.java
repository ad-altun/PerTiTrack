package org.pertitrack.backend.entity.timetrack;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.pertitrack.backend.entity.personnel.Employee;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "work_schedules", schema = "timetrack")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkSchedule {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    @NotNull
    private Employee employee;

    @Column(name = "day_of_week", nullable = false)
    @NotNull
    private Integer dayOfWeek; // 1=Monday, 7=Sunday

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    @Column(name = "break_duration_minutes")
    private Integer breakDurationMinutes = 60;

    @Column(name = "is_working_day")
    private Boolean isWorkingDay = true;

    @Column(name = "effective_from", nullable = false)
    @NotNull
    private LocalDate effectiveFrom;

    @Column(name = "effective_until")
    @NotNull
    private LocalDate effectiveUntil;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

}
