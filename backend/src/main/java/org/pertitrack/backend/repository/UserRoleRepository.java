package org.pertitrack.backend.repository;

import org.pertitrack.backend.entity.auth.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, UUID> {

    // Find all roles ordered by name
    // @return list of roles ordered alphabetically by name
    List<UserRole> findAllByOrderByName();

    List<UserRole> findUserRoleByPermissionsContainsIgnoreCase(String permission);

}
