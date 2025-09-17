package com.kalakriti.backend.dto;

import com.kalakriti.backend.entity.Order;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDto {
    private Long id;
    private Long userId;
    private String username;
    private String email;
    private String userType;
    private List<OrderItemDto> orderItems;
    private Double totalAmount;
    private Order.Status status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
