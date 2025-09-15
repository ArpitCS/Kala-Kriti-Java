package com.kalakriti.backend.controller;

import com.kalakriti.backend.entity.Order;
import com.kalakriti.backend.service.ShoppingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "*")
public class AdminController {

    @Autowired
    private ShoppingService shoppingService;

    @GetMapping("/orders")
    public ResponseEntity<List<Order>> getAllOrders() {
        // This would typically require admin authorization
        // For now, returning all orders - in production, add security checks
        return ResponseEntity.ok().build();
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
