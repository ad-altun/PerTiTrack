package org.pertitrack.backend.entity.personnel;

import lombok.Data;
import lombok.EqualsAndHashCode;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class ApprovableEmployeeEntityTest {

    // Create a concrete test implementation since ApprovableEmployeeEntity is abstract
    @EqualsAndHashCode(callSuper = true)
    @Data
    private static class TestApprovableEmployeeEntity extends ApprovableEmployeeEntity {
        private UUID id;
    }

    private TestApprovableEmployeeEntity entity;
    private Employee employee;
    private Employee approver;

    @BeforeEach
    void setUp() {
        entity = new TestApprovableEmployeeEntity();

        // Create test employee (the owner) with proper UUID
        employee = new Employee();
        employee.setId(UUID.fromString("550e8400-e29b-41d4-a716-446655440000"));
        employee.setEmployeeNumber("EMP001");
        employee.setFirstName("John");
        employee.setLastName("Doe");

        // Create test approver with different UUID
        approver = new Employee();
        approver.setId(UUID.fromString("550e8400-e29b-41d4-a716-446655440001"));
        approver.setEmployeeNumber("MGR001");
        approver.setFirstName("Jane");
        approver.setLastName("Manager");
    }

    @Test
    void isApproved_withNullFields_returnsFalse() {
        // Arrange
        entity.setEmployee(employee);
        // approval fields remain null

        // Act
        boolean result = entity.isApproved();

        // Assert
        assertFalse(result);
    }

    @Test
    void isApproved_withOnlyApprovedBy_returnsFalse() {
        // Arrange
        entity.setEmployee(employee);
        entity.setApprovedBy(approver);
        // approvedAt remains null

        // Act
        boolean result = entity.isApproved();

        // Assert
        assertFalse(result);
    }

    @Test
    void isApproved_withBothApprovalFields_returnsTrue() {
        // Arrange
        entity.setEmployee(employee);
        entity.setApprovedBy(approver);
        entity.setApprovedAt(LocalDateTime.now());

        // Act
        boolean result = entity.isApproved();

        // Assert
        assertTrue(result);
    }

    @Test
    void approve_setsApproverAndTimestamp() {
        // Arrange
        entity.setEmployee(employee);
        LocalDateTime beforeApproval = LocalDateTime.now();

        // Act
        entity.approve(approver);

        // Assert
        assertEquals(approver, entity.getApprovedBy());
        assertNotNull(entity.getApprovedAt());
        assertTrue(entity.getApprovedAt().isAfter(beforeApproval) ||
                entity.getApprovedAt().isEqual(beforeApproval));
        assertTrue(entity.isApproved());
    }

    @Test
    void approve_selfApproval_works() {
        // Arrange
        entity.setEmployee(employee);

        // Act - Employee approves their own entity
        entity.approve(employee);

        // Assert
        assertEquals(employee, entity.getEmployee());
        assertEquals(employee, entity.getApprovedBy());
        assertEquals(entity.getEmployee().getId(), entity.getApprovedBy().getId()); // Same UUID
        assertTrue(entity.isApproved());
    }

}