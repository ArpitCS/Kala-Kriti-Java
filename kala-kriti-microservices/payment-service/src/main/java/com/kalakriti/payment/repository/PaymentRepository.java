package com.kalakriti.payment.repository;

import com.kalakriti.payment.model.Payment;
import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepository extends JpaRepository<Payment, Long> {
    List<Payment> findByCustomerId(Long customerId);
    List<Payment> findByStatus(Payment.PaymentStatus status);
    Optional<Payment> findByOrderId(Long orderId);
    Optional<Payment> findByTransactionId(String transactionId);
}
