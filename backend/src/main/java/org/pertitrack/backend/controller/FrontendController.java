package org.pertitrack.backend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@Controller
public class FrontendController {
    @GetMapping(value = {
            "/",
            "/auth/**",
            "/auth/{path:[^.]*}",
            "/dashboard/{path:[^.]*}",
            "/users/{path:[^.]*}",
            "/settings/{path:[^.]*}",
    })
    public String forward(@PathVariable(required = false) String path) {
        return "forward:/index.html";
    }
}