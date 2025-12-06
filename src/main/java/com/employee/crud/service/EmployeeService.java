package com.employee.crud.service;

import com.employee.crud.model.Employee;
import com.employee.crud.repository.EmployeeRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class EmployeeService {
    private final EmployeeRepository repo;

    public EmployeeService(EmployeeRepository repo){
        this.repo = repo;
    }

    public Employee create(Employee e){
        return repo.save(e);
    }

    public List<Employee> getAll(){
        return repo.findAll();
    }
    public Employee getById(Long id){
        return repo.findById(id).orElse(null);
    }
    public Employee update(Long id, Employee newEmp){
        Employee old = repo.findById(id).orElse(null);
        if(old == null)return null;

        old.setName(newEmp.getName());
        old.setEmail(newEmp.getEmail());
        old.setDepartment(newEmp.getDepartment());
        return repo.save(old);
    }
    public void delete(Long id){
        repo.deleteById(id);
    }

}
