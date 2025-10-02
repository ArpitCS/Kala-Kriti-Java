package com.kalakriti.user.service;

import com.kalakriti.user.dto.UserCreateDTO;
import com.kalakriti.user.dto.UserDTO;
import com.kalakriti.user.dto.UserUpdateDTO;
import com.kalakriti.user.entity.User;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserMappingService {

    @Autowired
    private ModelMapper modelMapper;

    // Entity to DTO mappings
    public UserDTO toUserDTO(User user) {
        return modelMapper.map(user, UserDTO.class);
    }

    public List<UserDTO> toUserDTOList(List<User> users) {
        return users.stream()
                .map(this::toUserDTO)
                .collect(Collectors.toList());
    }

    // DTO to Entity mappings
    public User toUser(UserCreateDTO userCreateDTO) {
        return modelMapper.map(userCreateDTO, User.class);
    }

    public User updateUserFromDTO(User existingUser, UserUpdateDTO updateDTO) {
        // Skip null values to avoid overwriting existing data
        modelMapper.getConfiguration().setSkipNullEnabled(true);
        modelMapper.map(updateDTO, existingUser);
        return existingUser;
    }
}
