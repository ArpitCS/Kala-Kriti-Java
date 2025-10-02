package com.kalakriti.order.controller;

import com.kalakriti.order.dto.OrderCreateDTO;
import com.kalakriti.order.dto.OrderDTO;
import com.kalakriti.order.dto.OrderUpdateDTO;
import com.kalakriti.order.entity.Order;
import com.kalakriti.order.service.OrderMappingService;
import com.kalakriti.order.service.OrderService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private OrderMappingService mappingService;

    @GetMapping
    public List<OrderDTO> getAllOrders() {
        List<Order> orders = orderService.getAllOrders();
        return mappingService.toOrderDTOList(orders);
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable Long id) {
        try {
            Order order = orderService.getOrderById(id);
            OrderDTO orderDTO = mappingService.toOrderDTO(order);
            return ResponseEntity.ok(orderDTO);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/customer/{customerId}")
    public List<OrderDTO> getOrdersByCustomer(@PathVariable Long customerId) {
        List<Order> orders = orderService.getOrdersByCustomer(customerId);
        return mappingService.toOrderDTOList(orders);
    }

    @PostMapping
    public ResponseEntity<OrderDTO> createOrder(@Valid @RequestBody OrderCreateDTO orderCreateDTO) {
        Order order = mappingService.toOrder(orderCreateDTO);
        Order createdOrder = orderService.createOrder(order);
        OrderDTO orderDTO = mappingService.toOrderDTO(createdOrder);
        return ResponseEntity.status(HttpStatus.CREATED).body(orderDTO);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable Long id, @RequestBody StatusUpdateRequest request) {
        try {
            Order.OrderStatus status = Order.OrderStatus.valueOf(request.getStatus().toUpperCase());
            Order updated = orderService.updateOrderStatus(id, status);
            OrderDTO orderDTO = mappingService.toOrderDTO(updated);
            return ResponseEntity.ok(orderDTO);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateOrder(@PathVariable Long id, @Valid @RequestBody OrderUpdateDTO orderUpdateDTO) {
        try {
            Order existingOrder = orderService.getOrderById(id);
            Order updatedOrder = mappingService.updateOrderFromDTO(existingOrder, orderUpdateDTO);
            Order saved = orderService.updateOrder(id, updatedOrder);
            OrderDTO orderDTO = mappingService.toOrderDTO(saved);
            return ResponseEntity.ok(orderDTO);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOrder(@PathVariable Long id) {
        try {
            orderService.deleteOrder(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }

    public static class StatusUpdateRequest {
        private String status;

        public String getStatus() {
            return status;
        }

        public void setStatus(String status) {
            this.status = status;
        }
    }
}
