package com.employee.crud.controller;

import com.employee.crud.model.LoginRequest;
import com.employee.crud.model.User;
import com.employee.crud.service.AuthService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService service;

    public AuthController(AuthService service) {
        this.service = service;
    }

    @PostMapping("/register")
    public User register(@RequestBody User user) {
        return service.register(user);
    }

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request) {
        return service.login(request.getEmail(), request.getPassword());
    }
}
