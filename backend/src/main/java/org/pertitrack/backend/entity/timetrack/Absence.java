package org.pertitrack.backend.entity.timetrack;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.pertitrack.backend.entity.personnel.ApproverEntity;
import org.pertitrack.backend.entity.personnel.Employee;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.UUID;

@Entity
@Table(name = "absences", schema = "timetrack")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Absence extends ApproverEntity implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    @NotNull
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "absence_type_id", nullable = false)
    @NotNull
    private AbsenceType absenceType;

    @Column(name = "start_date", nullable = false)
    @NotNull
    private LocalDate startDate;

    @Column(name = "end_date", nullable = false)
    @NotNull
    private LocalDate endDate;

    @Column(name = "start_time")
    private LocalTime startTime;

    @Column(name = "end_time")
    private LocalTime endTime;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    @NotNull
    private AbsenceStatus status = AbsenceStatus.PENDING;

    @Column(columnDefinition = "TEXT")
    private String reason;

    @Column(name = "rejection_reason", columnDefinition = "TEXT")
    private String rejectionReason;

    public enum AbsenceStatus {
        PENDING, APPROVED, REJECTED, CANCELLED
    }
}
