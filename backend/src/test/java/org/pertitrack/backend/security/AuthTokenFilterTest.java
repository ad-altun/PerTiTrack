package org.pertitrack.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.context.SecurityContextHolder;

import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class AuthTokenFilterTest {

    @InjectMocks
    private AuthTokenFilter authTokenFilter;

    @Mock
    private JwtUtils jwtUtils;

    @Mock
    private UserDetailsServiceImpl userDetailsService;

    @Mock
    private FilterChain filterChain;

    @Mock
    private HttpServletRequest request;

    @Mock
    private HttpServletResponse response;

    @Test
    void shouldNotAuthenticateWhenNoAuthHeader() throws Exception {
        when(request.getHeader("Authorization")).thenReturn(null);

        authTokenFilter.doFilterInternal(request, response, filterChain);

        verify(filterChain).doFilter(request, response);
        assertNull(SecurityContextHolder.getContext().getAuthentication());

    }

    @Test
    void shouldNotAuthenticateWhenAuthHeaderIsInvalid() throws Exception {
        when(request.getHeader("Authorization")).thenReturn("Bearer invalid");

        authTokenFilter.doFilterInternal(request, response, filterChain);

        verify(filterChain).doFilter(request, response);
        assertNull(SecurityContextHolder.getContext().getAuthentication());
    }

    @Test
    void shouldNotAuthenticateWhenTokenIsExpired() throws Exception {
        when(request.getHeader("Authorization")).thenReturn("Bearer expired");
        when(jwtUtils.validateJwtToken("expired")).thenReturn(false);

        authTokenFilter.doFilterInternal(request, response, filterChain);

        verify(filterChain).doFilter(request, response);
        assertNull(SecurityContextHolder.getContext().getAuthentication());

    }

}