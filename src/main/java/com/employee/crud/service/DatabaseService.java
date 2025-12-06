package com.employee.crud.service;

import com.employee.crud.model.UserDatabase;
import com.employee.crud.repository.UserDatabaseRepository;
import com.employee.crud.util.CurrentUserUtil;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.Statement;
import java.util.List;

@Service
public class DatabaseService {

    private final DataSource dataSource;
    private final UserDatabaseRepository userDbRepo;
    private final CurrentUserUtil currentUserUtil;

    public DatabaseService(DataSource dataSource,
                           UserDatabaseRepository userDbRepo,
                           CurrentUserUtil currentUserUtil) {
        this.dataSource = dataSource;
        this.userDbRepo = userDbRepo;
        this.currentUserUtil = currentUserUtil;
    }

    public String createDatabase(String dbName) {
        var user = currentUserUtil.getCurrentUser();
        if (user == null) return "UNAUTHORIZED";

        if (dbName == null || !dbName.matches("[a-zA-Z0-9_]+")) return "INVALID_NAME";

        if (userDbRepo.existsByDatabaseName(dbName)) return "ALREADY_EXISTS";

        try (Connection conn = dataSource.getConnection();
             Statement stmt = conn.createStatement()) {

            stmt.executeUpdate("CREATE DATABASE " + dbName);

            UserDatabase userDb = new UserDatabase();
            userDb.setUserId(user.getId());
            userDb.setDatabaseName(dbName);
            userDbRepo.save(userDb);

            return "SUCCESS";

        } catch (Exception e) {
            return "ERROR";
        }
    }

    public List<UserDatabase> listDatabases() {
        var user = currentUserUtil.getCurrentUser();
        if (user == null) return List.of();
        return userDbRepo.findByUserId(user.getId());
    }
}
