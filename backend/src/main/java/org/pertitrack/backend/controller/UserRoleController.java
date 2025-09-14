package org.pertitrack.backend.controller;

import org.pertitrack.backend.dto.UserRoleDto;
import org.pertitrack.backend.service.UserRoleService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/user-roles")
public class UserRoleController {

    private final UserRoleService userRoleService;

    public UserRoleController(UserRoleService userRoleService) {
        this.userRoleService = userRoleService;
    }

    // Get all user roles
    // @return list of all user roles
    @GetMapping
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('MANAGER')")
    public List<UserRoleDto> getAllUserRoles() {
        return userRoleService.getAllUserRoles();
    }

    // get a user role by @param = id
    // @return the user role if found
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<UserRoleDto> getRoleById(@PathVariable String id) {

        return userRoleService.getRoleById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());

    }

    // find roles by permission
    // @param permission: permission to search for role
    // @return list of roles containing the permission
    @GetMapping("/permissions/{permission}")
    @PreAuthorize("hasRole('ROLE_ADMIN') or hasRole('MANAGER')")
    public List<UserRoleDto> getRolesByPermission(@PathVariable String permission) {

            return userRoleService.getRolesByPermission(permission);

    }

}
