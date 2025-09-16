package com.kalakriti.backend.controller;

import com.kalakriti.backend.entity.Order;
import com.kalakriti.backend.service.ShoppingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

import com.kalakriti.backend.dto.UserDto;
import com.kalakriti.backend.entity.User;
import com.kalakriti.backend.service.UserService;
import org.modelmapper.ModelMapper;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private ShoppingService shoppingService;

    @Autowired
    private UserService userService;

    @Autowired
    private ModelMapper modelMapper;

    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok().build();
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getAllUsers() {
        Iterable<User> users = userService.getAllUsers();
        List<UserDto> result = new ArrayList<>();
        for (User u : users) {
            result.add(modelMapper.map(u, UserDto.class));
        }
        return ResponseEntity.ok(result);
    }

    @PutMapping("/orders/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long orderId,
                                               @RequestParam String status) {
        try {
            Order.Status orderStatus = Order.Status.valueOf(status.toUpperCase());
            Order order = shoppingService.updateOrderStatus(orderId, orderStatus);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
