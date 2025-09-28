# Kala-Kriti: E-Commerce Artist Platform - Complete Spring Boot Microservices Project Guide

## Project Overview

**Kala-Kriti** is a Spring Boot microservices-based e-commerce artist platform designed to connect artists with customers. The platform supports three user types: Admin, Artist, and Customer. The architecture follows modern microservices principles with JWT authentication and CORS-enabled API Gateway.

## Architecture Overview

The system consists of the following microservices:

1. **API Gateway Service** - Entry point with authentication and CORS
2. **User Service** - Manages users (Admin, Artist, Customer)  
3. **Product Service** - Manages artwork/products catalog
4. **Order Service** - Handles customer orders
5. **Payment Service** - Processes payments
6. **Discovery Service** - Service registry (Eureka)
7. **Config Service** - Centralized configuration

## Technology Stack

- **Framework**: Spring Boot 3.x
- **Cloud**: Spring Cloud 2023.x
- **Authentication**: JWT (JSON Web Tokens)
- **Database**: PostgreSQL
- **Service Discovery**: Netflix Eureka
- **API Gateway**: Spring Cloud Gateway
- **Build Tool**: Maven
- **Containerization**: Docker
- **Java Version**: 17

## Project Structure

\`\`\`
kala-kriti/
├── api-gateway/
├── discovery-service/
├── config-service/
├── user-service/
├── product-service/
├── order-service/
├── payment-service/
├── docker-compose.yml
├── pom.xml
└── README.md
\`\`\`

## Service Details

### 1. Discovery Service (Eureka Server)

**Port**: 8761

#### Dependencies (pom.xml)
\`\`\`xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-netflix-eureka-server</artifactId>
    </dependency>
</dependencies>
\`\`\`

#### application.yml
\`\`\`yaml
server:
  port: 8761

eureka:
  instance:
    hostname: localhost
  client:
    register-with-eureka: false
    fetch-registry: false
    service-url:
      default-zone: http://localhost:8761/eureka/

spring:
  application:
    name: discovery-service
\`\`\`

#### Main Application Class
\`\`\`java
package com.kalakriti.discovery;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer
public class DiscoveryServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(DiscoveryServiceApplication.class, args);
    }
}
\`\`\`

### 2. Config Service (Configuration Server)

**Port**: 8888

#### Dependencies (pom.xml)
\`\`\`xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-config-server</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
    </dependency>
</dependencies>
\`\`\`

#### application.yml
\`\`\`yaml
server:
  port: 8888

spring:
  application:
    name: config-service
  cloud:
    config:
      server:
        git:
          uri: https://github.com/your-username/kala-kriti-config
          default-label: main
          clone-on-start: true

eureka:
  client:
    service-url:
      default-zone: http://localhost:8761/eureka/
\`\`\`

#### Main Application Class
\`\`\`java
package com.kalakriti.config;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.config.server.EnableConfigServer;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

@SpringBootApplication
@EnableConfigServer
@EnableEurekaClient
public class ConfigServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(ConfigServiceApplication.class, args);
    }
}
\`\`\`

### 3. API Gateway Service

**Port**: 8080

#### Dependencies (pom.xml)
\`\`\`xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-webflux</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-gateway</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.11.5</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <version>0.11.5</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-jackson</artifactId>
        <version>0.11.5</version>
    </dependency>
</dependencies>
\`\`\`

#### application.yml
\`\`\`yaml
server:
  port: 8080

spring:
  application:
    name: api-gateway
  cloud:
    gateway:
      globalcors:
        cors-configurations:
          '[/**]':
            allowedOrigins: "*"
            allowedMethods: 
              - GET
              - POST
              - PUT
              - DELETE
              - OPTIONS
            allowedHeaders: "*"
            allowCredentials: false
      routes:
        - id: user-service
          uri: lb://user-service
          predicates:
            - Path=/api/users/**, /api/auth/**
        - id: product-service
          uri: lb://product-service
          predicates:
            - Path=/api/products/**, /api/categories/**
        - id: order-service
          uri: lb://order-service
          predicates:
            - Path=/api/orders/**
        - id: payment-service
          uri: lb://payment-service
          predicates:
            - Path=/api/payments/**
      discovery:
        locator:
          enabled: true
          lower-case-service-id: true

eureka:
  client:
    service-url:
      default-zone: http://localhost:8761/eureka/

jwt:
  secret: kala-kriti-jwt-secret-key-2024-kala-kriti-jwt-secret-key
  expiration: 86400000
\`\`\`

#### JWT Utility Class
\`\`\`java
package com.kalakriti.gateway.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private Long expiration;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public String extractRole(String token) {
        Claims claims = extractAllClaims(token);
        return claims.get("role", String.class);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public String generateToken(String username, String role) {
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public Boolean validateToken(String token) {
        try {
            return !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }
}
\`\`\`

#### JWT Authentication Filter
\`\`\`java
package com.kalakriti.gateway.filter;

import com.kalakriti.gateway.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

@Component
public class JwtAuthenticationFilter implements GlobalFilter, Ordered {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getURI().getPath();
        
        // Skip authentication for these paths
        if (path.contains("/api/auth/") || path.contains("/api/users/register")) {
            return chain.filter(exchange);
        }

        String authHeader = exchange.getRequest().getHeaders().getFirst("Authorization");
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        String token = authHeader.substring(7);
        
        if (!jwtUtil.validateToken(token)) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        String username = jwtUtil.extractUsername(token);
        String role = jwtUtil.extractRole(token);
        
        exchange.getRequest().mutate()
                .header("X-Username", username)
                .header("X-Role", role)
                .build();

        return chain.filter(exchange);
    }

    @Override
    public int getOrder() {
        return -1;
    }
}
\`\`\`

#### Main Application Class
\`\`\`java
package com.kalakriti.gateway;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

@SpringBootApplication
@EnableEurekaClient
public class ApiGatewayApplication {
    public static void main(String[] args) {
        SpringApplication.run(ApiGatewayApplication.class, args);
    }
}
\`\`\`

### 4. User Service

**Port**: 8081

#### Dependencies (pom.xml)
\`\`\`xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-security</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
    </dependency>
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-api</artifactId>
        <version>0.11.5</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-impl</artifactId>
        <version>0.11.5</version>
    </dependency>
    <dependency>
        <groupId>io.jsonwebtoken</groupId>
        <artifactId>jjwt-jackson</artifactId>
        <version>0.11.5</version>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
</dependencies>
\`\`\`

#### application.yml
\`\`\`yaml
server:
  port: 8081

spring:
  application:
    name: user-service
  datasource:
    url: jdbc:postgresql://localhost:5432/kala_kriti_users
    username: postgres
    password: password
    driver-class-name: org.postgresql.Driver
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true

eureka:
  client:
    service-url:
      default-zone: http://localhost:8761/eureka/

jwt:
  secret: kala-kriti-jwt-secret-key-2024
  expiration: 86400000
\`\`\`

#### User Entity
\`\`\`java
package com.kalakriti.user.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Username is required")
    @Column(unique = true)
    private String username;

    @NotBlank(message = "Password is required")
    private String password;

    @NotBlank(message = "Email is required")
    @Email(message = "Email should be valid")
    @Column(unique = true)
    private String email;

    @NotBlank(message = "First name is required")
    private String firstName;

    @NotBlank(message = "Last name is required")
    private String lastName;

    private String phoneNumber;

    @Enumerated(EnumType.STRING)
    private UserRole role;

    @Enumerated(EnumType.STRING)
    private UserStatus status = UserStatus.ACTIVE;

    // Artist-specific fields
    private String bio;
    private String specialization;
    private String portfolioUrl;

    public enum UserRole {
        ADMIN, ARTIST, CUSTOMER
    }

    public enum UserStatus {
        ACTIVE, INACTIVE, SUSPENDED
    }
}
\`\`\`

#### User Repository
\`\`\`java
package com.kalakriti.user.repository;

import com.kalakriti.user.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    List<User> findByRole(User.UserRole role);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
\`\`\`

#### User Service
\`\`\`java
package com.kalakriti.user.service;

import com.kalakriti.user.model.User;
import com.kalakriti.user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public Optional<User> getUserByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    public List<User> getUsersByRole(User.UserRole role) {
        return userRepository.findByRole(role);
    }

    public User createUser(User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
            throw new RuntimeException("Username already exists");
        }
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public User updateUser(Long id, User userDetails) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setFirstName(userDetails.getFirstName());
        user.setLastName(userDetails.getLastName());
        user.setEmail(userDetails.getEmail());
        user.setPhoneNumber(userDetails.getPhoneNumber());
        user.setBio(userDetails.getBio());
        user.setSpecialization(userDetails.getSpecialization());
        user.setPortfolioUrl(userDetails.getPortfolioUrl());

        return userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public boolean validateCredentials(String username, String password) {
        Optional<User> user = userRepository.findByUsername(username);
        return user.isPresent() && passwordEncoder.matches(password, user.get().getPassword());
    }
}
\`\`\`

#### JWT Utility Class (for User Service)
\`\`\`java
package com.kalakriti.user.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.function.Function;

@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private Long expiration;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public String extractRole(String token) {
        Claims claims = extractAllClaims(token);
        return claims.get("role", String.class);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public String generateToken(String username, String role) {
        return Jwts.builder()
                .setSubject(username)
                .claim("role", role)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public Boolean validateToken(String token) {
        try {
            return !isTokenExpired(token);
        } catch (Exception e) {
            return false;
        }
    }
}
\`\`\`

#### Authentication Controller
\`\`\`java
package com.kalakriti.user.controller;

import com.kalakriti.user.model.User;
import com.kalakriti.user.service.UserService;
import com.kalakriti.user.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

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
        if (userService.validateCredentials(loginRequest.getUsername(), loginRequest.getPassword())) {
            Optional<User> user = userService.getUserByUsername(loginRequest.getUsername());
            if (user.isPresent()) {
                String token = jwtUtil.generateToken(user.get().getUsername(), user.get().getRole().toString());
                Map<String, Object> response = new HashMap<>();
                response.put("token", token);
                response.put("user", user.get());
                return ResponseEntity.ok(response);
            }
        }
        return ResponseEntity.badRequest().body("Invalid credentials");
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody User user) {
        try {
            User createdUser = userService.createUser(user);
            return ResponseEntity.ok(createdUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    public static class LoginRequest {
        private String username;
        private String password;

        // Getters and setters
        public String getUsername() { return username; }
        public void setUsername(String username) { this.username = username; }
        public String getPassword() { return password; }
        public void setPassword(String password) { this.password = password; }
    }
}
\`\`\`

#### User Controller
\`\`\`java
package com.kalakriti.user.controller;

import com.kalakriti.user.model.User;
import com.kalakriti.user.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> user = userService.getUserById(id);
        return user.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/role/{role}")
    public List<User> getUsersByRole(@PathVariable User.UserRole role) {
        return userService.getUsersByRole(role);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        try {
            User updatedUser = userService.updateUser(id, user);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
\`\`\`

#### Security Configuration
\`\`\`java
package com.kalakriti.user.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http.csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/users/register").permitAll()
                .anyRequest().authenticated()
            );
        return http.build();
    }
}
\`\`\`

#### Main Application Class
\`\`\`java
package com.kalakriti.user;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

@SpringBootApplication
@EnableEurekaClient
public class UserServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(UserServiceApplication.class, args);
    }
}
\`\`\`

### 5. Product Service

**Port**: 8082

#### Dependencies (pom.xml)
\`\`\`xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
    </dependency>
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
</dependencies>
\`\`\`

#### application.yml
\`\`\`yaml
server:
  port: 8082

spring:
  application:
    name: product-service
  datasource:
    url: jdbc:postgresql://localhost:5432/kala_kriti_products
    username: postgres
    password: password
    driver-class-name: org.postgresql.Driver
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true

eureka:
  client:
    service-url:
      default-zone: http://localhost:8761/eureka/
\`\`\`

#### Product Entity
\`\`\`java
package com.kalakriti.product.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Product name is required")
    private String name;

    @Column(length = 1000)
    private String description;

    @NotNull(message = "Price is required")
    @DecimalMin(value = "0.0", inclusive = false, message = "Price must be greater than 0")
    private BigDecimal price;

    private String imageUrl;

    @NotNull(message = "Artist ID is required")
    private Long artistId;

    @NotNull(message = "Category ID is required")
    private Long categoryId;

    private Integer stockQuantity = 1;

    @Enumerated(EnumType.STRING)
    private ProductStatus status = ProductStatus.ACTIVE;

    private String dimensions;
    private String medium;
    private Integer yearCreated;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public enum ProductStatus {
        ACTIVE, INACTIVE, SOLD
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
\`\`\`

#### Category Entity
\`\`\`java
package com.kalakriti.product.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Category name is required")
    @Column(unique = true)
    private String name;

    private String description;
}
\`\`\`

#### Product Repository
\`\`\`java
package com.kalakriti.product.repository;

import com.kalakriti.product.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByArtistId(Long artistId);
    List<Product> findByCategoryId(Long categoryId);
    List<Product> findByStatus(Product.ProductStatus status);
    List<Product> findByNameContainingIgnoreCase(String name);
}
\`\`\`

#### Category Repository
\`\`\`java
package com.kalakriti.product.repository;

import com.kalakriti.product.model.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {
    boolean existsByName(String name);
}
\`\`\`

#### Product Service
\`\`\`java
package com.kalakriti.product.service;

import com.kalakriti.product.model.Product;
import com.kalakriti.product.repository.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Optional<Product> getProductById(Long id) {
        return productRepository.findById(id);
    }

    public List<Product> getProductsByArtist(Long artistId) {
        return productRepository.findByArtistId(artistId);
    }

    public List<Product> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    public List<Product> searchProducts(String name) {
        return productRepository.findByNameContainingIgnoreCase(name);
    }

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product productDetails) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setName(productDetails.getName());
        product.setDescription(productDetails.getDescription());
        product.setPrice(productDetails.getPrice());
        product.setImageUrl(productDetails.getImageUrl());
        product.setCategoryId(productDetails.getCategoryId());
        product.setStockQuantity(productDetails.getStockQuantity());
        product.setStatus(productDetails.getStatus());
        product.setDimensions(productDetails.getDimensions());
        product.setMedium(productDetails.getMedium());
        product.setYearCreated(productDetails.getYearCreated());

        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }
}
\`\`\`

#### Product Controller
\`\`\`java
package com.kalakriti.product.controller;

import com.kalakriti.product.model.Product;
import com.kalakriti.product.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductService productService;

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable Long id) {
        Optional<Product> product = productService.getProductById(id);
        return product.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/artist/{artistId}")
    public List<Product> getProductsByArtist(@PathVariable Long artistId) {
        return productService.getProductsByArtist(artistId);
    }

    @GetMapping("/category/{categoryId}")
    public List<Product> getProductsByCategory(@PathVariable Long categoryId) {
        return productService.getProductsByCategory(categoryId);
    }

    @GetMapping("/search")
    public List<Product> searchProducts(@RequestParam String name) {
        return productService.searchProducts(name);
    }

    @PostMapping
    public Product createProduct(@RequestBody Product product) {
        return productService.createProduct(product);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id, @RequestBody Product product) {
        try {
            Product updatedProduct = productService.updateProduct(id, product);
            return ResponseEntity.ok(updatedProduct);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.noContent().build();
    }
}
\`\`\`

#### Category Service
\`\`\`java
package com.kalakriti.product.service;

import com.kalakriti.product.model.Category;
import com.kalakriti.product.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Optional<Category> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }

    public Category createCategory(Category category) {
        if (categoryRepository.existsByName(category.getName())) {
            throw new RuntimeException("Category name already exists");
        }
        return categoryRepository.save(category);
    }

    public Category updateCategory(Long id, Category categoryDetails) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        category.setName(categoryDetails.getName());
        category.setDescription(categoryDetails.getDescription());

        return categoryRepository.save(category);
    }

    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }
}
\`\`\`

#### Category Controller
\`\`\`java
package com.kalakriti.product.controller;

import com.kalakriti.product.model.Category;
import com.kalakriti.product.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public List<Category> getAllCategories() {
        return categoryService.getAllCategories();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Category> getCategoryById(@PathVariable Long id) {
        Optional<Category> category = categoryService.getCategoryById(id);
        return category.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Category createCategory(@RequestBody Category category) {
        return categoryService.createCategory(category);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable Long id, @RequestBody Category category) {
        try {
            Category updatedCategory = categoryService.updateCategory(id, category);
            return ResponseEntity.ok(updatedCategory);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}
\`\`\`

#### Main Application Class
\`\`\`java
package com.kalakriti.product;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

@SpringBootApplication
@EnableEurekaClient
public class ProductServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(ProductServiceApplication.class, args);
    }
}
\`\`\`

### 6. Order Service

**Port**: 8083

#### Dependencies (pom.xml)
\`\`\`xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
    </dependency>
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
</dependencies>
\`\`\`

#### application.yml
\`\`\`yaml
server:
  port: 8083

spring:
  application:
    name: order-service
  datasource:
    url: jdbc:postgresql://localhost:5432/kala_kriti_orders
    username: postgres
    password: password
    driver-class-name: org.postgresql.Driver
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true

eureka:
  client:
    service-url:
      default-zone: http://localhost:8761/eureka/
\`\`\`

#### Order Entity
\`\`\`java
package com.kalakriti.order.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Customer ID is required")
    @Column(name = "customer_id")
    private Long customerId;

    @NotNull(message = "Total amount is required")
    @Column(name = "total_amount")
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    private OrderStatus status = OrderStatus.PENDING;

    @Column(name = "shipping_address")
    private String shippingAddress;
    
    @Column(name = "billing_address")
    private String billingAddress;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<OrderItem> items;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public enum OrderStatus {
        PENDING, CONFIRMED, SHIPPED, DELIVERED, CANCELLED
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
\`\`\`

#### Order Item Entity
\`\`\`java
package com.kalakriti.order.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;

@Entity
@Table(name = "order_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id")
    private Order order;

    @NotNull(message = "Product ID is required")
    @Column(name = "product_id")
    private Long productId;

    @NotNull(message = "Quantity is required")
    private Integer quantity;

    @NotNull(message = "Price is required")
    private BigDecimal price;

    @Column(name = "product_name")
    private String productName;
    
    @Column(name = "artist_id")
    private Long artistId;
}
\`\`\`

#### Order Repository
\`\`\`java
package com.kalakriti.order.repository;

import com.kalakriti.order.model.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByCustomerId(Long customerId);
    List<Order> findByStatus(Order.OrderStatus status);
}
\`\`\`

#### Order Service
\`\`\`java
package com.kalakriti.order.service;

import com.kalakriti.order.model.Order;
import com.kalakriti.order.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    public List<Order> getOrdersByCustomer(Long customerId) {
        return orderRepository.findByCustomerId(customerId);
    }

    public Order createOrder(Order order) {
        return orderRepository.save(order);
    }

    public Order updateOrderStatus(Long id, Order.OrderStatus status) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        order.setStatus(status);
        return orderRepository.save(order);
    }

    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }
}
\`\`\`

#### Order Controller
\`\`\`java
package com.kalakriti.order.controller;

import com.kalakriti.order.model.Order;
import com.kalakriti.order.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @GetMapping
    public List<Order> getAllOrders() {
        return orderService.getAllOrders();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long id) {
        Optional<Order> order = orderService.getOrderById(id);
        return order.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/customer/{customerId}")
    public List<Order> getOrdersByCustomer(@PathVariable Long customerId) {
        return orderService.getOrdersByCustomer(customerId);
    }

    @PostMapping
    public Order createOrder(@RequestBody Order order) {
        return orderService.createOrder(order);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id, @RequestBody Order.OrderStatus status) {
        try {
            Order updatedOrder = orderService.updateOrderStatus(id, status);
            return ResponseEntity.ok(updatedOrder);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }
}
\`\`\`

#### Main Application Class
\`\`\`java
package com.kalakriti.order;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

@SpringBootApplication
@EnableEurekaClient
public class OrderServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(OrderServiceApplication.class, args);
    }
}
\`\`\`

### 7. Payment Service

**Port**: 8084

#### Dependencies (pom.xml)
\`\`\`xml
<dependencies>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-web</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-data-jpa</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.cloud</groupId>
        <artifactId>spring-cloud-starter-netflix-eureka-client</artifactId>
    </dependency>
    <dependency>
        <groupId>org.postgresql</groupId>
        <artifactId>postgresql</artifactId>
    </dependency>
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-validation</artifactId>
    </dependency>
</dependencies>
\`\`\`

#### application.yml
\`\`\`yaml
server:
  port: 8084

spring:
  application:
    name: payment-service
  datasource:
    url: jdbc:postgresql://localhost:5432/kala_kriti_payments
    username: postgres
    password: password
    driver-class-name: org.postgresql.Driver
  jpa:
    hibernate:
      ddl-auto: update
    show-sql: true
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true

eureka:
  client:
    service-url:
      default-zone: http://localhost:8761/eureka/
\`\`\`

#### Payment Entity
\`\`\`java
package com.kalakriti.payment.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull(message = "Order ID is required")
    @Column(name = "order_id")
    private Long orderId;

    @NotNull(message = "Customer ID is required")
    @Column(name = "customer_id")
    private Long customerId;

    @NotNull(message = "Amount is required")
    private BigDecimal amount;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status = PaymentStatus.PENDING;

    @Enumerated(EnumType.STRING)
    private PaymentMethod method;

    @Column(name = "transaction_id")
    private String transactionId;
    
    @Column(name = "gateway_response")
    private String gatewayResponse;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public enum PaymentStatus {
        PENDING, COMPLETED, FAILED, REFUNDED
    }

    public enum PaymentMethod {
        CREDIT_CARD, DEBIT_CARD, UPI, NET_BANKING, WALLET
    }

    @PreUpdate
    public void preUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
\`\`\`

#### Payment Repository
\`\`\`java
package com.kalakriti.payment.repository;

import com.kalakriti.payment.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByCustomerId(Long customerId);
    List<Payment> findByStatus(Payment.PaymentStatus status);
    Optional<Payment> findByOrderId(Long orderId);
    Optional<Payment> findByTransactionId(String transactionId);
}
\`\`\`

#### Payment Service
\`\`\`java
package com.kalakriti.payment.service;

import com.kalakriti.payment.model.Payment;
import com.kalakriti.payment.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public Optional<Payment> getPaymentById(Long id) {
        return paymentRepository.findById(id);
    }

    public List<Payment> getPaymentsByCustomer(Long customerId) {
        return paymentRepository.findByCustomerId(customerId);
    }

    public Optional<Payment> getPaymentByOrderId(Long orderId) {
        return paymentRepository.findByOrderId(orderId);
    }

    public Payment processPayment(Payment payment) {
        // Generate transaction ID
        payment.setTransactionId(UUID.randomUUID().toString());
        
        // Simulate payment processing
        // In real implementation, this would integrate with payment gateway
        try {
            // Simulate payment gateway call
            Thread.sleep(1000); // Simulate network delay
            
            // Simulate success (90% success rate)
            if (Math.random() > 0.1) {
                payment.setStatus(Payment.PaymentStatus.COMPLETED);
                payment.setGatewayResponse("Payment processed successfully");
            } else {
                payment.setStatus(Payment.PaymentStatus.FAILED);
                payment.setGatewayResponse("Payment failed - insufficient funds");
            }
        } catch (InterruptedException e) {
            payment.setStatus(Payment.PaymentStatus.FAILED);
            payment.setGatewayResponse("Payment processing interrupted");
        }
        
        return paymentRepository.save(payment);
    }

    public Payment updatePaymentStatus(Long id, Payment.PaymentStatus status) {
        Payment payment = paymentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Payment not found"));
        payment.setStatus(status);
        return paymentRepository.save(payment);
    }

    public void deletePayment(Long id) {
        paymentRepository.deleteById(id);
    }
}
\`\`\`

#### Payment Controller
\`\`\`java
package com.kalakriti.payment.controller;

import com.kalakriti.payment.model.Payment;
import com.kalakriti.payment.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @GetMapping
    public List<Payment> getAllPayments() {
        return paymentService.getAllPayments();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Payment> getPaymentById(@PathVariable Long id) {
        Optional<Payment> payment = paymentService.getPaymentById(id);
        return payment.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/customer/{customerId}")
    public List<Payment> getPaymentsByCustomer(@PathVariable Long customerId) {
        return paymentService.getPaymentsByCustomer(customerId);
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<Payment> getPaymentByOrderId(@PathVariable Long orderId) {
        Optional<Payment> payment = paymentService.getPaymentByOrderId(orderId);
        return payment.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/process")
    public Payment processPayment(@RequestBody Payment payment) {
        return paymentService.processPayment(payment);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Payment> updatePaymentStatus(@PathVariable Long id, @RequestBody Payment.PaymentStatus status) {
        try {
            Payment updatedPayment = paymentService.updatePaymentStatus(id, status);
            return ResponseEntity.ok(updatedPayment);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePayment(@PathVariable Long id) {
        paymentService.deletePayment(id);
        return ResponseEntity.noContent().build();
    }
}
\`\`\`

#### Main Application Class
\`\`\`java
package com.kalakriti.payment;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;

@SpringBootApplication
@EnableEurekaClient
public class PaymentServiceApplication {
    public static void main(String[] args) {
        SpringApplication.run(PaymentServiceApplication.class, args);
    }
}
\`\`\`

## Root pom.xml

\`\`\`xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.kalakriti</groupId>
    <artifactId>kala-kriti</artifactId>
    <version>1.0.0</version>
    <packaging>pom</packaging>

    <name>Kala Kriti - E-Commerce Artist Platform</name>
    <description>Microservices-based e-commerce platform for artists</description>

    <modules>
        <module>discovery-service</module>
        <module>config-service</module>
        <module>api-gateway</module>
        <module>user-service</module>
        <module>product-service</module>
        <module>order-service</module>
        <module>payment-service</module>
    </modules>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.1.5</version>
        <relativePath/>
    </parent>

    <properties>
        <java.version>17</java.version>
        <spring-cloud.version>2023.0.0</spring-cloud.version>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
    </properties>

    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>${spring-cloud.version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <build>
        <pluginManagement>
            <plugins>
                <plugin>
                    <groupId>org.springframework.boot</groupId>
                    <artifactId>spring-boot-maven-plugin</artifactId>
                </plugin>
            </plugins>
        </pluginManagement>
    </build>
</project>
\`\`\`

## Docker Compose Configuration

\`\`\`yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: kala-kriti-postgres
    environment:
      POSTGRES_DB: postgres
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init-scripts:/docker-entrypoint-initdb.d
    networks:
      - kala-kriti-network

  discovery-service:
    build: ./discovery-service
    container_name: discovery-service
    ports:
      - "8761:8761"
    networks:
      - kala-kriti-network

  config-service:
    build: ./config-service
    container_name: config-service
    ports:
      - "8888:8888"
    depends_on:
      - discovery-service
    networks:
      - kala-kriti-network

  api-gateway:
    build: ./api-gateway
    container_name: api-gateway
    ports:
      - "8080:8080"
    depends_on:
      - discovery-service
      - config-service
    networks:
      - kala-kriti-network

  user-service:
    build: ./user-service
    container_name: user-service
    ports:
      - "8081:8081"
    depends_on:
      - postgres
      - discovery-service
    environment:
      - SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/kala_kriti_users
      - SPRING_DATASOURCE_USERNAME=postgres
      - SPRING_DATASOURCE_PASSWORD=password
    networks:
      - kala-kriti-network

  product-service:
    build: ./product-service
    container_name: product-service
    ports:
      - "8082:8082"
    depends_on:
      - postgres
      - discovery-service
    environment:
      - SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/kala_kriti_products
      - SPRING_DATASOURCE_USERNAME=postgres
      - SPRING_DATASOURCE_PASSWORD=password
    networks:
      - kala-kriti-network

  order-service:
    build: ./order-service
    container_name: order-service
    ports:
      - "8083:8083"
    depends_on:
      - postgres
      - discovery-service
    environment:
      - SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/kala_kriti_orders
      - SPRING_DATASOURCE_USERNAME=postgres
      - SPRING_DATASOURCE_PASSWORD=password
    networks:
      - kala-kriti-network

  payment-service:
    build: ./payment-service
    container_name: payment-service
    ports:
      - "8084:8084"
    depends_on:
      - postgres
      - discovery-service
    environment:
      - SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/kala_kriti_payments
      - SPRING_DATASOURCE_USERNAME=postgres
      - SPRING_DATASOURCE_PASSWORD=password
    networks:
      - kala-kriti-network

volumes:
  postgres_data:

networks:
  kala-kriti-network:
    driver: bridge
\`\`\`

## Database Initialization Script

Create `init-scripts/init.sql`:

\`\`\`sql
-- Create databases
CREATE DATABASE kala_kriti_users;
CREATE DATABASE kala_kriti_products;
CREATE DATABASE kala_kriti_orders;
CREATE DATABASE kala_kriti_payments;

-- Grant permissions (PostgreSQL doesn't require explicit grants for owner)
-- The postgres user already has all privileges on databases it creates
\`\`\`

## API Endpoints Summary

### Authentication Service
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### User Service
- `GET /api/users` - Get all users
- `GET /api/users/{id}` - Get user by ID
- `GET /api/users/role/{role}` - Get users by role
- `PUT /api/users/{id}` - Update user
- `DELETE /api/users/{id}` - Delete user

### Product Service
- `GET /api/products` - Get all products
- `GET /api/products/{id}` - Get product by ID
- `GET /api/products/artist/{artistId}` - Get products by artist
- `GET /api/products/category/{categoryId}` - Get products by category
- `GET /api/products/search?name={name}` - Search products
- `POST /api/products` - Create product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

### Category Service
- `GET /api/categories` - Get all categories
- `GET /api/categories/{id}` - Get category by ID
- `POST /api/categories` - Create category
- `PUT /api/categories/{id}` - Update category
- `DELETE /api/categories/{id}` - Delete category

### Order Service
- `GET /api/orders` - Get all orders
- `GET /api/orders/{id}` - Get order by ID
- `GET /api/orders/customer/{customerId}` - Get orders by customer
- `POST /api/orders` - Create order
- `PUT /api/orders/{id}/status` - Update order status
- `DELETE /api/orders/{id}` - Delete order

### Payment Service
- `GET /api/payments` - Get all payments
- `GET /api/payments/{id}` - Get payment by ID
- `GET /api/payments/customer/{customerId}` - Get payments by customer
- `GET /api/payments/order/{orderId}` - Get payment by order ID
- `POST /api/payments/process` - Process payment
- `PUT /api/payments/{id}/status` - Update payment status
- `DELETE /api/payments/{id}` - Delete payment

## How to Run the Project

### Prerequisites
1. **Java 17** or higher
2. **Maven 3.6+**
3. **PostgreSQL 12+**
4. **Docker** and **Docker Compose** (optional)

### Running with Docker Compose (Recommended)

1. **Clone the repository**:
\`\`\`bash
git clone https://github.com/your-username/kala-kriti.git
cd kala-kriti
\`\`\`

2. **Build and run all services**:
\`\`\`bash
docker-compose up --build
\`\`\`

3. **Access the services**:
- API Gateway: http://localhost:8080
- Eureka Dashboard: http://localhost:8761
- Config Server: http://localhost:8888

### Running Manually

1. **Start PostgreSQL and create databases**:
\`\`\`sql
CREATE DATABASE kala_kriti_users;
CREATE DATABASE kala_kriti_products;
CREATE DATABASE kala_kriti_orders;
CREATE DATABASE kala_kriti_payments;
\`\`\`

2. **Start services in order**:
\`\`\`bash
# Terminal 1: Discovery Service
cd discovery-service
mvn spring-boot:run

# Terminal 2: Config Service
cd config-service
mvn spring-boot:run

# Terminal 3: API Gateway
cd api-gateway
mvn spring-boot:run

# Terminal 4-7: Microservices
cd user-service && mvn spring-boot:run
cd product-service && mvn spring-boot:run
cd order-service && mvn spring-boot:run
cd payment-service && mvn spring-boot:run
\`\`\`

## Testing the Application

### 1. Register a new user
\`\`\`bash
curl -X POST http://localhost:8080/api/auth/register \
-H "Content-Type: application/json" \
-d '{
  "username": "artist1",
  "password": "password123",
  "email": "artist1@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "ARTIST"
}'
\`\`\`

### 2. Login
\`\`\`bash
curl -X POST http://localhost:8080/api/auth/login \
-H "Content-Type: application/json" \
-d '{
  "username": "artist1",
  "password": "password123"
}'
\`\`\`

### 3. Create a category (with JWT token)
\`\`\`bash
curl -X POST http://localhost:8080/api/categories \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_JWT_TOKEN" \
-d '{
  "name": "Paintings",
  "description": "Original artwork paintings"
}'
\`\`\`

### 4. Create a product (with JWT token)
\`\`\`bash
curl -X POST http://localhost:8080/api/products \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_JWT_TOKEN" \
-d '{
  "name": "Abstract Painting",
  "description": "Beautiful abstract art piece",
  "price": 5000.00,
  "artistId": 1,
  "categoryId": 1,
  "medium": "Oil on Canvas",
  "dimensions": "24x36 inches"
}'
\`\`\`

### 5. Process a payment
\`\`\`bash
curl -X POST http://localhost:8080/api/payments/process \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_JWT_TOKEN" \
-d '{
  "orderId": 1,
  "customerId": 1,
  "amount": 5000.00,
  "method": "CREDIT_CARD"
}'
\`\`\`

## Security Features

1. **JWT Authentication**: Stateless authentication using JSON Web Tokens
2. **CORS Configuration**: Allows all origins for frontend flexibility
3. **Role-based Access**: Three user roles (Admin, Artist, Customer)
4. **Password Encryption**: BCrypt password hashing
5. **API Gateway Security**: Centralized authentication and authorization

## PostgreSQL Configuration

### Key PostgreSQL Features Used:
1. **JSON/JSONB Support**: Can be used for storing flexible product metadata
2. **Advanced Indexing**: Better performance for search operations
3. **Transactions**: ACID compliance for payment processing
4. **UUID Support**: Native UUID type for transaction IDs
5. **Full-text Search**: Built-in search capabilities for product search

### Connection Properties:
- **Driver**: `org.postgresql.Driver`
- **URL Format**: `jdbc:postgresql://host:port/database`
- **Dialect**: `org.hibernate.dialect.PostgreSQLDialect`

## Key Features

1. **Microservices Architecture**: Modular, scalable design
2. **Service Discovery**: Automatic service registration and discovery
3. **Centralized Configuration**: External configuration management
4. **API Gateway**: Single entry point with authentication
5. **JWT Authentication**: Secure, stateless authentication
6. **CORS Support**: Cross-origin resource sharing enabled
7. **Database per Service**: Each service has its own PostgreSQL database
8. **Docker Support**: Containerized deployment
9. **Artist-specific Features**: Portfolio management, artwork catalog
10. **Order Management**: Complete order processing workflow
11. **Payment Processing**: Simulated payment gateway integration

This complete project structure provides a robust foundation for building a scalable e-commerce artist platform using Spring Boot microservices with PostgreSQL databases, JWT authentication, and CORS-enabled API Gateway. PostgreSQL provides excellent performance, reliability, and advanced features that make it ideal for production e-commerce applications.
