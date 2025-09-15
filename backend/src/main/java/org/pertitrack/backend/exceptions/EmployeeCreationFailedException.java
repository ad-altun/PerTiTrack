package org.pertitrack.backend.exceptions;

import lombok.*;

@Getter
public class EmployeeCreationFailedException extends RuntimeException {

    private final String email;
    private final String exceptionMessage;

    public EmployeeCreationFailedException(
            String message, String email, String exceptionMessage) {

        super(message + email + ": " + exceptionMessage);
        this.email = email;
        this.exceptionMessage = message;
    }
}
