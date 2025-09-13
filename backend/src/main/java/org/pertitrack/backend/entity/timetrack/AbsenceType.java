package org.pertitrack.backend.entity.timetrack;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.io.Serial;
import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "absence_types", schema = "timetrack")
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class AbsenceType implements Serializable {

    @Serial
    private static final long serialVersionUID = 1L;

    @Id
    private String id;

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
