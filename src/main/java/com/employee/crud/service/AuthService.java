package com.employee.crud.service;

import com.employee.crud.config.JwtUtil;
import com.employee.crud.model.User;
import com.employee.crud.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository userRepo;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthService(UserRepository userRepo, PasswordEncoder passwordEncoder, JwtUtil jwtUtil) {
        this.userRepo = userRepo;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    public User register(User user) {
        if (userRepo.findByEmail(user.getEmail()) != null) {
            return null;
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setRole(user.getRole() == null ? "USER" : user.getRole());
        return userRepo.save(user);
    }

    public String login(String email, String password) {
        User user = userRepo.findByEmail(email);
        if (user == null) return null;
        if (!passwordEncoder.matches(password, user.getPassword())) return null;
        return jwtUtil.generateToken(user.getEmail());
    }
}
