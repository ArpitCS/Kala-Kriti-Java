package com.kalakriti.user.controller;

import com.kalakriti.user.model.User;
import com.kalakriti.user.service.UserService;
import com.kalakriti.user.util.JwtUtil;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        boolean isValid = userService.validateCredentials(loginRequest.getUsername(), loginRequest.getPassword());
        if (!isValid) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", "Invalid credentials");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
        }

        Optional<User> optionalUser = userService.getUserByUsername(loginRequest.getUsername());
        if (optionalUser.isEmpty()) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", "User not found");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        User user = optionalUser.get();
        String token = jwtUtil.generateToken(user.getUsername(), user.getRole().name());

        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("role", user.getRole());
        response.put("username", user.getUsername());
        response.put("userId", user.getId());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User createdUser = userService.createUser(user);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
        } catch (IllegalArgumentException ex) {
            Map<String, Object> error = new HashMap<>();
            error.put("message", ex.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    public static class LoginRequest {
        private String username;
        private String password;

        public String getUsername() {
            return username;
        }

        public void setUsername(String username) {
            this.username = username;
        }

        public String getPassword() {
            return password;
        }

        public void setPassword(String password) {
            this.password = password;
        }
    }
}
