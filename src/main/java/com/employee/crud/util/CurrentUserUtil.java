package com.employee.crud.util;

import com.employee.crud.model.User;
import com.employee.crud.repository.UserRepository;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class CurrentUserUtil {

    private final UserRepository userRepo;

    public CurrentUserUtil(UserRepository userRepo) {
        this.userRepo = userRepo;
    }

    public User getCurrentUser() {
        var auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null) return null;
        String email = auth.getName();
        if (email == null) return null;
        return userRepo.findByEmail(email);
    }
}
