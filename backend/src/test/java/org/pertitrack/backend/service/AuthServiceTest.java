package org.pertitrack.backend.service;

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
import org.pertitrack.backend.entity.auth.User;
import org.pertitrack.backend.repository.UserRepository;
import org.pertitrack.backend.security.JwtUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.argThat;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private Authentication authentication;

    @InjectMocks
    private AuthService authService;

    private User testUser;
    private LoginRequest loginRequest;

    @BeforeEach
    void setup() {
        // Create test user with EMPLOYEE role, which is default
        testUser = new User();
        testUser.setId(UUID.fromString("550e8400-e29b-41d4-a716-446655440000"));
        testUser.setEmail("test@test.com");
        testUser.setPassword("encodedPassword000");
        testUser.setFirstName("Patrick");
        testUser.setLastName("Jane");
        testUser.setRole(User.Role.EMPLOYEE);
        testUser.setEnabled(true);

        // Create login request
        loginRequest = new LoginRequest();
        loginRequest.setEmail("test@test.com");
        loginRequest.setPassword("password000");
    }

    //                    authenticateUser Tests
    //                    -----------------------
    @Test
    void authenticateUser_returnsUserSpecificJWTResponse() {
        // Arrange
        // Mock authentication manager to return successful authentication
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);

        // Mock authentication to return testUser as principal
        when(authentication.getPrincipal())
                .thenReturn(testUser);

        // Mock JWT token generation
        String TEST_JWT_TOKEN = "test.jwt.token";
        when(jwtUtils.generateJwtToken(authentication))
                .thenReturn(TEST_JWT_TOKEN);

        // Act
        ResponseEntity<?> response = authService.authenticateUser(loginRequest);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());

        // Verify response body is JwtResponse
        assertInstanceOf(JwtResponse.class, response.getBody());
        JwtResponse jwtResponse = (JwtResponse) response.getBody();

        // Verify all user-specific data in JWT response
        assertEquals(TEST_JWT_TOKEN, jwtResponse.getToken());
        assertEquals("Bearer", jwtResponse.getType());
        assertEquals(testUser.getId(), jwtResponse.getId());
        assertEquals(testUser.getEmail(), jwtResponse.getEmail());
        assertEquals(testUser.getFirstName(), jwtResponse.getFirstName());
        assertEquals(testUser.getLastName(), jwtResponse.getLastName());
        assertEquals(List.of("ROLE_EMPLOYEE"), jwtResponse.getRoles());

        // Verify interactions with mocks
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
        verify(jwtUtils).generateJwtToken(authentication);
        verify(authentication).getPrincipal();
    }

    //                    registerUser Tests
    //                    -----------------------

    @Test
    void registerUser_withValidData_returnsSuccessMessage() {
        // Arrange
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("newuser@test.com");
        signupRequest.setPassword("newpassword123");
        signupRequest.setFirstName("New");
        signupRequest.setLastName("User");

        when(userRepository.existsByEmail(
                signupRequest.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(
                signupRequest.getPassword())).thenReturn("encodedNewPassword123");
        when(userRepository.save(any(User.class))).thenReturn(new User());

        // Act
        ResponseEntity<?> response = authService.registerUser(signupRequest);

        // Assert
        assertNotNull(response);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertInstanceOf(MessageResponse.class, response.getBody());

        MessageResponse messageResponse = (MessageResponse) response.getBody();
        assertEquals("User registered successfully!", messageResponse.getMessage());

        // Verify interaction
        verify(userRepository).existsByEmail(signupRequest.getEmail());
        verify(passwordEncoder).encode(signupRequest.getPassword());
        verify(userRepository).save(argThat(user ->
                user.getEmail().equals(signupRequest.getEmail()) &&
                        user.getPassword().equals("encodedNewPassword123") &&
                        user.getFirstName().equals(signupRequest.getFirstName()) &&
                        user.getLastName().equals(signupRequest.getLastName()) &&
                        user.getRole().equals(User.Role.EMPLOYEE) &&
                        user.isEnabled()
        ));
    }

    @Test
    void registerUser_withExistingEmail_returnsBadRequest() {
        // Arrange
        SignupRequest signupRequest = new SignupRequest();
        signupRequest.setEmail("existing@test.com");
        signupRequest.setPassword("password000");
        signupRequest.setFirstName("Test");
        signupRequest.setLastName("User");

        when(userRepository.existsByEmail(
                signupRequest.getEmail())).thenReturn(true);

        // Act
        ResponseEntity<?> response = authService.registerUser(signupRequest);

        // assert
        assertNotNull(response);
        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertInstanceOf(MessageResponse.class, response.getBody());

        MessageResponse messageResponse = (MessageResponse) response.getBody();
        assertEquals("Error: Email is already in use!", messageResponse.getMessage());

        // verify that save was never called
        verify(userRepository, never()).save(any(User.class));
        verify(passwordEncoder, never()).encode(anyString());
    }

    //                    logoutUser Tests
    //                    -----------------------
    @Test
    void logoutUser_returnsSuccessMessage() {
        // Arrange
        // Mock SecurityContextHolder static methods
        try (var mockedSecurityContextHolder =
                     mockStatic(SecurityContextHolder.class)) {

            // Act
            ResponseEntity<?> response = authService.logoutUser();

            // Assert
            assertNotNull(response);
            assertEquals(HttpStatus.OK, response.getStatusCode());
            assertInstanceOf(MessageResponse.class, response.getBody());

            MessageResponse messageResponse = (MessageResponse) response.getBody();
            assertEquals("User logged out successfully!", messageResponse.getMessage());

            // Verify that SecurityContextHolder.clearContext() was called
            mockedSecurityContextHolder.verify(SecurityContextHolder::clearContext);
        }
    }


}