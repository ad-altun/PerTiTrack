package org.pertitrack.backend.entity.personnel;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.pertitrack.backend.entity.BaseEntity;
import org.pertitrack.backend.entity.auth.User;

@Entity
@Table(name = "employees", schema = "personnel")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class Employee extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

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
    // Computed property

    @Transient
    public String setFullName(String fullName) {
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

        return fullName;
    }

}
