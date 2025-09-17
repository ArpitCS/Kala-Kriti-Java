package com.kalakriti.backend.config;

import com.kalakriti.backend.dto.OrderDto;
import com.kalakriti.backend.dto.OrderItemDto;
import com.kalakriti.backend.entity.Order;
import com.kalakriti.backend.entity.OrderItem;
import org.modelmapper.ModelMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Configuration
public class ModelMapperConfig {

    @Bean
    public ModelMapper modelMapper() {
        return new ModelMapper();
    }
    
    @Component
    public static class EntityMapper {
        
        public OrderDto toOrderDto(Order order) {
            if (order == null) return null;
            
            OrderDto dto = new OrderDto();
            dto.setId(order.getId());
            dto.setUserId(order.getUser().getId());
            dto.setUsername(order.getUser().getUsername());
            dto.setEmail(order.getUser().getEmail());
            dto.setUserType(order.getUser().getUserType().toString());
            dto.setTotalAmount(order.getTotalAmount());
            dto.setStatus(order.getStatus());
            dto.setCreatedAt(order.getCreatedAt());
            dto.setUpdatedAt(order.getUpdatedAt());
            
            if (order.getOrderItems() != null) {
                dto.setOrderItems(order.getOrderItems().stream()
                    .map(this::toOrderItemDto)
                    .collect(Collectors.toList()));
            }
            
            return dto;
        }
        
        public OrderItemDto toOrderItemDto(OrderItem orderItem) {
            if (orderItem == null) return null;
            
            OrderItemDto dto = new OrderItemDto();
            dto.setId(orderItem.getId());
            dto.setOrderId(orderItem.getOrder().getId());
            dto.setQuantity(orderItem.getQuantity());
            dto.setPrice(orderItem.getPrice());
            dto.setTotalPrice(orderItem.getPrice() * orderItem.getQuantity());
            
            if (orderItem.getArtwork() != null) {
                dto.setArtworkId(orderItem.getArtwork().getId());
                dto.setArtworkTitle(orderItem.getArtwork().getTitle());
                dto.setArtworkImageUrl(orderItem.getArtwork().getImageUrl());
                dto.setArtworkPrice(orderItem.getArtwork().getPrice());
                
                if (orderItem.getArtwork().getArtist() != null && 
                    orderItem.getArtwork().getArtist().getUser() != null) {
                    dto.setArtistName(orderItem.getArtwork().getArtist().getUser().getUsername());
                    dto.setArtistId(orderItem.getArtwork().getArtist().getUser().getId());
                }
            }
            
            return dto;
        }
        
        public List<OrderDto> toOrderDtoList(List<Order> orders) {
            if (orders == null) return null;
            return orders.stream()
                .map(this::toOrderDto)
                .collect(Collectors.toList());
        }
    }
}
