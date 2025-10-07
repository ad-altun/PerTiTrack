package org.pertitrack.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class SpaWebConfig implements WebMvcConfigurer {

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        // top level: e.g., /dashboard, /settings
        registry.addViewController("/{p1:^(?!auth|api|assets)[^.]*}")
                .setViewName("forward:/index.html");

        // nested routes: remaining segments no dots
        // e.g., /dashboard/project, /settings/users/1234567890
        registry.addViewController("/{p1:^(?!auth|api|assets)[^.]*}/**/{path:[^.]*}")
                .setViewName("forward:/index.html");
    }
}
