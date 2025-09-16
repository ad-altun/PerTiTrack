package org.pertitrack.backend.entity.auth;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.context.ActiveProfiles;

import java.util.Collection;

import static org.junit.jupiter.api.Assertions.*;

@ActiveProfiles("test")
class UserTest {

    private User user;

    @BeforeEach
    void setUp() {
        user = new User();
//        user.setId("550e8400-e29b-41d4-a716-446655440000");
        user.setEmail("test@test.com");
        user.setPassword("password123");
        user.setFirstName("John");
        user.setLastName("Doe");
        user.setRole(User.Role.EMPLOYEE);
        user.setEnabled(true);
    }

    @Test
    void getUsername_returnsEmail() {
        // Act
        String username = user.getUsername();

        // Assert
        assertEquals("test@test.com", username);
        assertEquals(user.getEmail(), username);
    }

    @Test
    void isAccountNonExpired_returnsTrue() {
        // Act
        boolean result = user.isAccountNonExpired();

        // Assert
        assertTrue(result);
    }

    @Test
    void isAccountNonLocked_returnsTrue() {
        // Act
        boolean result = user.isAccountNonLocked();

        // Assert
        assertTrue(result);
    }

    @Test
    void isCredentialsNonExpired_returnsTrue() {
        // Act
        boolean result = user.isCredentialsNonExpired();

        // Assert
        assertTrue(result);
    }

    @Test
    void getFullName_returnsFirstNameAndLastName() {
        // Act
        String fullName = user.getFullName();

        // Assert
        assertEquals("John Doe", fullName);
    }

    @Test
    void isEnabled_returnsEnabledStatus() {
        // Test when enabled is true
        user.setEnabled(true);
        assertTrue(user.isEnabled());

        // Test when enabled is false
        user.setEnabled(false);
        assertFalse(user.isEnabled());
    }

    @Test
    void getAuthorities_withEmployeeRole_returnsEmployeeAuthority() {
        // Arrange
        user.setRole(User.Role.EMPLOYEE);

        // Act
        Collection<? extends GrantedAuthority> authorities = user.getAuthorities();

        // Assert
        assertNotNull(authorities);
        assertEquals(1, authorities.size());
        assertTrue(authorities.contains(new SimpleGrantedAuthority("ROLE_EMPLOYEE")));
    }
}