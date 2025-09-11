package org.pertitrack.backend.entity.personnel;

import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.MappedSuperclass;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.pertitrack.backend.entity.BaseEntity;

@MappedSuperclass
@Data
@EqualsAndHashCode(callSuper = true)
public class EmployeeOwnedEntity extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    @NotNull
    private Employee employee;
}
