package org.pertitrack.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.pertitrack.backend.dto.PasswordChangeRequest;
import org.pertitrack.backend.security.JwtUtils;
import org.pertitrack.backend.service.SettingsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Import(JwtUtils.class)

@WebMvcTest(SettingsController.class)
@AutoConfigureMockMvc
@ActiveProfiles("test")
class SettingsControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockitoBean
    private org.pertitrack.backend.security.UserDetailsServiceImpl userDetailsService;

    @MockitoBean
    private org.pertitrack.backend.security.JwtUtils jwtUtils;

    @MockitoBean
    private SettingsService settingsService;

    private PasswordChangeRequest validPasswordChangeRequest;
    private String testUserId;

    @BeforeEach
    void setUp() {
        testUserId = "550e8400-e29b-41d4-a716-446655440000";

        validPasswordChangeRequest = new PasswordChangeRequest(
                "OldPassword123!",
                "NewPassword456!",
                "NewPassword456!"
        );
    }

    @Test
    @WithMockUser
    void changePassword_withValidRequest_returnsSuccessMessage() throws Exception {
        // Arrange
        doNothing().when(settingsService).changePassword(eq(testUserId), any(PasswordChangeRequest.class));

        // Act & Assert
        mockMvc.perform(put("/api/settings/users/{userId}/change-password", testUserId)
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validPasswordChangeRequest)))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.message").value("Password changed successfully."));

        // Verify service was called
        verify(settingsService, times(1)).changePassword(eq(testUserId), any(PasswordChangeRequest.class));
    }

    @Test
    @WithMockUser
    void changePassword_withDifferentUserId_callsServiceWithCorrectId() throws Exception {
        // Arrange
        String differentUserId = "660e8400-e29b-41d4-a716-446655440001";
        doNothing().when(settingsService).changePassword(eq(differentUserId), any(PasswordChangeRequest.class));

        // Act & Assert
        mockMvc.perform(put("/api/settings/users/{userId}/change-password", differentUserId)
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validPasswordChangeRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Password changed successfully."));

        // Verify service was called with correct userId
        verify(settingsService, times(1)).changePassword(eq(differentUserId), any(PasswordChangeRequest.class));
    }

    @Test
    void changePassword_withoutAuthentication_returnsUnauthorized() throws Exception {
        // Act & Assert
        mockMvc.perform(put("/api/settings/users/{userId}/change-password", testUserId)
                        .with(csrf())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validPasswordChangeRequest)))
                .andExpect(status().isUnauthorized());

        // Verify service was never called
        verify(settingsService, never()).changePassword(anyString(), any(PasswordChangeRequest.class));
    }
}

