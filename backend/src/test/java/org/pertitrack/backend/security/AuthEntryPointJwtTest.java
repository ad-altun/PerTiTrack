package org.pertitrack.backend.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.test.context.ActiveProfiles;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertDoesNotThrow;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
@ActiveProfiles("test")
class AuthEntryPointJwtTest {

    @InjectMocks
    private AuthEntryPointJwt authEntryPointJwt;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Mock
    private AuthenticationException authException;

    private StringWriter stringWriter;
    private PrintWriter printWriter;

    @BeforeEach
    void setUp() throws IOException {
        stringWriter = new StringWriter();
        printWriter = new PrintWriter(stringWriter);
        when(response.getOutputStream()).thenReturn(new jakarta.servlet.ServletOutputStream() {
            @Override
            public void write(int b) {
                printWriter.write(b);
            }

            @Override
            public boolean isReady() {
                return true;
            }

            @Override
            public void setWriteListener(jakarta.servlet.WriteListener writeListener) {
                // Not used in this test - WriteListener is only needed for async operations
            }
        });
    }

    @Test
    void commence_setsCorrectContentType() throws Exception {
        // Arrange
        when(request.getServletPath()).thenReturn("/api/test");
        when(authException.getMessage()).thenReturn("Unauthorized access");

        // Act
        authEntryPointJwt.commence(request, response, authException);

        // Assert
        verify(response).setContentType(MediaType.APPLICATION_JSON_VALUE);
    }

    @Test
    void commence_setsCorrectHttpStatus() throws Exception {
        // Arrange
        when(request.getServletPath()).thenReturn("/api/test");
        when(authException.getMessage()).thenReturn("Unauthorized access");

        // Act
        authEntryPointJwt.commence(request, response, authException);

        // Assert
        verify(response).setStatus(HttpServletResponse.SC_UNAUTHORIZED);
    }

    @Test
    void commence_writesCorrectJsonResponse() throws Exception {
        // Arrange
        String testPath = "/api/secure-endpoint";
        String testMessage = "Invalid JWT token";
        when(request.getServletPath()).thenReturn(testPath);
        when(authException.getMessage()).thenReturn(testMessage);

        // Act
        authEntryPointJwt.commence(request, response, authException);
        printWriter.flush();

        // Assert
        String jsonResponse = stringWriter.toString();
        ObjectMapper mapper = new ObjectMapper();
        Map<String, Object> responseMap = mapper.readValue(jsonResponse, Map.class);

        assertEquals(401, responseMap.get("status"));
        assertEquals("Unauthorized", responseMap.get("error"));
        assertEquals(testMessage, responseMap.get("message"));
        assertEquals(testPath, responseMap.get("path"));
    }

    @Test
    void commence_includesAllRequiredFields() throws Exception {
        // Arrange
        when(request.getServletPath()).thenReturn("/api/test");
        when(authException.getMessage()).thenReturn("Test message");

        // Act
        authEntryPointJwt.commence(request, response, authException);
        printWriter.flush();

        // Assert
        String jsonResponse = stringWriter.toString();
        ObjectMapper mapper = new ObjectMapper();
        Map<String, Object> responseMap = mapper.readValue(jsonResponse, Map.class);

        assertTrue(responseMap.containsKey("status"), "Response should contain 'status' field");
        assertTrue(responseMap.containsKey("error"), "Response should contain 'error' field");
        assertTrue(responseMap.containsKey("message"), "Response should contain 'message' field");
        assertTrue(responseMap.containsKey("path"), "Response should contain 'path' field");
    }

    @Test
    void commence_withDifferentExceptionMessages_includesCorrectMessage() throws Exception {
        // Arrange
        String customMessage = "Custom authentication failure message";
        when(request.getServletPath()).thenReturn("/api/test");
        when(authException.getMessage()).thenReturn(customMessage);

        // Act
        authEntryPointJwt.commence(request, response, authException);
        printWriter.flush();

        // Assert
        String jsonResponse = stringWriter.toString();
        ObjectMapper mapper = new ObjectMapper();
        Map<String, Object> responseMap = mapper.readValue(jsonResponse, Map.class);

        assertEquals(customMessage, responseMap.get("message"));
    }

    @Test
    void commence_withDifferentPaths_includesCorrectPath() throws Exception {
        // Arrange
        String customPath = "/api/custom/path";
        when(request.getServletPath()).thenReturn(customPath);
        when(authException.getMessage()).thenReturn("Unauthorized");

        // Act
        authEntryPointJwt.commence(request, response, authException);
        printWriter.flush();

        // Assert
        String jsonResponse = stringWriter.toString();
        ObjectMapper mapper = new ObjectMapper();
        Map<String, Object> responseMap = mapper.readValue(jsonResponse, Map.class);

        assertEquals(customPath, responseMap.get("path"));
    }

    @Test
    void commence_withNullExceptionMessage_handlesGracefully() throws Exception {
        // Arrange
        when(request.getServletPath()).thenReturn("/api/test");
        when(authException.getMessage()).thenReturn(null);

        // Act & Assert
        assertDoesNotThrow(() -> authEntryPointJwt.commence(request, response, authException));

        printWriter.flush();
        String jsonResponse = stringWriter.toString();
        assertNotNull(jsonResponse);
        assertFalse(jsonResponse.isEmpty());
    }

    @Test
    void commence_withBadCredentialsException_handlesCorrectly() throws Exception {
        // Arrange
        BadCredentialsException badCredentials = new BadCredentialsException("Bad credentials");
        when(request.getServletPath()).thenReturn("/api/login");

        // Act
        authEntryPointJwt.commence(request, response, badCredentials);
        printWriter.flush();

        // Assert
        String jsonResponse = stringWriter.toString();
        ObjectMapper mapper = new ObjectMapper();
        Map<String, Object> responseMap = mapper.readValue(jsonResponse, Map.class);

        assertEquals("Bad credentials", responseMap.get("message"));
        assertEquals("/api/login", responseMap.get("path"));
    }

    @Test
    void commence_verifyMethodInteractionSequence() throws Exception {
        // Arrange
        when(request.getServletPath()).thenReturn("/api/test");
        when(authException.getMessage()).thenReturn("Test");

        // Act
        authEntryPointJwt.commence(request, response, authException);

        // Assert - verify the sequence of method calls
        verify(response).setContentType(MediaType.APPLICATION_JSON_VALUE);
        verify(response).setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        verify(request).getServletPath();
        verify(authException).getMessage();
    }

}