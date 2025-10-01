package org.pertitrack.backend.service;

import org.pertitrack.backend.dto.UserRoleDto;
import org.pertitrack.backend.entity.auth.UserRole;
import org.pertitrack.backend.repository.UserRoleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class UserRoleService {

    private final UserRoleRepository userRoleRepository;

    public UserRoleService(UserRoleRepository userRoleRepository) {
        this.userRoleRepository = userRoleRepository;
    }

    private UserRoleDto toDto(UserRole role) {
        return new UserRoleDto(
                role.getId(),
                role.getName(),
                role.getDescription(),
                role.getPermissions(),
                role.getCreatedAt()
        );
    }

    // Get all user roles
    // @return list of all user roles
    @Transactional(readOnly = true)
    public List<UserRoleDto> getAllUserRoles() {
        return userRoleRepository.findAllByOrderByName()
                .stream().map(this::toDto)
                .toList();
    }

    // get a user role by @param = id
    // @return the user role if found
    @Transactional(readOnly = true)
    public Optional<UserRoleDto> getRoleById(String id) {
        return userRoleRepository.findById(id).map(this::toDto);
    }

    // find roles by permission
    // @param permission: permission to search for role
    // @return list of roles containing the permission
    @Transactional(readOnly = true)
    public List<UserRoleDto> getRolesByPermission(String permission) {
        return userRoleRepository.findUserRoleByPermissionsContainsIgnoreCase(permission)
                .stream().map(this::toDto)
                .toList();
    }


}
