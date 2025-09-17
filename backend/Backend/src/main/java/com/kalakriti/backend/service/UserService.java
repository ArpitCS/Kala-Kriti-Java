package com.kalakriti.backend.service;

import com.kalakriti.backend.dto.UserRegistrationDto;
import com.kalakriti.backend.entity.User;
import java.util.Optional;

public interface UserService {
    User registerUser(UserRegistrationDto registrationDto);
    Iterable<User> getAllUsers();
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Optional<User> findById(Long id);
}
