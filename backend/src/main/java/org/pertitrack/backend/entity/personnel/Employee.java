package org.pertitrack.backend.entity.personnel;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.pertitrack.backend.entity.auth.User;
import org.pertitrack.backend.entity.timetrack.Absence;
import org.pertitrack.backend.entity.timetrack.TimeRecord;
import org.pertitrack.backend.entity.timetrack.WorkSchedule;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "employees", schema = "personnel")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false, exclude = {"timeRecords", "absences", "workSchedules"})
@ToString(exclude = { "timeRecords", "absences", "workSchedules"})
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    @Column(name = "employee_number", unique = true, nullable = false)
    @NotBlank
    private String employeeNumber;

    @Column(name = "first_name", nullable = false)
    @NotBlank
    private String firstName;

    @Column(name = "last_name", nullable = false)
    @NotBlank
    private String lastName;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL)
    private Set<TimeRecord> timeRecords = new HashSet<>();

    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL)
    private Set<Absence> absences = new HashSet<>();

    @OneToMany(mappedBy = "employee", cascade = CascadeType.ALL)
    private Set<WorkSchedule> workSchedules = new HashSet<>();

    // Computed property
    @Transient
    public String getFullName() {
        return firstName + " " + lastName;
    }

}
