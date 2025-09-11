package org.pertitrack.backend.entity.personnel;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;
import org.pertitrack.backend.entity.BaseEntity;
import org.pertitrack.backend.entity.auth.User;

import java.util.UUID;

@Entity
@Table(name = "employees", schema = "personnel")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Employee extends BaseEntity {

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

    // Computed property
    @Transient
    public String getFullName() {
        return firstName + " " + lastName;
    }

}
