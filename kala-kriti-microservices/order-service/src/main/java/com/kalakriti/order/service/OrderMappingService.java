package com.kalakriti.order.service;

import com.kalakriti.order.dto.OrderCreateDTO;
import com.kalakriti.order.dto.OrderDTO;
import com.kalakriti.order.dto.OrderItemCreateDTO;
import com.kalakriti.order.dto.OrderItemDTO;
import com.kalakriti.order.dto.OrderUpdateDTO;
import com.kalakriti.order.entity.Order;
import com.kalakriti.order.entity.OrderItem;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class OrderMappingService {

    @Autowired
    private ModelMapper modelMapper;

    // Order Entity to DTO mappings
    public OrderDTO toOrderDTO(Order order) {
        OrderDTO orderDTO = modelMapper.map(order, OrderDTO.class);
        if (order.getItems() != null) {
            List<OrderItemDTO> itemDTOs = order.getItems().stream()
                    .map(this::toOrderItemDTO)
                    .collect(Collectors.toList());
            orderDTO.setItems(itemDTOs);
        }
        return orderDTO;
    }

    public List<OrderDTO> toOrderDTOList(List<Order> orders) {
        return orders.stream()
                .map(this::toOrderDTO)
                .collect(Collectors.toList());
    }

    // Order DTO to Entity mappings
    public Order toOrder(OrderCreateDTO orderCreateDTO) {
        Order order = modelMapper.map(orderCreateDTO, Order.class);
        if (orderCreateDTO.getItems() != null) {
            List<OrderItem> items = orderCreateDTO.getItems().stream()
                    .map(this::toOrderItem)
                    .collect(Collectors.toList());
            order.setItems(items);
            // Set order reference for each item
            items.forEach(item -> item.setOrder(order));
        }
        return order;
    }

    public Order updateOrderFromDTO(Order existingOrder, OrderUpdateDTO updateDTO) {
        modelMapper.getConfiguration().setSkipNullEnabled(true);
        modelMapper.map(updateDTO, existingOrder);
        return existingOrder;
    }

    // OrderItem Entity to DTO mappings
    public OrderItemDTO toOrderItemDTO(OrderItem orderItem) {
        return modelMapper.map(orderItem, OrderItemDTO.class);
    }

    public List<OrderItemDTO> toOrderItemDTOList(List<OrderItem> orderItems) {
        return orderItems.stream()
                .map(this::toOrderItemDTO)
                .collect(Collectors.toList());
    }

    // OrderItem DTO to Entity mappings
    public OrderItem toOrderItem(OrderItemCreateDTO orderItemCreateDTO) {
        return modelMapper.map(orderItemCreateDTO, OrderItem.class);
    }

    public List<OrderItem> toOrderItemList(List<OrderItemCreateDTO> orderItemCreateDTOs) {
        return orderItemCreateDTOs.stream()
                .map(this::toOrderItem)
                .collect(Collectors.toList());
    }
}
