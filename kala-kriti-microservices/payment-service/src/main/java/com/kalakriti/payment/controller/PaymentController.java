package com.kalakriti.payment.controller;

import com.kalakriti.payment.dto.PaymentCreateDTO;
import com.kalakriti.payment.dto.PaymentDTO;
import com.kalakriti.payment.dto.PaymentUpdateDTO;
import com.kalakriti.payment.entity.Payment;
import com.kalakriti.payment.service.PaymentMappingService;
import com.kalakriti.payment.service.PaymentService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;
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
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private PaymentMappingService mappingService;

    @GetMapping
    public List<PaymentDTO> getAllPayments() {
        List<Payment> payments = paymentService.getAllPayments();
        return mappingService.toPaymentDTOList(payments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PaymentDTO> getPaymentById(@PathVariable Long id) {
        Optional<Payment> payment = paymentService.getPaymentById(id);
        return payment.map(p -> ResponseEntity.ok(mappingService.toPaymentDTO(p)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/customer/{customerId}")
    public List<PaymentDTO> getPaymentsByCustomer(@PathVariable Long customerId) {
        List<Payment> payments = paymentService.getPaymentsByCustomer(customerId);
        return mappingService.toPaymentDTOList(payments);
    }

    @GetMapping("/order/{orderId}")
    public ResponseEntity<PaymentDTO> getPaymentByOrderId(@PathVariable Long orderId) {
        Optional<Payment> payment = paymentService.getPaymentByOrderId(orderId);
        return payment.map(p -> ResponseEntity.ok(mappingService.toPaymentDTO(p)))
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping("/process")
    public ResponseEntity<PaymentDTO> processPayment(@Valid @RequestBody PaymentCreateDTO paymentCreateDTO) {
        Payment payment = mappingService.toPayment(paymentCreateDTO);
        Payment processed = paymentService.processPayment(payment);
        PaymentDTO paymentDTO = mappingService.toPaymentDTO(processed);
        return ResponseEntity.status(HttpStatus.CREATED).body(paymentDTO);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updatePaymentStatus(@PathVariable Long id, @RequestBody StatusUpdateRequest request) {
        try {
            Payment.PaymentStatus status = Payment.PaymentStatus.valueOf(request.getStatus().toUpperCase());
            Payment updated = paymentService.updatePaymentStatus(id, status);
            PaymentDTO paymentDTO = mappingService.toPaymentDTO(updated);
            return ResponseEntity.ok(paymentDTO);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updatePayment(@PathVariable Long id, @Valid @RequestBody PaymentUpdateDTO paymentUpdateDTO) {
        try {
            Optional<Payment> existingPayment = paymentService.getPaymentById(id);
            if (existingPayment.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Payment updatedPayment = mappingService.updatePaymentFromDTO(existingPayment.get(), paymentUpdateDTO);
            Payment saved = paymentService.updatePayment(id, updatedPayment);
            PaymentDTO paymentDTO = mappingService.toPaymentDTO(saved);
            return ResponseEntity.ok(paymentDTO);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePayment(@PathVariable Long id) {
        try {
            paymentService.deletePayment(id);
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
