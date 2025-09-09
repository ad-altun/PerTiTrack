package org.pertitrack.backend.config;

import org.pertitrack.backend.security.AuthEntryPointJwt;
import org.pertitrack.backend.security.AuthTokenFilter;
import org.pertitrack.backend.security.UserDetailsServiceImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;


@Configuration
@EnableWebSecurity
public class WebSecurityConfig {

    private final UserDetailsServiceImpl userDetailsService;
    private final AuthEntryPointJwt unauthorizedHandler;
    private final AuthTokenFilter authenticationJwtTokenFilter;
//    @Value("${app.allowed-origins}")
//    private List<String> allowedOrigins;


    public WebSecurityConfig(UserDetailsServiceImpl userDetailsService,
                             AuthEntryPointJwt unauthorizedHandler,
                             AuthTokenFilter authenticationJwtTokenFilter) {
        this.userDetailsService = userDetailsService;
        this.unauthorizedHandler = unauthorizedHandler;
        this.authenticationJwtTokenFilter = authenticationJwtTokenFilter;
    }

    // client request first encounters the SecurityFilterChain
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .exceptionHandling(exception -> exception.authenticationEntryPoint(unauthorizedHandler))
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth ->
                        auth.requestMatchers("/auth/**", "/api/auth/**").permitAll()
                                .requestMatchers("/", "/index.html", "/assets/**", "/favicon.svg").permitAll()
                                .anyRequest().authenticated()
                )
                .userDetailsService(userDetailsService)
                // Intercept the request, extract the username and password,
                // then create an Authentication object with status set to unauthenticated.
                .addFilterBefore(authenticationJwtTokenFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    // filter delegates the authentication process to the AuthenticationManager.
    // iterate through the available AuthenticationProviders until one can authenticate the request
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOriginPatterns(List.of("http://localhost:5173"));

        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

}
