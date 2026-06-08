package com.hospital.backend.config;

import com.hospital.backend.entity.Department;
import com.hospital.backend.repository.DepartmentRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Arrays;
import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner seedDepartments(DepartmentRepository departmentRepository) {
        return args -> {
            if (departmentRepository.count() == 0) {
                List<Department> departments = Arrays.asList(
                    createDept("Cardiology", "Heart and cardiovascular system"),
                    createDept("Neurology", "Brain, spinal cord, and nervous system"),
                    createDept("Orthopedics", "Bones, joints, ligaments, and muscles"),
                    createDept("Pediatrics", "Medical care for infants, children, and adolescents"),
                    createDept("Dermatology", "Skin, hair, and nail conditions"),
                    createDept("Ophthalmology", "Eye and vision care"),
                    createDept("ENT", "Ear, nose, and throat disorders"),
                    createDept("General Medicine", "Primary and internal medicine"),
                    createDept("Gynecology", "Women's reproductive health"),
                    createDept("Psychiatry", "Mental health and behavioral disorders")
                );
                departmentRepository.saveAll(departments);
                System.out.println("✅ Seeded " + departments.size() + " departments");
            }
        };
    }

    private Department createDept(String name, String description) {
        Department d = new Department();
        d.setName(name);
        d.setDescription(description);
        return d;
    }
}
