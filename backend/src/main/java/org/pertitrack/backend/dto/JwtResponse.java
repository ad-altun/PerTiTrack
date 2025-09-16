package org.pertitrack.backend.dto;

import lombok.Data;

import java.util.List;

@Data
public class JwtResponse {
    private String token;
    private String type = "Bearer";
    private String id;
    private String email;
    private String firstName;
    private String lastName;
    private List<String> roles;

    private String employeeId;
    private String employeeNumber;

    public JwtResponse(String token,
                       String id,
                       String email,
                       String firstName,
                       String lastName,
                       List<String> roles,
                       String employeeId,
                       String employeeNumber) {
        this.token = token;
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.roles = roles;
        this.employeeId = employeeId;
        this.employeeNumber = employeeNumber;
    }
}
