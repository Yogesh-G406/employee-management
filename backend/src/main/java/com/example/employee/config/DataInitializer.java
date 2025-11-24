package com.example.employee.config;

import com.example.employee.model.Employee;
import com.example.employee.repository.EmployeeRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initDatabase(EmployeeRepository repository) {
        return args -> {
            // Only add default user if database is empty
            if (repository.count() == 0) {
                Employee admin = new Employee();
                admin.setFirstName("Admin");
                admin.setLastName("User");
                admin.setEmail("admin@company.com");
                admin.setPosition("Administrator");
                admin.setDepartment("Management");
                
                repository.save(admin);
                System.out.println("✅ Default admin user created: admin@company.com");
            }
        };
    }
}
