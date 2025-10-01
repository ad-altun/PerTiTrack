package org.pertitrack.backend.service;

import jakarta.validation.ValidationException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.pertitrack.backend.dto.PasswordChangeRequest;
import org.pertitrack.backend.entity.auth.User;
import org.pertitrack.backend.exceptions.EmployeeNotFoundException;
import org.pertitrack.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SettingsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // change password
    @Transactional
    public void changePassword(String userId, PasswordChangeRequest request) {
        // find user from repo
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EmployeeNotFoundException(userId, "User not found: "));

        // verify current password matches to found user's password
        if (!passwordEncoder.matches(request.currentPassword(), user.getPassword())) {
            throw new ValidationException("Current password does not match!");
        }

        // ensure that the new password is different from the old one
        if (passwordEncoder.matches(request.newPassword(), user.getPassword())) {
            throw new ValidationException("New password cannot be the same as the old one!");
        }

        // ensure new password confirmation passes
        if (!request.newPassword().equals(request.confirmPassword())) {
            throw new ValidationException("New password confirmation failed! " +
                    "Enter the same password in the confirmation area!");
        }

        // set new password
        user.setPassword(passwordEncoder.encode(request.newPassword()));
        // save in user repo
        userRepository.save(user);

        log.info("Password changed for user: {}", user.getEmail());
    }


}
