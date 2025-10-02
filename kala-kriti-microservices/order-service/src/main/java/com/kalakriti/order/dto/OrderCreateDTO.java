package com.kalakriti.order.dto;

import com.kalakriti.order.entity.Order;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.util.List;

public class OrderCreateDTO {
    @NotNull(message = "Customer ID is required")
    private Long customerId;

    @NotNull(message = "Total amount is required")
    private BigDecimal totalAmount;

    private Order.OrderStatus status = Order.OrderStatus.PENDING;

    private String shippingAddress;
    private String billingAddress;

    @NotNull(message = "Order items are required")
    private List<OrderItemCreateDTO> items;

    // Default constructor
    public OrderCreateDTO() {}

    // Getters and Setters
    public Long getCustomerId() {
        return customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public Order.OrderStatus getStatus() {
        return status;
    }

    public void setStatus(Order.OrderStatus status) {
        this.status = status;
    }

    public String getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public String getBillingAddress() {
        return billingAddress;
    }

    public void setBillingAddress(String billingAddress) {
        this.billingAddress = billingAddress;
    }

    public List<OrderItemCreateDTO> getItems() {
        return items;
    }

    public void setItems(List<OrderItemCreateDTO> items) {
        this.items = items;
    }
}
