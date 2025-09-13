package org.pertitrack.backend.exceptions;

import lombok.Getter;

@Getter
public class EmployeeAlreadyExistException extends RuntimeException {

    // employee number
    private final String employeeNumber;

    public EmployeeAlreadyExistException(String message, String employeeNumber) {
        super(message + employeeNumber);
        this.employeeNumber = employeeNumber;
    }
}
