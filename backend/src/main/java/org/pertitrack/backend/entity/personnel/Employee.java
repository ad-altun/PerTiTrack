package org.pertitrack.backend.entity.personnel;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import org.pertitrack.backend.entity.*;
import org.pertitrack.backend.entity.auth.*;

@Entity
@Table(name = "employees", schema = "personnel")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Employee extends BaseEntity {

    @Column(name = "employee_number", unique = true)
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

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", unique = true)
    private User user;

    // Computed property
    @Transient
    public String getFullName() {
        return firstName + " " + lastName;
    }
    // Computed property

    @Transient
    public void setFullName(String fullName) {
        String[] names = fullName.split(" ");
        if (names.length == 2) {
            this.firstName = names[0];
            this.lastName = names[1];
        } else if (names.length == 1) {
            this.firstName = names[0];
            this.lastName = "";
        } else if (names.length > 2) {
            this.firstName = names[0] + " " + names[1];
            this.lastName =  names[2];
        }

    }

    // Constructor for creating new employees
    public Employee(String firstName, String lastName, String employeeNumber, User user) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.employeeNumber = employeeNumber;
        this.user = user;
        this.isActive = true;
        // BaseEntity handles id, version, createdAt, updatedAt initialization
    }

}
