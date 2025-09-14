package org.pertitrack.backend.entity.timetrack;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.pertitrack.backend.entity.personnel.EmployeeOwnedEntity;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "work_schedules", schema = "timetrack")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class WorkSchedule extends EmployeeOwnedEntity implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    private String id;

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

}
