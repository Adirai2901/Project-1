package com.employee.crud.service;

import com.employee.crud.repository.UserDatabaseRepository;
import com.employee.crud.util.CurrentUserUtil;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.sql.*;
import java.util.*;

@Service
public class TableService {

    private final DataSource dataSource;
    private final UserDatabaseRepository userDbRepo;
    private final CurrentUserUtil currentUserUtil;

    public TableService(DataSource dataSource,
                        UserDatabaseRepository userDbRepo,
                        CurrentUserUtil currentUserUtil) {
        this.dataSource = dataSource;
        this.userDbRepo = userDbRepo;
        this.currentUserUtil = currentUserUtil;
    }

    private boolean validName(String s) {
        return s != null && s.matches("[a-zA-Z0-9_]+");
    }

    private boolean userOwnsDb(String dbName) {
        var user = currentUserUtil.getCurrentUser();
        if (user == null) return false;

        return userDbRepo.findByUserId(user.getId())
                .stream()
                .anyMatch(d -> d.getDatabaseName().equals(dbName));
    }

    public String createTable(String dbName, String tableName, Map<String, String> columns) {
        if (!validName(dbName) || !validName(tableName)) return "INVALID_NAME";
        if (!userOwnsDb(dbName)) return "NOT_OWNER";
        if (columns == null || columns.isEmpty()) return "NO_COLUMNS";

        StringBuilder colDef = new StringBuilder();

        for (var e : columns.entrySet()) {
            String col = e.getKey();
            String type = e.getValue().toLowerCase();

            if (!validName(col)) return "INVALID_COLUMN";

            String sqlType;
            switch (type) {
                case "string": sqlType = "VARCHAR(255)"; break;
                case "int": sqlType = "INT"; break;
                case "long": sqlType = "BIGINT"; break;
                case "text": sqlType = "TEXT"; break;
                case "boolean": sqlType = "BOOLEAN"; break;
                case "date": sqlType = "DATE"; break;
                default: return "INVALID_TYPE";
            }

            if (colDef.length() > 0) colDef.append(", ");
            colDef.append(col).append(" ").append(sqlType);
        }

        String sql = "CREATE TABLE " + dbName + "." + tableName +
                " (" + colDef + ")";

        try (Connection conn = dataSource.getConnection();
             Statement st = conn.createStatement()) {
            st.executeUpdate(sql);
            return "SUCCESS";
        } catch (Exception e) {
            return "ERROR";
        }
    }


    public List<String> listTables(String dbName) {
        if (!validName(dbName)) return List.of();
        if (!userOwnsDb(dbName)) return List.of();

        List<String> tables = new ArrayList<>();

        try (Connection conn = dataSource.getConnection();
             ResultSet rs = conn.getMetaData().getTables(dbName, null, "%", new String[]{"TABLE"})) {

            while (rs.next()) {
                tables.add(rs.getString("TABLE_NAME"));
            }

        } catch (Exception ignored) {}

        return tables;
    }


    public String dropTable(String dbName, String tableName) {
        if (!validName(dbName) || !validName(tableName)) return "INVALID_NAME";
        if (!userOwnsDb(dbName)) return "NOT_OWNER";

        String sql = "DROP TABLE " + dbName + "." + tableName;

        try (Connection conn = dataSource.getConnection();
             Statement st = conn.createStatement()) {

            st.executeUpdate(sql);
            return "SUCCESS";

        } catch (Exception e) {
            return "ERROR";
        }
    }


    public String insertRow(String dbName, String tableName, Map<String, Object> row) {
        if (!validName(dbName) || !validName(tableName)) return "INVALID_NAME";
        if (!userOwnsDb(dbName)) return "NOT_OWNER";
        if (row == null || row.isEmpty()) return "NO_DATA";

        List<String> cols = new ArrayList<>();
        List<String> placeholders = new ArrayList<>();
        List<Object> values = new ArrayList<>();

        for (var e : row.entrySet()) {
            if (!validName(e.getKey())) return "INVALID_COLUMN";
            cols.add(e.getKey());
            placeholders.add("?");
            values.add(e.getValue());
        }

        String sql = "INSERT INTO " + dbName + "." + tableName +
                " (" + String.join(", ", cols) + ") VALUES (" + String.join(", ", placeholders) + ")";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            for (int i = 0; i < values.size(); i++)
                ps.setObject(i + 1, values.get(i));

            ps.executeUpdate();
            return "SUCCESS";

        } catch (Exception e) {
            return "ERROR";
        }
    }


    public List<Map<String, Object>> selectAll(String dbName, String tableName) {
        if (!validName(dbName) || !validName(tableName)) return List.of();
        if (!userOwnsDb(dbName)) return List.of();

        List<Map<String, Object>> rows = new ArrayList<>();

        String sql = "SELECT * FROM " + dbName + "." + tableName;

        try (Connection conn = dataSource.getConnection();
             Statement st = conn.createStatement();
             ResultSet rs = st.executeQuery(sql)) {

            ResultSetMetaData meta = rs.getMetaData();
            int columns = meta.getColumnCount();

            while (rs.next()) {
                Map<String, Object> map = new LinkedHashMap<>();
                for (int i = 1; i <= columns; i++) {
                    map.put(meta.getColumnLabel(i), rs.getObject(i));
                }
                rows.add(map);
            }

        } catch (Exception ignored) {}

        return rows;
    }


    // ---------------------- NEW: getColumns ----------------------
    public List<String> getColumns(String dbName, String tableName) {
        if (!validName(dbName) || !validName(tableName)) return List.of();
        if (!userOwnsDb(dbName)) return List.of();

        List<String> columns = new ArrayList<>();

        String sql = "SELECT * FROM " + dbName + "." + tableName + " LIMIT 1";

        try (Connection conn = dataSource.getConnection();
             Statement st = conn.createStatement();
             ResultSet rs = st.executeQuery(sql)) {

            ResultSetMetaData meta = rs.getMetaData();
            int colCount = meta.getColumnCount();

            for (int i = 1; i <= colCount; i++) {
                columns.add(meta.getColumnLabel(i));
            }

        } catch (Exception ignored) {}

        return columns;
    }


    public String deleteRow(String dbName, String tableName, String col, String value) {
        if (!validName(dbName) || !validName(tableName) || !validName(col))
            return "INVALID_NAME";

        if (!userOwnsDb(dbName)) return "NOT_OWNER";

        String sql = "DELETE FROM " + dbName + "." + tableName + " WHERE " + col + " = ?";

        try (Connection conn = dataSource.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setObject(1, value);
            ps.executeUpdate();
            return "SUCCESS";

        } catch (Exception e) {
            return "ERROR";
        }
    }
}
