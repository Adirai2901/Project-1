package com.employee.crud.controller;

import com.employee.crud.dto.ApiResponse;
import com.employee.crud.service.TableService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/table")
public class TableController {

    private final TableService service;

    public TableController(TableService service) {
        this.service = service;
    }

    @PostMapping("/create")
    public ApiResponse<String> create(
            @RequestParam String db,
            @RequestParam String table,
            @RequestBody Map<String, String> columns) {

        String result = service.createTable(db, table, columns);
        return result.equals("SUCCESS") ?
                ApiResponse.ok("Table created") :
                ApiResponse.fail(result);
    }

    @GetMapping("/list")
    public ApiResponse<List<String>> list(@RequestParam String db) {
        return ApiResponse.ok(service.listTables(db));
    }

    @DeleteMapping("/drop")
    public ApiResponse<String> drop(
            @RequestParam String db,
            @RequestParam String table) {

        String r = service.dropTable(db, table);
        return r.equals("SUCCESS") ?
                ApiResponse.ok("Table removed") :
                ApiResponse.fail(r);
    }

    @PostMapping("/insert")
    public ApiResponse<String> insert(
            @RequestParam String db,
            @RequestParam String table,
            @RequestBody Map<String, Object> row) {

        String r = service.insertRow(db, table, row);
        return r.equals("SUCCESS") ?
                ApiResponse.ok("Row added") :
                ApiResponse.fail(r);
    }

    @GetMapping("/rows")
    public ApiResponse<List<Map<String, Object>>> rows(
            @RequestParam String db,
            @RequestParam String table) {

        return ApiResponse.ok(service.selectAll(db, table));
    }

    @PostMapping("/deleteRow")
    public ApiResponse<String> deleteRow(
            @RequestParam String db,
            @RequestParam String table,
            @RequestParam String col,
            @RequestParam String val) {

        String r = service.deleteRow(db, table, col, val);
        return r.equals("SUCCESS") ?
                ApiResponse.ok("Row deleted") :
                ApiResponse.fail(r);
    }

    // ------------ NEW ENDPOINT: GET COLUMNS ------------
    @GetMapping("/columns")
    public ApiResponse<List<String>> columns(
            @RequestParam String db,
            @RequestParam String table) {

        return ApiResponse.ok(service.getColumns(db, table));
    }
}
