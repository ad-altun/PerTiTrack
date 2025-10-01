package org.pertitrack.backend.dto;

import lombok.With;

@With
public record PasswordChangeRequest(
        String currentPassword,
        String newPassword,
        String confirmPassword
) {
}
