package com.example.employee.service;

import com.example.employee.model.Employee;
import com.example.employee.model.Department;
import com.example.employee.repository.EmployeeRepository;
import com.example.employee.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EmployeeService {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private DepartmentRepository departmentRepository;

    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    public Optional<Employee> getEmployeeById(Long id) {
        return employeeRepository.findById(id);
    }

    public Employee createEmployee(Employee employee) {
        resolveDepartment(employee);
        return employeeRepository.save(employee);
    }

    public Employee updateEmployee(Long id, Employee employeeDetails) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));

        employee.setFirstName(employeeDetails.getFirstName());
        employee.setLastName(employeeDetails.getLastName());
        employee.setEmail(employeeDetails.getEmail());
        employee.setPosition(employeeDetails.getPosition());
        resolveDepartment(employeeDetails);
        employee.setDepartment(employeeDetails.getDepartment());

        return employeeRepository.save(employee);
    }

    public void deleteEmployee(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Employee not found with id: " + id));
        employeeRepository.delete(employee);
    }

    private void resolveDepartment(Employee employee) {
        if (employee.getDepartment() != null) {
            Department department = employee.getDepartment();
            if (department.getId() == null && department.getName() != null) {
                Optional<Department> existingDept = departmentRepository.findByName(department.getName());
                if (existingDept.isPresent()) {
                    employee.setDepartment(existingDept.get());
                } else {
                    employee.setDepartment(departmentRepository.save(department));
                }
            }
        }
    }
}
