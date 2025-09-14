package org.pertitrack.backend.exceptions;

import lombok.Getter;

@Getter
public class TimeRecordNotFoundException extends RuntimeException {
    private final String id;

    public TimeRecordNotFoundException(String message, String id) {
        super(message + id);
        this.id = id;
    }
}
