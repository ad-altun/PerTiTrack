package org.pertitrack.backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.pertitrack.backend.dto.UserRoleDto;
import org.pertitrack.backend.entity.auth.UserRole;
import org.pertitrack.backend.repository.UserRoleRepository;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

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
        testRole.setId(UUID.fromString("550e8400-e29b-41d4-a716-446655440000"));
        testRole.setName("ADMIN");
        testRole.setDescription("System administrator");
        testRole.setPermissions("[\"USER_MANAGEMENT\", \"ROLE_MANAGEMENT\"]");
        testRole.setCreatedAt(LocalDateTime.now());

        testRoles = Arrays.asList(
                testRole,
                new UserRole(UUID.randomUUID(), "MANAGER", "Manager role", "[\"EMPLOYEE_MANAGEMENT\"]", LocalDateTime.now()),
                new UserRole(UUID.randomUUID(), "EMPLOYEE", "Employee role", "[\"TIME_TRACKING\"]", LocalDateTime.now())
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
        assert(result.getFirst().getId().equals(testRole.getId()));
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
        assert(result.get().getId().equals(testRole.getId()));
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
        assert(result.getFirst().getId().equals(testRole.getId()));
        assert(result.getFirst().getName().equals(testRole.getName()));
        assert(result.getFirst().getDescription().equals(testRole.getDescription()));
        assert(result.getFirst().getPermissions().equals(testRole.getPermissions()));
        assert(result.getFirst().getCreatedAt().equals(testRole.getCreatedAt()));
    }

}

