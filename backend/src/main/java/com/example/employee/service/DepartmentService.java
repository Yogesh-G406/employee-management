package com.example.employee.service;

import com.example.employee.model.Department;
import com.example.employee.repository.DepartmentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DepartmentService {
    
    @Autowired
    private DepartmentRepository departmentRepository;
    
    public List<Department> getAllDepartments() {
        return departmentRepository.findAll();
    }
    
    public Department getDepartmentById(Long id) {
        return departmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Department not found with id: " + id));
    }
    
    public Department createDepartment(Department department) {
        if (departmentRepository.existsByName(department.getName())) {
            throw new RuntimeException("Department with name '" + department.getName() + "' already exists");
        }
        return departmentRepository.save(department);
    }
    
    public Department updateDepartment(Long id, Department departmentDetails) {
        Department department = getDepartmentById(id);
        
        // Check if name is being changed and if new name already exists
        if (!department.getName().equals(departmentDetails.getName()) && 
            departmentRepository.existsByName(departmentDetails.getName())) {
            throw new RuntimeException("Department with name '" + departmentDetails.getName() + "' already exists");
        }
        
        department.setName(departmentDetails.getName());
        department.setDescription(departmentDetails.getDescription());
        department.setManager(departmentDetails.getManager());
        
        return departmentRepository.save(department);
    }
    
    public void deleteDepartment(Long id) {
        Department department = getDepartmentById(id);
        departmentRepository.delete(department);
    }
}
