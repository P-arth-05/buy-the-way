package com.buytheway.modules.auth.controller;

import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/test")
    public String test(Authentication authentication) {
        String userId = authentication != null ? authentication.getName() : "anonymous";
        return "Authenticated user: " + userId;
    }
}