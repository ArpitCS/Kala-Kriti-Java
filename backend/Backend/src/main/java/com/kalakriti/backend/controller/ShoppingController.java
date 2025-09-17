package com.kalakriti.backend.controller;

import com.kalakriti.backend.config.ModelMapperConfig;
import com.kalakriti.backend.dto.OrderDto;
import com.kalakriti.backend.entity.CartItem;
import com.kalakriti.backend.entity.Order;
import com.kalakriti.backend.service.ShoppingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/shopping")
@CrossOrigin(origins = "*")
public class ShoppingController {
    
    @Autowired
    private ShoppingService shoppingService;
    
    @Autowired
    private ModelMapperConfig.EntityMapper entityMapper;
    
    // Cart endpoints
    @PostMapping("/cart/add")
    public ResponseEntity<?> addToCart(@RequestParam Long userId, 
                                       @RequestParam Long artworkId, 
                                       @RequestParam int quantity) {
        try {
            CartItem cartItem = shoppingService.addToCart(userId, artworkId, quantity);
            return ResponseEntity.ok(cartItem);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/cart/{userId}")
    public ResponseEntity<List<CartItem>> getCartItems(@PathVariable Long userId) {
        List<CartItem> cartItems = shoppingService.getCartItems(userId);
        return ResponseEntity.ok(cartItems);
    }
    
    @DeleteMapping("/cart/{cartItemId}")
    public ResponseEntity<?> removeFromCart(@PathVariable Long cartItemId) {
        try {
            shoppingService.removeFromCart(cartItemId);
            return ResponseEntity.ok("Item removed from cart");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @DeleteMapping("/cart/clear/{userId}")
    public ResponseEntity<?> clearCart(@PathVariable Long userId) {
        try {
            shoppingService.clearCart(userId);
            return ResponseEntity.ok("Cart cleared");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    // Order endpoints
    @PostMapping("/order/create/{userId}")
    public ResponseEntity<?> createOrder(@PathVariable Long userId) {
        try {
            Order order = shoppingService.createOrder(userId);
            OrderDto orderDto = entityMapper.toOrderDto(order);
            return ResponseEntity.ok(orderDto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/orders/{userId}")
    public ResponseEntity<List<OrderDto>> getUserOrders(@PathVariable Long userId) {
        List<Order> orders = shoppingService.getUserOrders(userId);
        List<OrderDto> orderDtos = entityMapper.toOrderDtoList(orders);
        return ResponseEntity.ok(orderDtos);
    }
    
    @GetMapping("/order/{orderId}")
    public ResponseEntity<OrderDto> getOrderById(@PathVariable Long orderId) {
        Optional<Order> order = shoppingService.getOrderById(orderId);
        if (order.isPresent()) {
            OrderDto orderDto = entityMapper.toOrderDto(order.get());
            return ResponseEntity.ok(orderDto);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
    @PutMapping("/order/{orderId}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long orderId, 
                                               @RequestParam String status) {
        try {
            Order.Status orderStatus = Order.Status.valueOf(status.toUpperCase());
            Order order = shoppingService.updateOrderStatus(orderId, orderStatus);
            OrderDto orderDto = entityMapper.toOrderDto(order);
            return ResponseEntity.ok(orderDto);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
