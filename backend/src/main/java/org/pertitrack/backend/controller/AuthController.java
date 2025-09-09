package org.pertitrack.backend.controller;

import jakarta.validation.Valid;
import org.pertitrack.backend.dto.JwtResponse;
import org.pertitrack.backend.dto.LoginRequest;
import org.pertitrack.backend.dto.MessageResponse;
import org.pertitrack.backend.dto.SignupRequest;
import org.pertitrack.backend.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/signin")
    public ResponseEntity<JwtResponse> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        return authService.authenticateUser(loginRequest);
    }

    @PostMapping("/signup")
    public ResponseEntity<MessageResponse> registerUser(@Valid @RequestBody SignupRequest signUpRequest) {
        return authService.registerUser(signUpRequest);
    }

    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logoutUser() {
        return authService.logoutUser();
    }
}
