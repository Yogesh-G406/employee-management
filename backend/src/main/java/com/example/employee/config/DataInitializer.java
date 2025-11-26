package com.example.employee.config;

import com.example.employee.model.Employee;
import com.example.employee.model.Department;
import com.example.employee.repository.EmployeeRepository;
import com.example.employee.repository.DepartmentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(EmployeeRepository employeeRepository, DepartmentRepository departmentRepository) {
        return args -> {
            if (departmentRepository.count() == 0) {
                Department management = new Department();
                management.setName("Management");
                management.setDescription("Management Department");
                management.setManager("Admin");
                departmentRepository.save(management);
            }
            
            if (employeeRepository.count() == 0) {
                Employee admin = new Employee();
                admin.setFirstName("Admin");
                admin.setLastName("User");
                admin.setEmail("admin@company.com");
                admin.setPosition("Administrator");
                
                Department management = departmentRepository.findByName("Management")
                        .orElseGet(() -> {
                            Department dept = new Department();
                            dept.setName("Management");
                            dept.setDescription("Management Department");
                            dept.setManager("Admin");
                            return departmentRepository.save(dept);
                        });
                
                admin.setDepartment(management);
                employeeRepository.save(admin);
                System.out.println("✅ Default admin user created: admin@company.com");
            }
        };
    }
}
