package com.employee.crud.controller;

import com.employee.crud.dto.ApiResponse;
import com.employee.crud.model.UserDatabase;
import com.employee.crud.service.DatabaseService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/db")
public class DatabaseController {

    private final DatabaseService service;

    public DatabaseController(DatabaseService service) {
        this.service = service;
    }

    @PostMapping("/create")
    public ApiResponse<String> createDb(@RequestParam String name) {
        String result = service.createDatabase(name);

        if (result.equals("SUCCESS"))
            return ApiResponse.ok("Database created");

        return ApiResponse.fail(result);
    }

    @GetMapping("/list")
    public ApiResponse<List<UserDatabase>> listDb() {
        return ApiResponse.ok(service.listDatabases());
    }
}
