package com.example.employee.repository;

import com.example.employee.model.Employee;
import com.example.employee.model.Department;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {
    Long countByDepartment(Department department);
}
