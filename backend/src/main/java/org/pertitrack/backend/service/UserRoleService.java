package org.pertitrack.backend.service;

import org.pertitrack.backend.entity.auth.UserRole;
import org.pertitrack.backend.repository.UserRoleRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@Transactional
public class UserRoleService {

    private final UserRoleRepository userRoleRepository;

    public UserRoleService(UserRoleRepository userRoleRepository) {
        this.userRoleRepository = userRoleRepository;
    }

    // Get all user roles
    // @return list of all user roles
    @Transactional(readOnly = true)
    public List<UserRole> getAllUserRoles() {
        return userRoleRepository.findAllByOrderByName();
    }

    // get a user role by @param = id
    // @return the user role if found
    @Transactional(readOnly = true)
    public UserRole getRoleById(UUID id) {
        return userRoleRepository.findById(id).orElse(null);
    }

    // find roles by permission
    // @param permission: permission to search for role
    // @return list of roles containing the permission
    @Transactional(readOnly = true)
    public List<UserRole> getRolesByPermission(String permission) {
        return userRoleRepository.findUserRoleByPermissionsContainsIgnoreCase(permission);
    }


}
