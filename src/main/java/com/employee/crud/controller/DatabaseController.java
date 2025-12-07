package com.employee.crud.controller;

import com.employee.crud.model.UserDatabase;
import com.employee.crud.service.DatabaseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/db")
public class DatabaseController {

    private final DatabaseService service;

    public DatabaseController(DatabaseService service) {
        this.service = service;
    }

    @PostMapping("/create")
    public ResponseEntity<?> createDatabase(@RequestBody Map<String, String> request) {
        String dbName = request.get("dbName");
        String result = service.createDatabase(dbName);

        return ResponseEntity.ok(Map.of("status", result));
    }

    @GetMapping("/list")
    public List<UserDatabase> list() {
        return service.listDatabases();
    }
}
