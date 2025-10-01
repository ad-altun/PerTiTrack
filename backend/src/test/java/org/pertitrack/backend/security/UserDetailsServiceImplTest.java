package org.pertitrack.backend.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.pertitrack.backend.entity.auth.User;
import org.pertitrack.backend.repository.UserRepository;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertInstanceOf;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.verifyNoMoreInteractions;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@ActiveProfiles("test")
class UserDetailsServiceImplTest {

    @InjectMocks
    private UserDetailsServiceImpl userDetailsService;

    @Mock
    private UserRepository userRepository;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User();
//        testUser.setId("550e8400-e29b-41d4-a716-446655440000");
        testUser.setEmail("test@test.com");
        testUser.setPassword("encodedPassword123");
        testUser.setFirstName("John");
        testUser.setLastName("Doe");
        testUser.setRole(User.Role.EMPLOYEE);
        testUser.setEnabled(true);
    }

    @Test
    void loadUserByUsername_withValidEmail_returnsUserDetails() {
        // Arrange
        String email = "test@test.com";
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(testUser));

        // Act
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);

        // Assert
        assertNotNull(userDetails);
        assertEquals(email, userDetails.getUsername());
        assertEquals(testUser.getPassword(), userDetails.getPassword());
        assertTrue(userDetails.isEnabled());
        verify(userRepository, times(1)).findByEmail(email);
    }

    @Test
    void loadUserByUsername_withNonExistentEmail_throwsUsernameNotFoundException() {
        // Arrange
        String email = "nonexistent@test.com";
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        // Act & Assert
        UsernameNotFoundException exception = assertThrows(
                UsernameNotFoundException.class,
                () -> userDetailsService.loadUserByUsername(email)
        );

        assertTrue(exception.getMessage().contains("User Not Found: " + email));
        verify(userRepository, times(1)).findByEmail(email);
    }

    @Test
    void loadUserByUsername_returnsUserWithCorrectAuthorities() {
        // Arrange
        String email = "test@test.com";
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(testUser));

        // Act
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);

        // Assert
        assertNotNull(userDetails.getAuthorities());
        assertEquals(1, userDetails.getAuthorities().size());

        GrantedAuthority authority = userDetails.getAuthorities().iterator().next();
        assertEquals("ROLE_EMPLOYEE", authority.getAuthority());
    }

    @Test
    void loadUserByUsername_withAdminUser_returnsAdminAuthority() {
        // Arrange
        testUser.setRole(User.Role.ADMIN);
        String email = "admin@test.com";
        testUser.setEmail(email);
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(testUser));

        // Act
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);

        // Assert
        GrantedAuthority authority = userDetails.getAuthorities().iterator().next();
        assertEquals("ROLE_ADMIN", authority.getAuthority());
    }

    @Test
    void loadUserByUsername_withManagerUser_returnsManagerAuthority() {
        // Arrange
        testUser.setRole(User.Role.MANAGER);
        String email = "manager@test.com";
        testUser.setEmail(email);
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(testUser));

        // Act
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);

        // Assert
        GrantedAuthority authority = userDetails.getAuthorities().iterator().next();
        assertEquals("ROLE_MANAGER", authority.getAuthority());
    }

    @Test
    void loadUserByUsername_returnsUserWithCorrectAccountStatus() {
        // Arrange
        String email = "test@test.com";
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(testUser));

        // Act
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);

        // Assert
        assertTrue(userDetails.isAccountNonExpired());
        assertTrue(userDetails.isAccountNonLocked());
        assertTrue(userDetails.isCredentialsNonExpired());
        assertTrue(userDetails.isEnabled());
    }

    @Test
    void loadUserByUsername_callsRepositoryOnlyOnce() {
        // Arrange
        String email = "test@test.com";
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(testUser));

        // Act
        userDetailsService.loadUserByUsername(email);

        // Assert
        verify(userRepository, times(1)).findByEmail(email);
        verifyNoMoreInteractions(userRepository);
    }

    @Test
    void loadUserByUsername_withCaseInsensitiveEmail_usesExactProvidedCase() {
        // Arrange
        String emailUpperCase = "TEST@TEST.COM";
        User upperCaseUser = new User();
        upperCaseUser.setEmail(emailUpperCase);
        upperCaseUser.setPassword("password");
        upperCaseUser.setFirstName("Test");
        upperCaseUser.setLastName("User");
        upperCaseUser.setRole(User.Role.EMPLOYEE);
        upperCaseUser.setEnabled(true);

        when(userRepository.findByEmail(emailUpperCase)).thenReturn(Optional.of(upperCaseUser));

        // Act
        UserDetails userDetails = userDetailsService.loadUserByUsername(emailUpperCase);

        // Assert
        assertNotNull(userDetails);
        verify(userRepository, times(1)).findByEmail(emailUpperCase);
    }

    @Test
    void loadUserByUsername_exceptionMessageContainsUsername() {
        // Arrange
        String email = "notfound@test.com";
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        // Act & Assert
        UsernameNotFoundException exception = assertThrows(
                UsernameNotFoundException.class,
                () -> userDetailsService.loadUserByUsername(email)
        );

        String expectedMessage = "User Not Found: " + email;
        assertEquals(expectedMessage, exception.getMessage());
    }

    @Test
    void loadUserByUsername_withEmptyEmail_throwsUsernameNotFoundException() {
        // Arrange
        String emptyEmail = "";
        when(userRepository.findByEmail(emptyEmail)).thenReturn(Optional.empty());

        // Act & Assert
        UsernameNotFoundException exception = assertThrows(
                UsernameNotFoundException.class,
                () -> userDetailsService.loadUserByUsername(emptyEmail)
        );

        assertTrue(exception.getMessage().contains("User Not Found: " + emptyEmail));
        verify(userRepository, times(1)).findByEmail(emptyEmail);
    }

    @Test
    void loadUserByUsername_returnsUserEntityDirectly() {
        // Arrange
        String email = "test@test.com";
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(testUser));

        // Act
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);

        // Assert
        // Since User implements UserDetails, the returned object should be the User entity itself
        assertInstanceOf(User.class, userDetails);
        User returnedUser = (User) userDetails;
        assertEquals(testUser.getId(), returnedUser.getId());
        assertEquals(testUser.getEmail(), returnedUser.getEmail());
        assertEquals(testUser.getFirstName(), returnedUser.getFirstName());
        assertEquals(testUser.getLastName(), returnedUser.getLastName());
    }

    @Test
    void loadUserByUsername_withDifferentEmails_callsRepositoryWithCorrectEmail() {
        // Arrange
        String email1 = "user1@test.com";
        String email2 = "user2@test.com";

        User user1 = new User();
        user1.setEmail(email1);
        user1.setPassword("password1");
        user1.setFirstName("User");
        user1.setLastName("One");
        user1.setRole(User.Role.EMPLOYEE);
        user1.setEnabled(true);

        when(userRepository.findByEmail(email1)).thenReturn(Optional.of(user1));

        // Act
        UserDetails userDetails = userDetailsService.loadUserByUsername(email1);

        // Assert
        assertEquals(email1, userDetails.getUsername());
        verify(userRepository, times(1)).findByEmail(email1);
        verify(userRepository, never()).findByEmail(email2);
    }

    @Test
    void loadUserByUsername_withNullEmail_throwsUsernameNotFoundException() {
        // Arrange
        when(userRepository.findByEmail(null)).thenReturn(Optional.empty());

        // Act & Assert
        assertThrows(
                UsernameNotFoundException.class,
                () -> userDetailsService.loadUserByUsername(null)
        );

        verify(userRepository, times(1)).findByEmail(null);
    }

    @Test
    void loadUserByUsername_withDisabledUser_returnsDisabledUserDetails() {
        // Arrange
        testUser.setEnabled(false);
        String email = "test@test.com";
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(testUser));

        // Act
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);

        // Assert
        assertNotNull(userDetails);
        assertFalse(userDetails.isEnabled());
    }
}
