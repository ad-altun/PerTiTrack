package org.pertitrack.backend.entity.timetrack;

import jakarta.persistence.*;
import jakarta.persistence.Table;
import jakarta.validation.constraints.*;
import lombok.*;
import org.hibernate.annotations.*;
import org.pertitrack.backend.entity.*;

import java.io.*;
import java.time.*;

@Entity
@Table(name = "absence_types", schema = "timetrack")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class AbsenceType extends BaseEntity implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Column(nullable = false, length = 100)
    @NotBlank
    private String name;

    @Column(unique = true, nullable = false, length = 20)
    @NotBlank
    private String code;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "requires_approval")
    private Boolean requiresApproval = false;

    @Column(name = "affects_vacation_balance")
    private Boolean affectsVacationBalance = false;

    @Column(name = "is_paid")
    private Boolean isPaid = true;

    @Column(name = "color_code", length = 7)
    private String colorCode;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

}
