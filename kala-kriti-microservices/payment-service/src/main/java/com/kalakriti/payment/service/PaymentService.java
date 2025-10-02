package com.kalakriti.payment.service;

import com.kalakriti.payment.entity.Payment;
import com.kalakriti.payment.repository.PaymentRepository;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public Optional<Payment> getPaymentById(Long id) {
        return paymentRepository.findById(id);
    }

    public List<Payment> getPaymentsByCustomer(Long customerId) {
        return paymentRepository.findByCustomerId(customerId);
    }

    public Optional<Payment> getPaymentByOrderId(Long orderId) {
        return paymentRepository.findByOrderId(orderId);
    }

    @Transactional
    public Payment processPayment(Payment payment) {
        payment.setTransactionId(UUID.randomUUID().toString());
        try {
            Thread.sleep(100); // simulate network latency
            payment.setStatus(Payment.PaymentStatus.COMPLETED);
            payment.setGatewayResponse("Payment processed successfully");
        } catch (InterruptedException ex) {
            Thread.currentThread().interrupt();
            payment.setStatus(Payment.PaymentStatus.FAILED);
            payment.setGatewayResponse("Payment interrupted");
        }
        return paymentRepository.save(payment);
    }

    @Transactional
    public Payment updatePaymentStatus(Long id, Payment.PaymentStatus status) {
        Payment payment = paymentRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Payment not found"));
        payment.setStatus(status);
        return paymentRepository.save(payment);
    }

    public void deletePayment(Long id) {
        if (!paymentRepository.existsById(id)) {
            throw new IllegalArgumentException("Payment not found");
        }
        paymentRepository.deleteById(id);
    }
}
