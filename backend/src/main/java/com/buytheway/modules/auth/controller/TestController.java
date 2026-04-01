package com.buytheway.modules.auth.controller;

import com.buytheway.common.utils.AuthUtil;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class TestController {

    @GetMapping("/test")
    public String test() {
        String userId = AuthUtil.getCurrentUserId();
        return "Authenticated user: " + userId;
    }
}