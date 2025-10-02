package com.kalakriti.payment.service;

import com.kalakriti.payment.dto.PaymentCreateDTO;
import com.kalakriti.payment.dto.PaymentDTO;
import com.kalakriti.payment.dto.PaymentUpdateDTO;
import com.kalakriti.payment.entity.Payment;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class PaymentMappingService {

    @Autowired
    private ModelMapper modelMapper;

    // Entity to DTO mappings
    public PaymentDTO toPaymentDTO(Payment payment) {
        return modelMapper.map(payment, PaymentDTO.class);
    }

    public List<PaymentDTO> toPaymentDTOList(List<Payment> payments) {
        return payments.stream()
                .map(this::toPaymentDTO)
                .collect(Collectors.toList());
    }

    // DTO to Entity mappings
    public Payment toPayment(PaymentCreateDTO paymentCreateDTO) {
        return modelMapper.map(paymentCreateDTO, Payment.class);
    }

    public Payment updatePaymentFromDTO(Payment existingPayment, PaymentUpdateDTO updateDTO) {
        modelMapper.getConfiguration().setSkipNullEnabled(true);
        modelMapper.map(updateDTO, existingPayment);
        return existingPayment;
    }
}
