package com.employee.crud.controller;

import com.employee.crud.model.LoginRequest;
import com.employee.crud.model.User;
import com.employee.crud.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final AuthService service;

    public AuthController(AuthService service) {
        this.service = service;
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        User saved = service.register(user);
        if (saved == null) {
            return ResponseEntity.badRequest().body(Map.of(
                    "success", false,
                    "message", "Email already exists"
            ));
        }

        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "User registered successfully"
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        String token = service.login(request.getEmail(), request.getPassword());

        if (token == null) {
            return ResponseEntity.status(401).body(Map.of(
                    "success", false,
                    "message", "Invalid email or password"
            ));
        }

        return ResponseEntity.ok(Map.of(
                "success", true,
                "token", token
        ));
    }
}
