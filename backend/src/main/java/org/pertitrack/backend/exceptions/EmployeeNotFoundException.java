package org.pertitrack.backend.exceptions;

import lombok.Getter;

@Getter
public class EmployeeNotFoundException extends RuntimeException {
    private final String id;

    public EmployeeNotFoundException(String message, String id) {
        super(message + id);
        this.id = id;
    }
}
