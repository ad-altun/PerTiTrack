package org.pertitrack.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.pertitrack.backend.dto.UserRoleDto;
import org.pertitrack.backend.security.JwtUtils;
import org.pertitrack.backend.security.UserDetailsServiceImpl;
import org.pertitrack.backend.service.UserRoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@Import(JwtUtils.class)

@WebMvcTest(UserRoleController.class)
@ExtendWith(MockitoExtension.class)
@AutoConfigureMockMvc(addFilters = false)
@ActiveProfiles("test")
class UserRoleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private UserRoleService userRoleService;

    @MockitoBean
    private JwtUtils jwtUtils;

    @MockitoBean
    private UserDetailsServiceImpl userDetailsService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
//    @WithMockUser(username = "testuser", roles = {"ADMIN"})
    void testGetAllRoles() throws Exception {
        UserRoleDto role = new UserRoleDto(
                UUID.randomUUID(), "ADMIN", "Admin role", "[\"READ\",\"WRITE\"]", LocalDateTime.now()
        );

        Mockito.when(userRoleService.getAllUserRoles()).thenReturn(List.of(role));

        mockMvc.perform(get("/api/user-roles"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].name", is("ADMIN")));
    }

    @Test
    void testGetRoleById() throws Exception {
        UUID id = UUID.randomUUID();
        UserRoleDto role = new UserRoleDto(id, "USER", "User role", "[\"READ\"]", LocalDateTime.now());

        Mockito.when(userRoleService.getRoleById(id)).thenReturn(Optional.of(role));

        mockMvc.perform(get("/api/user-roles/{id}", id))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name", is("USER")));
    }

    @Test
    void testGetRolesByPermission() throws Exception {
        UserRoleDto role1 = new UserRoleDto(UUID.randomUUID(), "USER", "User role", "[\"READ\"]", LocalDateTime.now());
        UserRoleDto role2 = new UserRoleDto(UUID.randomUUID(), "ADMIN", "Admin role", "[\"READ\",\"WRITE\"]", LocalDateTime.now());

        Mockito.when(userRoleService.getRolesByPermission("READ")).thenReturn(List.of(role1, role2));

        mockMvc.perform(get("/api/user-roles/permissions/READ"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[0].name", is("USER")))
                .andExpect(jsonPath("$[1].name", is("ADMIN")));
    }

}