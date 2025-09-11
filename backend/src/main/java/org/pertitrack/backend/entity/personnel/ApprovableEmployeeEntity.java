package org.pertitrack.backend.entity.personnel;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.pertitrack.backend.entity.BaseEntity;

import java.time.LocalDateTime;

@MappedSuperclass
@Data
@EqualsAndHashCode(callSuper = true)
public abstract class ApprovableEmployeeEntity extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee_id", nullable = false)
    @NotNull
    private Employee employee;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by")
    private Employee approvedBy;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    // Helper methods
    public boolean isApproved() {
        return approvedBy != null && approvedAt != null;
    }

    public void approve(Employee approver) {
        this.approvedBy = approver;
        this.approvedAt = LocalDateTime.now();
    }
}
