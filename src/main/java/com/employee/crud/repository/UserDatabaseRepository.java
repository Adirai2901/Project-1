package com.employee.crud.repository;

import com.employee.crud.model.UserDatabase;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserDatabaseRepository extends JpaRepository<UserDatabase, Long> {
    boolean existsByDatabaseName(String name);
    List<UserDatabase> findByUserId(Long userId);
}
