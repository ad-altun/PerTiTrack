package org.pertitrack.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserRoleDto {

    private UUID id;

    @NotBlank
    private String name;

    private String description;

    private String permissions;

    private LocalDateTime createdAt;

}
