package com.hospital.backend.controller;

import com.hospital.backend.entity.Department;
import com.hospital.backend.entity.Doctor;
import com.hospital.backend.entity.Patient;
import com.hospital.backend.entity.User;
import com.hospital.backend.payload.request.LoginRequest;
import com.hospital.backend.payload.request.SignupRequest;
import com.hospital.backend.payload.response.JwtResponse;
import com.hospital.backend.payload.response.MessageResponse;
import com.hospital.backend.repository.DepartmentRepository;
import com.hospital.backend.repository.DoctorRepository;
import com.hospital.backend.repository.PatientRepository;
import com.hospital.backend.repository.UserRepository;
import com.hospital.backend.security.jwt.JwtUtils;
import com.hospital.backend.security.services.UserDetailsImpl;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UserRepository userRepository;

    @Autowired
    PatientRepository patientRepository;

    @Autowired
    DoctorRepository doctorRepository;

    @Autowired
    DepartmentRepository departmentRepository;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping("/signin")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = jwtUtils.generateJwtToken(authentication);
        
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();    
        String role = userDetails.getAuthorities().iterator().next().getAuthority();

        return ResponseEntity.ok(new JwtResponse(jwt, userDetails.getId(), userDetails.getUsername(), role));
    }

    @PostMapping("/signup")
    public ResponseEntity<?> registerUser(@RequestBody SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Error: Username is already taken!"));
        }

        // Create new user's account
        User user = new User();
        user.setUsername(signUpRequest.getUsername());
        user.setPassword(encoder.encode(signUpRequest.getPassword()));
        
        String reqRole = signUpRequest.getRole();
        if ("DOCTOR".equalsIgnoreCase(reqRole)) {
            user.setRole(User.Role.DOCTOR);
            userRepository.save(user);

            Doctor doctor = new Doctor();
            doctor.setUser(user);
            doctor.setSpecialization(signUpRequest.getSpecialization());
            doctor.setExperienceYears(signUpRequest.getExperienceYears());
            doctor.setQualifications(signUpRequest.getQualifications());
            
            Department dept = departmentRepository.findById(signUpRequest.getDepartmentId())
                    .orElseThrow(() -> new RuntimeException("Error: Department is not found."));
            doctor.setDepartment(dept);
            
            doctorRepository.save(doctor);
        } else {
            user.setRole(User.Role.PATIENT);
            userRepository.save(user);

            Patient patient = new Patient();
            patient.setUser(user);
            patient.setPhone(signUpRequest.getPhone());
            patient.setAddress(signUpRequest.getAddress());
            patient.setDateOfBirth(LocalDate.parse(signUpRequest.getDateOfBirth()));
            
            patientRepository.save(patient);
        }

        return ResponseEntity.ok(new MessageResponse("User registered successfully!"));
    }
}
