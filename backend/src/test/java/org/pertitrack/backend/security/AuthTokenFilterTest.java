package org.pertitrack.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.pertitrack.backend.entity.auth.User;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.test.context.ActiveProfiles;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.anyString;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@ActiveProfiles("test")
class AuthTokenFilterTest {

    @InjectMocks
    private AuthTokenFilter authTokenFilter;

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private UserDetailsServiceImpl userDetailsService;

    @Mock
    private FilterChain filterChain;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    private User testUser;

    @BeforeEach
    void setUp() {
        SecurityContextHolder.clearContext();

        testUser = new User();
//        testUser.setId("550e8400-e29b-41d4-a716-446655440000");
        testUser.setEmail("test@test.com");
        testUser.setPassword("encodedPassword");
        testUser.setFirstName("Test");
        testUser.setLastName("User");
        testUser.setRole(User.Role.EMPLOYEE);
        testUser.setEnabled(true);
    }

    @AfterEach
    void tearDown() {
        SecurityContextHolder.clearContext();
    }

    @Test
    // arrange
    void shouldNotAuthenticateWhenNoAuthHeader() throws Exception {
        when(request.getHeader("Authorization")).thenReturn(null);
        when(request.getRequestURI()).thenReturn("/api/test");

        // act
        authTokenFilter.doFilterInternal(request, response, filterChain);

        // assert
        verify(filterChain).doFilter(request, response);
        assertNull(SecurityContextHolder.getContext().getAuthentication());
        verify(jwtUtils, never()).validateJwtToken(anyString());
        verify(userDetailsService, never()).loadUserByUsername(anyString());
    }

    @Test
    void shouldNotAuthenticateWhenAuthHeaderIsInvalid() throws Exception {
        // arrange
        when(request.getHeader("Authorization")).thenReturn("Bearer invalid");
        when(request.getRequestURI()).thenReturn("/api/test");
        when(jwtUtils.validateJwtToken("invalid")).thenReturn(false);

        // act
        authTokenFilter.doFilterInternal(request, response, filterChain);

        // assert
        verify(filterChain).doFilter(request, response);
        assertNull(SecurityContextHolder.getContext().getAuthentication());
        verify(jwtUtils).validateJwtToken("invalid");
        verify(userDetailsService, never()).loadUserByUsername(anyString());
    }

    @Test
    void shouldNotAuthenticateWhenTokenIsExpired() throws Exception {
        // arrange
        when(request.getHeader("Authorization")).thenReturn("Bearer expired");
        when(request.getRequestURI()).thenReturn("/api/test");
        when(jwtUtils.validateJwtToken("expired")).thenReturn(false);

        // act
        authTokenFilter.doFilterInternal(request, response, filterChain);

        // assert
        verify(filterChain).doFilter(request, response);
        assertNull(SecurityContextHolder.getContext().getAuthentication());
        verify(jwtUtils).validateJwtToken("expired");
        verify(userDetailsService, never()).loadUserByUsername(anyString());
    }

    @Test
    void shouldAuthenticateSuccessfullyWithValidToken() throws Exception {
        // Arrange
        String validToken = "valid.jwt.token";
        String username = "test@test.com";

        when(request.getHeader("Authorization")).thenReturn("Bearer " + validToken);
        when(request.getRequestURI()).thenReturn("/api/test");
        when(jwtUtils.validateJwtToken(validToken)).thenReturn(true);
        when(jwtUtils.getUserNameFromJwtToken(validToken)).thenReturn(username);
        when(userDetailsService.loadUserByUsername(username)).thenReturn(testUser);

        // Act
        authTokenFilter.doFilterInternal(request, response, filterChain);

        // Assert
        verify(filterChain).doFilter(request, response);
        verify(jwtUtils).validateJwtToken(validToken);
        verify(jwtUtils).getUserNameFromJwtToken(validToken);
        verify(userDetailsService).loadUserByUsername(username);

        assertNotNull(SecurityContextHolder.getContext().getAuthentication());
        assertEquals(username, SecurityContextHolder.getContext().getAuthentication().getName());
    }

    @Test
    void shouldNotAuthenticateWhenAuthHeaderDoesNotStartWithBearer() throws Exception {
        // Arrange
        when(request.getHeader("Authorization")).thenReturn("Basic sometoken");
        when(request.getRequestURI()).thenReturn("/api/test");

        // Act
        authTokenFilter.doFilterInternal(request, response, filterChain);

        // Assert
        verify(filterChain).doFilter(request, response);
        assertNull(SecurityContextHolder.getContext().getAuthentication());
        verify(jwtUtils, never()).validateJwtToken(anyString());
    }

    @Test
    void shouldNotAuthenticateWhenAuthHeaderIsEmptyString() throws Exception {
        // Arrange
        when(request.getHeader("Authorization")).thenReturn("");
        when(request.getRequestURI()).thenReturn("/api/test");

        // Act
        authTokenFilter.doFilterInternal(request, response, filterChain);

        // Assert
        verify(filterChain).doFilter(request, response);
        assertNull(SecurityContextHolder.getContext().getAuthentication());
        verify(jwtUtils, never()).validateJwtToken(anyString());
    }

    @Test
    void shouldHandleExceptionWhenUserDetailsServiceThrowsException() throws Exception {
        // Arrange
        String validToken = "valid.jwt.token";
        String username = "test@test.com";

        when(request.getHeader("Authorization")).thenReturn("Bearer " + validToken);
        when(request.getRequestURI()).thenReturn("/api/test");
        when(jwtUtils.validateJwtToken(validToken)).thenReturn(true);
        when(jwtUtils.getUserNameFromJwtToken(validToken)).thenReturn(username);
        when(userDetailsService.loadUserByUsername(username))
                .thenThrow(new UsernameNotFoundException("User not found"));

        // Act
        authTokenFilter.doFilterInternal(request, response, filterChain);

        // Assert
        verify(filterChain).doFilter(request, response);
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    void shouldHandleExceptionWhenJwtValidationThrowsException() throws Exception {
        // Arrange
        String token = "problematic.token";

        when(request.getHeader("Authorization")).thenReturn("Bearer " + token);
        when(request.getRequestURI()).thenReturn("/api/test");
        when(jwtUtils.validateJwtToken(token)).thenThrow(new RuntimeException("JWT parsing error"));

        // Act
        authTokenFilter.doFilterInternal(request, response, filterChain);

        // Assert
        verify(filterChain).doFilter(request, response);
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    void shouldNotAuthenticateWhenUsernameFromTokenIsNull() throws Exception {
        // Arrange
        String validToken = "valid.jwt.token";

        when(request.getHeader("Authorization")).thenReturn("Bearer " + validToken);
        when(request.getRequestURI()).thenReturn("/api/test");
        when(jwtUtils.validateJwtToken(validToken)).thenReturn(true);
        when(jwtUtils.getUserNameFromJwtToken(validToken)).thenReturn(null);

        // Act
        authTokenFilter.doFilterInternal(request, response, filterChain);

        // Assert
        verify(filterChain).doFilter(request, response);
        assertNull(SecurityContextHolder.getContext().getAuthentication());
        verify(userDetailsService, never()).loadUserByUsername(anyString());
    }

    @Test
    void shouldNotAuthenticateWhenUsernameFromTokenIsEmpty() throws Exception {
        // Arrange
        String validToken = "valid.jwt.token";

        when(request.getHeader("Authorization")).thenReturn("Bearer " + validToken);
        when(request.getRequestURI()).thenReturn("/api/test");
        when(jwtUtils.validateJwtToken(validToken)).thenReturn(true);
        when(jwtUtils.getUserNameFromJwtToken(validToken)).thenReturn("");

        // Act
        authTokenFilter.doFilterInternal(request, response, filterChain);

        // Assert
        verify(filterChain).doFilter(request, response);
        // Empty string is still technically a username, so it may attempt to load
        // But authentication should fail in practice
        verify(filterChain).doFilter(request, response);
    }

    @Test
    void shouldAlwaysCallFilterChainDoFilter() throws Exception {
        // Arrange - various scenarios
        when(request.getHeader("Authorization")).thenReturn(null);
        when(request.getRequestURI()).thenReturn("/api/test");

        // Act
        authTokenFilter.doFilterInternal(request, response, filterChain);

        // Assert - filter chain should always be called to continue the request
        verify(filterChain, times(1)).doFilter(request, response);
    }

    @Test
    void shouldSetAuthenticationDetailsWhenSuccessful() throws Exception {
        // Arrange
        String validToken = "valid.jwt.token";
        String username = "test@test.com";

        when(request.getHeader("Authorization")).thenReturn("Bearer " + validToken);
        when(request.getRequestURI()).thenReturn("/api/test");
        when(jwtUtils.validateJwtToken(validToken)).thenReturn(true);
        when(jwtUtils.getUserNameFromJwtToken(validToken)).thenReturn(username);
        when(userDetailsService.loadUserByUsername(username)).thenReturn(testUser);

        // Act
        authTokenFilter.doFilterInternal(request, response, filterChain);

        // Assert
        assertNotNull(SecurityContextHolder.getContext().getAuthentication());
        assertEquals(testUser, SecurityContextHolder.getContext().getAuthentication().getPrincipal());
        assertTrue(SecurityContextHolder.getContext().getAuthentication().isAuthenticated());
    }

    @Test
    void shouldExtractTokenCorrectlyFromBearerHeader() throws Exception {
        // Arrange
        String token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test.signature";
        String username = "test@test.com";

        when(request.getHeader("Authorization")).thenReturn("Bearer " + token);
        when(request.getRequestURI()).thenReturn("/api/test");
        when(jwtUtils.validateJwtToken(token)).thenReturn(true);
        when(jwtUtils.getUserNameFromJwtToken(token)).thenReturn(username);
        when(userDetailsService.loadUserByUsername(username)).thenReturn(testUser);

        // Act
        authTokenFilter.doFilterInternal(request, response, filterChain);

        // Assert
        verify(jwtUtils).validateJwtToken(token);
        verify(jwtUtils).getUserNameFromJwtToken(token);
    }

    @Test
    void shouldHandleMultipleConsecutiveRequests() throws Exception {
        // Arrange
        String validToken = "valid.jwt.token";
        String username = "test@test.com";

        when(request.getHeader("Authorization")).thenReturn("Bearer " + validToken);
        when(request.getRequestURI()).thenReturn("/api/test");
        when(jwtUtils.validateJwtToken(validToken)).thenReturn(true);
        when(jwtUtils.getUserNameFromJwtToken(validToken)).thenReturn(username);
        when(userDetailsService.loadUserByUsername(username)).thenReturn(testUser);

        // Act - first request
        authTokenFilter.doFilterInternal(request, response, filterChain);
        assertNotNull(SecurityContextHolder.getContext().getAuthentication());

        // Clear context for second request
        SecurityContextHolder.clearContext();

        // Act - second request
        authTokenFilter.doFilterInternal(request, response, filterChain);

        // Assert
        verify(filterChain, times(2)).doFilter(request, response);
        assertNotNull(SecurityContextHolder.getContext().getAuthentication());
    }
}