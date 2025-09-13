package org.pertitrack.backend.dto;

import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UpdateEmployeeRequest {

    @Size(max = 20)
    private String employeeNumber;

    @Size(max = 50)
    private String firstName;

    @Size(max = 50)
    private String lastName;

    private boolean isActive;

    // link employee to user
    private String userId;
}
