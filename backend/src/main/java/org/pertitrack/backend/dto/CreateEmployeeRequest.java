package org.pertitrack.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class CreateEmployeeRequest {

    @NotBlank
    @Size(max = 20)
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
