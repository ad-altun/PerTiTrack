package org.pertitrack.backend.controller;

import org.pertitrack.backend.entity.auth.UserRole;
import org.pertitrack.backend.service.UserRoleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.UUID;

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
    @PreAuthorize( "hasRole('ROLE_ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<List<UserRole>> getAllUserRoles() {
        try {
            List<UserRole> roles = userRoleService.getAllUserRoles();
            return ResponseEntity.ok(roles);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // get a user role by @param = id
    // @return the user role if found
    @GetMapping("/{id}")
    @PreAuthorize( "hasRole('ROLE_ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<UserRole> getRoleById(@PathVariable UUID id) {
        try {
            UserRole role = userRoleService.getRoleById(id);
            return ResponseEntity.ok(role);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // find roles by permission
    // @param permission: permission to search for role
    // @return list of roles containing the permission
    @GetMapping("/permissions/{permission}")
    @PreAuthorize( "hasRole('ROLE_ADMIN') or hasRole('MANAGER')")
    public ResponseEntity<List<UserRole>> getRolesByPermission(@PathVariable String permission) {
        try {
            List<UserRole> roles = userRoleService.getRolesByPermission(permission);
            return ResponseEntity.ok(roles);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

}
