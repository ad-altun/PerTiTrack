package org.pertitrack.backend.exceptions;

import org.junit.jupiter.api.Test;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@ActiveProfiles("test")
class EmployeeAlreadyExistExceptionTest {

    /**
     * Test 1: Verify the exception's message and the stored employee number.
     */
    @Test
    void shouldCreateExceptionWithCorrectMessageAndEmployeeNumber() {
        // Arrange
        String baseMessage = "Employee with number ";
        String employeeNo = "E12345";

        // Act
        EmployeeAlreadyExistException exception =
                new EmployeeAlreadyExistException(baseMessage, employeeNo);

        // Assert
        // 1. Verify the overall exception message (super class functionality)
        // The constructor concatenates the base message and the employee number.
        assertThat(exception.getMessage())
                .isEqualTo(baseMessage + employeeNo)
                .contains(employeeNo)
                .as("Exception message should contain the full, concatenated string.");

        // 2. Verify the custom-stored employeeNumber field (using @Getter)
        assertThat(exception.getEmployeeNumber())
                .isEqualTo(employeeNo)
                .as("getEmployeeNumber() should return the correct employee number.");
    }

    // ---

    /**
     * Test 2: Verify that the exception is a RuntimeException and
     * confirms it can be thrown without being caught (optional test).
     */
    @Test
    void shouldBeARuntimeException() {
        // Arrange
        String employeeNo = "E9876";

        // Act & Assert
        // 1. Verify the class hierarchy
        assertThat(EmployeeAlreadyExistException.class)
                .isAssignableTo(RuntimeException.class)
                .as("EmployeeAlreadyExistException should extend RuntimeException.");

        // 2. Optional: Verify that it can be thrown and asserts its type
        // This is a common pattern to ensure the exception type is correct
        // when a method throws it.
        assertThatThrownBy(() -> {
            throw new EmployeeAlreadyExistException("Test throw for: ", employeeNo);
        })
                .isInstanceOf(EmployeeAlreadyExistException.class)
                .hasMessageContaining(employeeNo);
    }
}