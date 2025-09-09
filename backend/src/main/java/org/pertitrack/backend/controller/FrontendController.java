package org.pertitrack.backend.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class FrontendController {
    @RequestMapping(value = {
            "/",
            "/auth/**",
            "/auth/{path:[^.]*}",
            "/dashboard/{path:[^.]*}",
            "/users/{path:[^.]*}",
            "/settings/{path:[^.]*}",
    })
    public String forward() {
        return "forward:/index.html";
    }

}