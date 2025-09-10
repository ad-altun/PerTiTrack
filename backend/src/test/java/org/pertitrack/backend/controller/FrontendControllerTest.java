package org.pertitrack.backend.controller;

import org.junit.jupiter.api.Test;
import org.pertitrack.backend.security.JwtUtils;
import org.pertitrack.backend.security.UserDetailsServiceImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.forwardedUrl;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(FrontendController.class)
@ActiveProfiles("test")
@AutoConfigureMockMvc(addFilters = false)
class FrontendControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean(name = "jwtUtils")
    private JwtUtils jwtUtils;

    @MockitoBean(name = "userDetailsServiceImpl")
    private UserDetailsServiceImpl userDetailsServiceImpl;

    @Test
    void forward_rootPath_returnsIndexHtml() throws Exception {
        mockMvc.perform(get("/"))
                .andExpect(status().isOk())
                .andExpect(forwardedUrl("/index.html"));
    }

    @Test
    void forward_dashboardPath_returnsIndexHtml() throws Exception {
        mockMvc.perform(get("/dashboard/overview"))
                .andExpect(status().isOk())
                .andExpect(forwardedUrl("/index.html"));
    }

}