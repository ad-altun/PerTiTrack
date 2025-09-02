package org.pertitrack.backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.pertitrack.backend.dto.JwtResponse;
import org.pertitrack.backend.dto.LoginRequest;
import org.pertitrack.backend.entity.User;
import org.pertitrack.backend.repository.UserRepository;
import org.pertitrack.backend.security.JwtUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

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
    private final String TEST_JWT_TOKEN = "test.jwt.token";

    @BeforeEach
    void setup() {
        // Create test user with EMPLOYEE role, which is default
        testUser = new User();
        testUser.setId(1L);
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

    @Test
    void authenticateUser_returnsUserSpecificJWTResponse() {
        // Arrange
        UsernamePasswordAuthenticationToken expectedAuthToken =
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword());

        // Mock authentication manager to return successful authentication
        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(authentication);

        // Mock authentication to return testUser as principal
        when(authentication.getPrincipal())
                .thenReturn(testUser);

        // Mock JWT token generation
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

}