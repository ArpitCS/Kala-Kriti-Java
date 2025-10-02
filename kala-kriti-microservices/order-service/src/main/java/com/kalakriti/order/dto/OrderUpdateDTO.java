package com.kalakriti.order.dto;

import com.kalakriti.order.entity.Order;

public class OrderUpdateDTO {
    private Order.OrderStatus status;
    private String shippingAddress;
    private String billingAddress;

    // Default constructor
    public OrderUpdateDTO() {}

    // Getters and Setters
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
}
