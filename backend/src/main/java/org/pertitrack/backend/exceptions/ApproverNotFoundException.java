package org.pertitrack.backend.exceptions;

import lombok.Getter;

@Getter
public class ApproverNotFoundException extends RuntimeException {
    private final String id;

    public ApproverNotFoundException(String message, String id) {

        super(message + id);
        this.id = id;

    }
}
