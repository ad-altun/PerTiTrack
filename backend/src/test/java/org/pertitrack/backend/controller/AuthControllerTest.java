package org.pertitrack.backend.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.pertitrack.backend.dto.JwtResponse;
import org.pertitrack.backend.dto.LoginRequest;
import org.pertitrack.backend.dto.MessageResponse;
import org.pertitrack.backend.dto.SignupRequest;
import org.pertitrack.backend.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@ActiveProfiles("test")
class AuthControllerTest {

    @Mock
    private AuthService authService;

    @InjectMocks
    private AuthController authController;

    private LoginRequest loginRequest;
    private SignupRequest signupRequest;

    @BeforeEach
    void setup() {
        // create test login request
        loginRequest = new LoginRequest();
        loginRequest.setEmail("test@test.com");
        loginRequest.setPassword("password123");

        // create test signup request
        signupRequest = new SignupRequest();
        signupRequest.setEmail("newuser@test.com");
        signupRequest.setPassword("newpassword123");
        signupRequest.setFirstName("New");
        signupRequest.setLastName("User");
    }

    @Test
    void authenticateUser_withValidRequest_ReturnsResult() {
        // Arrange
        JwtResponse expectedResponse = new JwtResponse(
                "test.jwt.token",
                ("550e8400-e29b-41d4-a716-446655440000"),
                "test@example.com",
                "Test",
                "User",
                List.of("ROLE_EMPLOYEE"),
                "550e8423-e29b-41d4-a716-446655440000",
                "0041"
        );

        when(authService.authenticateUser(any(LoginRequest.class))).thenReturn(ResponseEntity.ok(expectedResponse));

        // Act
        ResponseEntity<JwtResponse> result = authController.authenticateUser(loginRequest);

        // Assert
        assertNotNull(result);
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(expectedResponse, result.getBody());

        // verify service was called with correct parameters
        verify(authService).authenticateUser(argThat(request ->
                request.getEmail().equals(loginRequest.getEmail()) &&
                        request.getPassword().equals(loginRequest.getPassword())));
    }

    @Test
    void registerUser_withValidRequest() {
        // Arrange
        MessageResponse expectedResponse = new MessageResponse("User registered successfully!");
        when(authService.registerUser(any(SignupRequest.class))).thenReturn(ResponseEntity.ok(expectedResponse));

        // act
        ResponseEntity<MessageResponse> result = authController.registerUser(signupRequest);

        // assert
        assertNotNull(result);
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(expectedResponse, result.getBody());

        // verify service was called with correct parameters
        verify(authService).registerUser((argThat(request ->
                request.getEmail().equals(signupRequest.getEmail()) &&
                        request.getPassword().equals(signupRequest.getPassword()) &&
                        request.getFirstName().equals((signupRequest.getFirstName())) &&
                        request.getLastName().equals(signupRequest.getLastName())
        )));
    }

    @Test
    void logoutUser_returnSuccessMessage() {
        // Arrange
        MessageResponse expectedResponse = new MessageResponse("User logged out successfully!");
        when(authService.logoutUser())
                .thenReturn(ResponseEntity.ok(expectedResponse));

        // Act
        ResponseEntity<MessageResponse> result = authController.logoutUser();

        // assert
        assertNotNull(result);
        assertEquals(HttpStatus.OK, result.getStatusCode());
        assertEquals(expectedResponse, result.getBody());

        // verify service was called
        verify(authService).logoutUser();
    }
}