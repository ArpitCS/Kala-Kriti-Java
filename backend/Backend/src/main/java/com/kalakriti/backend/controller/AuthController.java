package com.kalakriti.backend.controller;

import com.kalakriti.backend.dto.LoginDto;
import com.kalakriti.backend.dto.UserRegistrationDto;
import com.kalakriti.backend.entity.User;
import com.kalakriti.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {
    
    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserRegistrationDto registrationDto) {
        try {
            User user = userService.registerUser(registrationDto);
            return ResponseEntity.ok("User registered successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDto loginDto) {
        try {
            var userOpt = userService.findByUsername(loginDto.getUsername());
            if (userOpt.isPresent()) {
                var user = userOpt.get();
                if (passwordEncoder.matches(loginDto.getPassword(), user.getPassword())) {
                    return ResponseEntity.ok("Login successful");
                } else {
                    return ResponseEntity.badRequest().body("Invalid credentials");
                }
            } else {
                return ResponseEntity.badRequest().body("Invalid credentials");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
