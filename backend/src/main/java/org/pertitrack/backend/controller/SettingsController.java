package org.pertitrack.backend.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.pertitrack.backend.dto.MessageResponse;
import org.pertitrack.backend.dto.PasswordChangeRequest;
import org.pertitrack.backend.service.SettingsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
public class SettingsController {

    private final SettingsService settingsService;

    // change password
    @PutMapping("/users/{userId}/change-password")
    public ResponseEntity<MessageResponse> changePassword(
            @PathVariable String userId,
            @Valid @RequestBody PasswordChangeRequest request
    ) {
        settingsService.changePassword(userId,request);
        return ResponseEntity.ok(
                new MessageResponse("Password changed successfully.")
        );
    }

}
