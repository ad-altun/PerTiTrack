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
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "time_records", schema = "timetrack")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class TimeRecord extends ApproverEntity implements Serializable {

    @Serial
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

    public enum RecordType {
        CLOCK_IN, CLOCK_OUT, BREAK_START, BREAK_END
    }

    public enum LocationType {
        OFFICE, HOME, BUSINESS_TRIP, CLIENT_SITE
    }

}
