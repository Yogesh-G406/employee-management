package com.example.employee.dto;

import com.example.employee.model.Department;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DepartmentDTO {
    
    private Long id;
    private String name;
    private String description;
    private String manager;
    private Long employeeCount;
    
    // Constructor to convert from Department entity
    public DepartmentDTO(Department department, Long employeeCount) {
        this.id = department.getId();
        this.name = department.getName();
        this.description = department.getDescription();
        this.manager = department.getManager();
        this.employeeCount = employeeCount;
    }
}
