package com.kalakriti.backend.service;

import com.kalakriti.backend.entity.CartItem;
import com.kalakriti.backend.entity.Order;
import com.kalakriti.backend.entity.OrderItem;
import java.util.List;
import java.util.Optional;

public interface ShoppingService {
    CartItem addToCart(Long userId, Long artworkId, int quantity);
    List<CartItem> getCartItems(Long userId);
    void removeFromCart(Long cartItemId);
    void clearCart(Long userId);
    Order createOrder(Long userId);
    List<Order> getUserOrders(Long userId);
    Optional<Order> getOrderById(Long orderId);
    Order updateOrderStatus(Long orderId, Order.Status status);
}
