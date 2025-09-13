package org.pertitrack.backend.exceptions;

import lombok.Getter;

@Getter
public class EmployeeNotFoundException extends RuntimeException {
    private final String id;

    public EmployeeNotFoundException(String id, String message) {
        super(message + id);
        this.id = id;
    }
}
