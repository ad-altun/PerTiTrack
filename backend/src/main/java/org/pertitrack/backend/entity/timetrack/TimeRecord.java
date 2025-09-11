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
import java.util.UUID;

@Entity
@Table(name = "time_records", schema = "timetrack")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TimeRecord {

    private static final long serialVersionUID = 1L;

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    @NotNull
    private Employee employee;

    @Column(name = "record_date", nullable = false)
    @NotNull
    private LocalDate recordDate;

    @Column(name = "record_time", nullable = false)
    @NotNull
    private LocalDateTime recordTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "record_type", nullable = false, length = 20)
    @NotNull
    private RecordType recordType;

    @Enumerated(EnumType.STRING)
    @Column(name = "location_type", length = 20)
    private LocationType locationType = LocationType.OFFICE;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(name = "is_manual")
    private Boolean isManual = false;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by")
    private Employee approvedBy;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum RecordType {
        CLOCK_IN, CLOCK_OUT, BREAK_START, BREAK_END
    }

    public enum LocationType {
        OFFICE, HOME, BUSINESS_TRIP, CLIENT_SITE
    }

}
