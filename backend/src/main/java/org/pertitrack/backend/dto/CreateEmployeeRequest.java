package org.pertitrack.backend.dto;

import jakarta.validation.constraints.*;
import lombok.*;

@Data
public class CreateEmployeeRequest {

    @NotBlank(message = "Employee number is required")
    @Pattern(regexp = "^[0-9]{4}$", message = "Employee number must be exactly 4 digits")
    private String employeeNumber;

    @NotBlank
    @Size(max = 50)
    private String firstName;

    @Size(max = 50)
    @NotBlank
    private String lastName;

    // link employee to user
    private String userId;
}
