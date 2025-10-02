package com.kalakriti.payment.dto;

import com.kalakriti.payment.entity.Payment;

public class PaymentUpdateDTO {
    private Payment.PaymentStatus status;
    private String transactionId;
    private String gatewayResponse;

    // Default constructor
    public PaymentUpdateDTO() {}

    // Getters and Setters
    public Payment.PaymentStatus getStatus() {
        return status;
    }

    public void setStatus(Payment.PaymentStatus status) {
        this.status = status;
    }

    public String getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(String transactionId) {
        this.transactionId = transactionId;
    }

    public String getGatewayResponse() {
        return gatewayResponse;
    }

    public void setGatewayResponse(String gatewayResponse) {
        this.gatewayResponse = gatewayResponse;
    }
}
