package org.pertitrack.backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.pertitrack.backend.dto.PasswordChangeRequest;
import org.pertitrack.backend.entity.auth.User;
import org.pertitrack.backend.exceptions.EmployeeNotFoundException;
import org.pertitrack.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import jakarta.validation.ValidationException;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@ActiveProfiles("test")
class SettingsServiceTest {

    @InjectMocks
    private SettingsService settingsService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    private User testUser;
    private PasswordChangeRequest validPasswordChangeRequest;
    private String testUserId;

    @BeforeEach
    void setUp() {
        testUserId = "550e8400-e29b-41d4-a716-446655440000";

        testUser = new User();
//        testUser.setId(testUserId);
        testUser.setEmail("test@test.com");
        testUser.setPassword("$2a$10$encodedOldPassword");
        testUser.setFirstName("John");
        testUser.setLastName("Doe");
        testUser.setRole(User.Role.EMPLOYEE);
        testUser.setEnabled(true);

        validPasswordChangeRequest = new PasswordChangeRequest(
                "OldPassword123!",
                "NewPassword456!",
                "NewPassword456!"
        );
    }

    @Test
    void changePassword_withValidRequest_changesPasswordSuccessfully() {
        // Arrange
        when(userRepository.findById(testUserId)).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("OldPassword123!", testUser.getPassword())).thenReturn(true);
        when(passwordEncoder.matches("NewPassword456!", testUser.getPassword())).thenReturn(false);
        when(passwordEncoder.encode("NewPassword456!")).thenReturn("$2a$10$encodedNewPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        settingsService.changePassword(testUserId, validPasswordChangeRequest);

        // Assert
        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());

        User savedUser = userCaptor.getValue();
        assertEquals("$2a$10$encodedNewPassword", savedUser.getPassword());
        verify(userRepository, times(1)).findById(testUserId);
        verify(userRepository, times(1)).save(testUser);
    }

    @Test
    void changePassword_withNonExistentUser_throwsEmployeeNotFoundException() {
        // Arrange
        when(userRepository.findById(testUserId)).thenReturn(Optional.empty());

        // Act & Assert
        EmployeeNotFoundException exception = assertThrows(
                EmployeeNotFoundException.class,
                () -> settingsService.changePassword(testUserId, validPasswordChangeRequest)
        );

        assertTrue(exception.getMessage().contains("User not found: "));
        assertTrue(exception.getMessage().contains(testUserId));
        verify(userRepository, times(1)).findById(testUserId);
        verify(userRepository, never()).save(any(User.class));
        verify(passwordEncoder, never()).encode(anyString());
    }

    @Test
    void changePassword_withIncorrectCurrentPassword_throwsValidationException() {
        // Arrange
        when(userRepository.findById(testUserId)).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("OldPassword123!", testUser.getPassword())).thenReturn(false);

        // Act & Assert
        ValidationException exception = assertThrows(
                ValidationException.class,
                () -> settingsService.changePassword(testUserId, validPasswordChangeRequest)
        );

        assertEquals("Current password does not match!", exception.getMessage());
        verify(userRepository, times(1)).findById(testUserId);
        verify(userRepository, never()).save(any(User.class));
        verify(passwordEncoder, never()).encode(anyString());
    }

    @Test
    void changePassword_withSameNewPassword_throwsValidationException() {
        // Arrange
        PasswordChangeRequest samePasswordRequest = new PasswordChangeRequest(
                "OldPassword123!",
                "OldPassword123!",
                "OldPassword123!"
        );

        when(userRepository.findById(testUserId)).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("OldPassword123!", testUser.getPassword())).thenReturn(true);

        // Act & Assert
        ValidationException exception = assertThrows(
                ValidationException.class,
                () -> settingsService.changePassword(testUserId, samePasswordRequest)
        );

        assertEquals("New password cannot be the same as the old one!", exception.getMessage());
        verify(userRepository, times(1)).findById(testUserId);
        verify(userRepository, never()).save(any(User.class));
        verify(passwordEncoder, never()).encode(anyString());
    }

    @Test
    void changePassword_withMismatchedConfirmation_throwsValidationException() {
        // Arrange
        PasswordChangeRequest mismatchedRequest = new PasswordChangeRequest(
                "OldPassword123!",
                "NewPassword456!",
                "DifferentPassword789!"
        );

        when(userRepository.findById(testUserId)).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("OldPassword123!", testUser.getPassword())).thenReturn(true);
        when(passwordEncoder.matches("NewPassword456!", testUser.getPassword())).thenReturn(false);

        // Act & Assert
        ValidationException exception = assertThrows(
                ValidationException.class,
                () -> settingsService.changePassword(testUserId, mismatchedRequest)
        );

        assertTrue(exception.getMessage().contains("New password confirmation failed!"));
        verify(userRepository, times(1)).findById(testUserId);
        verify(userRepository, never()).save(any(User.class));
        verify(passwordEncoder, never()).encode(anyString());
    }

    @Test
    void changePassword_preservesOtherUserFields() {
        // Arrange
        when(userRepository.findById(testUserId)).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("OldPassword123!", testUser.getPassword())).thenReturn(true);
        when(passwordEncoder.matches("NewPassword456!", testUser.getPassword())).thenReturn(false);
        when(passwordEncoder.encode("NewPassword456!")).thenReturn("$2a$10$encodedNewPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        String originalEmail = testUser.getEmail();
        String originalFirstName = testUser.getFirstName();
        String originalLastName = testUser.getLastName();
        User.Role originalRole = testUser.getRole();
        boolean originalEnabled = testUser.isEnabled();

        // Act
        settingsService.changePassword(testUserId, validPasswordChangeRequest);

        // Assert
        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());

        User savedUser = userCaptor.getValue();
        assertEquals(originalEmail, savedUser.getEmail());
        assertEquals(originalFirstName, savedUser.getFirstName());
        assertEquals(originalLastName, savedUser.getLastName());
        assertEquals(originalRole, savedUser.getRole());
        assertEquals(originalEnabled, savedUser.isEnabled());
    }

    @Test
    void changePassword_callsRepositorySaveOnlyOnce() {
        // Arrange
        when(userRepository.findById(testUserId)).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("OldPassword123!", testUser.getPassword())).thenReturn(true);
        when(passwordEncoder.matches("NewPassword456!", testUser.getPassword())).thenReturn(false);
        when(passwordEncoder.encode("NewPassword456!")).thenReturn("$2a$10$encodedNewPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        settingsService.changePassword(testUserId, validPasswordChangeRequest);

        // Assert
        verify(userRepository, times(1)).save(testUser);
    }

    @Test
    void changePassword_withSpecialCharactersInPassword_handlesCorrectly() {
        // Arrange
        PasswordChangeRequest specialCharsRequest = new PasswordChangeRequest(
                "Old@Pass#123!",
                "New$Pass&456*",
                "New$Pass&456*"
        );

        when(userRepository.findById(testUserId)).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("Old@Pass#123!", testUser.getPassword())).thenReturn(true);
        when(passwordEncoder.matches("New$Pass&456*", testUser.getPassword())).thenReturn(false);
        when(passwordEncoder.encode("New$Pass&456*")).thenReturn("$2a$10$encodedSpecialPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        settingsService.changePassword(testUserId, specialCharsRequest);

        // Assert
        verify(passwordEncoder).encode("New$Pass&456*");
        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        assertEquals("$2a$10$encodedSpecialPassword", userCaptor.getValue().getPassword());
    }

    @Test
    void changePassword_withLongPassword_handlesCorrectly() {
        // Arrange
        String longPassword = "A".repeat(100);
        PasswordChangeRequest longPasswordRequest = new PasswordChangeRequest(
                "OldPassword123!",
                longPassword,
                longPassword
        );

        when(userRepository.findById(testUserId)).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("OldPassword123!", testUser.getPassword())).thenReturn(true);
        when(passwordEncoder.matches(longPassword, testUser.getPassword())).thenReturn(false);
        when(passwordEncoder.encode(longPassword)).thenReturn("$2a$10$encodedLongPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        settingsService.changePassword(testUserId, longPasswordRequest);

        // Assert
        verify(passwordEncoder).encode(longPassword);
        verify(userRepository).save(testUser);
    }

    @Test
    void changePassword_stopsAtFirstValidationFailure() {
        // Arrange - incorrect current password should stop processing
        when(userRepository.findById(testUserId)).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("OldPassword123!", testUser.getPassword())).thenReturn(false);

        // Act & Assert
        assertThrows(
                ValidationException.class,
                () -> settingsService.changePassword(testUserId, validPasswordChangeRequest)
        );

        // Verify that subsequent validations were not performed
        verify(passwordEncoder, times(1)).matches("OldPassword123!", testUser.getPassword());
        verify(passwordEncoder, never()).matches("NewPassword456!", testUser.getPassword());
        verify(passwordEncoder, never()).encode(anyString());
        verify(userRepository, never()).save(any(User.class));
    }

    @Test
    void changePassword_withAdminUser_changesPasswordSuccessfully() {
        // Arrange
        testUser.setRole(User.Role.ADMIN);

        when(userRepository.findById(testUserId)).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("OldPassword123!", testUser.getPassword())).thenReturn(true);
        when(passwordEncoder.matches("NewPassword456!", testUser.getPassword())).thenReturn(false);
        when(passwordEncoder.encode("NewPassword456!")).thenReturn("$2a$10$encodedNewPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        settingsService.changePassword(testUserId, validPasswordChangeRequest);

        // Assert
        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        assertEquals(User.Role.ADMIN, userCaptor.getValue().getRole());
    }

    @Test
    void changePassword_withManagerUser_changesPasswordSuccessfully() {
        // Arrange
        testUser.setRole(User.Role.MANAGER);

        when(userRepository.findById(testUserId)).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("OldPassword123!", testUser.getPassword())).thenReturn(true);
        when(passwordEncoder.matches("NewPassword456!", testUser.getPassword())).thenReturn(false);
        when(passwordEncoder.encode("NewPassword456!")).thenReturn("$2a$10$encodedNewPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        settingsService.changePassword(testUserId, validPasswordChangeRequest);

        // Assert
        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        assertEquals(User.Role.MANAGER, userCaptor.getValue().getRole());
    }

    @Test
    void changePassword_withDisabledUser_stillChangesPassword() {
        // Arrange
        testUser.setEnabled(false);

        when(userRepository.findById(testUserId)).thenReturn(Optional.of(testUser));
        when(passwordEncoder.matches("OldPassword123!", testUser.getPassword())).thenReturn(true);
        when(passwordEncoder.matches("NewPassword456!", testUser.getPassword())).thenReturn(false);
        when(passwordEncoder.encode("NewPassword456!")).thenReturn("$2a$10$encodedNewPassword");
        when(userRepository.save(any(User.class))).thenReturn(testUser);

        // Act
        settingsService.changePassword(testUserId, validPasswordChangeRequest);

        // Assert
        ArgumentCaptor<User> userCaptor = ArgumentCaptor.forClass(User.class);
        verify(userRepository).save(userCaptor.capture());
        assertFalse(userCaptor.getValue().isEnabled());
        assertEquals("$2a$10$encodedNewPassword", userCaptor.getValue().getPassword());
    }
}