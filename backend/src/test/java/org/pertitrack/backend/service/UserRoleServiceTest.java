package org.pertitrack.backend.service;

import org.junit.jupiter.api.*;
import org.junit.jupiter.api.extension.*;
import org.mockito.*;
import org.mockito.junit.jupiter.*;
import org.pertitrack.backend.dto.*;
import org.pertitrack.backend.entity.auth.*;
import org.pertitrack.backend.repository.*;
import org.springframework.test.context.*;

import java.time.*;
import java.util.*;

import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
@ActiveProfiles("test")
class UserRoleServiceTest {

    @Mock
    private UserRoleRepository userRoleRepository;

    @InjectMocks
    private UserRoleService userRoleService;

    private UserRole testRole;
    private List<UserRole> testRoles;

    @BeforeEach
    void setUp() {
        testRole = new UserRole();
//        testRole.setId("550e8400-e29b-41d4-a716-446655440000");
        testRole.setName("ADMIN");
        testRole.setDescription("System administrator");
        testRole.setPermissions("[\"USER_MANAGEMENT\", \"ROLE_MANAGEMENT\"]");
        testRole.setCreatedAt(LocalDateTime.now());

        testRoles = Arrays.asList(
                testRole,
                new UserRole("MANAGER", "Manager role", "[\"EMPLOYEE_MANAGEMENT\"]", LocalDateTime.now()),
                new UserRole("EMPLOYEE", "Employee role", "[\"TIME_TRACKING\"]", LocalDateTime.now())
        );
    }

    // getAllUserRoles tests
    @Test
    void getAllUserRoles_returnsAllRoles_whenCalled() {
        // arrange
        when(userRoleRepository.findAllByOrderByName()).thenReturn(testRoles);

        // act
        List<UserRoleDto> result = userRoleService.getAllUserRoles();

        // assert
        assert(result.size() == 3);
//        assert(result.getFirst().getId().equals(testRole.getId()));
        assert(result.getFirst().getName().equals(testRole.getName()));
        assert(result.getFirst().getDescription().equals(testRole.getDescription()));
        assert(result.getFirst().getPermissions().equals(testRole.getPermissions()));
        assert(result.getFirst().getCreatedAt().equals(testRole.getCreatedAt()));

        verify(userRoleRepository).findAllByOrderByName();
    }

    @Test
    void getAllUserRoles_returnsEmptyList_whenNoRolesExist() {
        // arrange
        when(userRoleRepository.findAllByOrderByName()).thenReturn(List.of());

        // act
        List<UserRoleDto> result = userRoleService.getAllUserRoles();

        // assert
        assert(result.isEmpty());

        verify(userRoleRepository).findAllByOrderByName();
    }

    //     void getRoleById tests
    @Test
    void getRoleById_withExistingRole_returnsRole() {
        // arrange
        when(userRoleRepository.findById(testRole.getId())).thenReturn(Optional.of(testRole));

        // act
        Optional<UserRoleDto> result = userRoleService.getRoleById(testRole.getId());

        // assert
        assert(result.isPresent());
//        assert(result.get().getId().equals(testRole.getId()));
        assert(result.get().getName().equals(testRole.getName()));
        assert(result.get().getDescription().equals(testRole.getDescription()));
        assert(result.get().getPermissions().equals(testRole.getPermissions()));
        assert(result.get().getCreatedAt().equals(testRole.getCreatedAt()));

        verify(userRoleRepository).findById(testRole.getId());
    }

    @Test
    void getRoleById_withNonExistentRole_returnsNotFound() {
        // arrange
        when(userRoleRepository.findById(testRole.getId())).thenReturn(Optional.empty());

        // act
        Optional<UserRoleDto> result = userRoleService.getRoleById(testRole.getId());

        // assert
        assert(result.isEmpty());

        verify(userRoleRepository).findById(testRole.getId());
    }

    // getRolesByPermission tests
    @Test
    void getRolesByPermission_withMatchingPermission_returnsRoles() {
        // arrange
        when(userRoleRepository.findUserRoleByPermissionsContainsIgnoreCase(
                testRole.getPermissions())).thenReturn(List.of(testRole, testRole));

        // act
        List<UserRoleDto> result = userRoleService.getRolesByPermission(testRole.getPermissions());

        // assert
        assert(result.size() == 2);
//        assert(result.getFirst().getId().equals(testRole.getId()));
        assert(result.getFirst().getName().equals(testRole.getName()));
        assert(result.getFirst().getDescription().equals(testRole.getDescription()));
        assert(result.getFirst().getPermissions().equals(testRole.getPermissions()));
        assert(result.getFirst().getCreatedAt().equals(testRole.getCreatedAt()));
    }

}

