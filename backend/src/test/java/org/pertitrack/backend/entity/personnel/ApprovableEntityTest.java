package org.pertitrack.backend.entity.personnel;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.pertitrack.backend.entity.BaseEntity;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
@ActiveProfiles("test")
class ApprovableEntityTest extends BaseEntity {

    // Create a concrete test implementation since ApprovableEntity is abstract
    @EqualsAndHashCode(callSuper = true)
    @Data
    private static class TestApprovableEntity extends ApprovableEntity {
        private String id;
    }

    private TestApprovableEntity approvableEntity;
    private Employee approver;

    @BeforeEach
    void setUp() {
        approvableEntity = new TestApprovableEntity();

        // Create a test employee with proper UUID and required fields
        approver = new Employee();
        approver.setId("550e8400-e29b-41d4-a716-446655440000");
        approver.setEmployeeNumber("MGR001");
        approver.setFirstName("John");
        approver.setLastName("Manager");
    }

    @Test
    void isApproved_withNullFields_returnsFalse() {
        // Arrange - both fields are null by default

        // Act
        boolean result = approvableEntity.isApproved();

        // Assert
        assertFalse(result);
    }

    @Test
    void isApproved_withBothFields_returnsTrue() {
        // Arrange
        approvableEntity.setApprovedBy(approver);
        approvableEntity.setApprovedAt(LocalDateTime.now());

        // Act
        boolean result = approvableEntity.isApproved();

        // Assert
        assertTrue(result);
    }

    @Test
    void approve_setsApproverAndTimestamp() {
        // Arrange
        LocalDateTime beforeApproval = LocalDateTime.now();

        // Act
        approvableEntity.approve(approver);

        // Assert
        assertEquals(approver, approvableEntity.getApprovedBy());
        assertEquals(approver.getId(), approvableEntity.getApprovedBy().getId());
        assertNotNull(approvableEntity.getApprovedAt());
        assertTrue(approvableEntity.getApprovedAt().isAfter(beforeApproval) ||
                approvableEntity.getApprovedAt().isEqual(beforeApproval));
        assertTrue(approvableEntity.isApproved());
    }

    @Test
    void approve_withNullApprover_setsNullApprover() {
        // Act
        approvableEntity.approve(null);

        // Assert
        assertNull(approvableEntity.getApprovedBy());
        assertNotNull(approvableEntity.getApprovedAt());
        assertFalse(approvableEntity.isApproved()); // Still false because approver is null
    }

}