package com.kalakriti.backend.service;

import com.kalakriti.backend.entity.*;
import com.kalakriti.backend.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ShoppingService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ArtworkRepository artworkRepository;

    public CartItem addToCart(Long userId, Long artworkId, int quantity) {
        Optional<User> user = userRepository.findById(userId);
        Optional<Artwork> artwork = artworkRepository.findById(artworkId);

        if (user.isEmpty() || artwork.isEmpty()) {
            throw new RuntimeException("User or artwork not found");
        }

        Optional<CartItem> existingCartItem = cartItemRepository.findByUserIdAndArtworkId(userId, artworkId);

        if (existingCartItem.isPresent()) {
            CartItem cartItem = existingCartItem.get();
            cartItem.setQuantity(cartItem.getQuantity() + quantity);
            return cartItemRepository.save(cartItem);
        } else {
            CartItem cartItem = new CartItem();
            cartItem.setUser(user.get());
            cartItem.setArtwork(artwork.get());
            cartItem.setQuantity(quantity);
            cartItem.setAddedAt(LocalDateTime.now());
            return cartItemRepository.save(cartItem);
        }
    }

    public List<CartItem> getCartItems(Long userId) {
        return cartItemRepository.findByUserId(userId);
    }

    public void removeFromCart(Long cartItemId) {
        cartItemRepository.deleteById(cartItemId);
    }

    @Transactional
    public void clearCart(Long userId) {
        cartItemRepository.deleteByUserId(userId);
    }

    @Transactional
    public Order createOrder(Long userId) {
        List<CartItem> cartItems = cartItemRepository.findByUserId(userId);
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        Optional<User> user = userRepository.findById(userId);
        if (user.isEmpty()) {
            throw new RuntimeException("User not found");
        }

        Order order = new Order();
        order.setUser(user.get());
        order.setStatus(Order.Status.PENDING);
        order.setCreatedAt(LocalDateTime.now());

        double totalAmount = 0.0;
        order = orderRepository.save(order);

        for (CartItem cartItem : cartItems) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setArtwork(cartItem.getArtwork());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(cartItem.getArtwork().getPrice());
            orderItemRepository.save(orderItem);

            totalAmount += cartItem.getQuantity() * cartItem.getArtwork().getPrice();
        }

        order.setTotalAmount(totalAmount);
        order = orderRepository.save(order);

        // Clear cart after order creation
        clearCart(userId);

        return order;
    }

    public List<Order> getUserOrders(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public Optional<Order> getOrderById(Long orderId) {
        return orderRepository.findById(orderId);
    }

    public Order updateOrderStatus(Long orderId, Order.Status status) {
        Optional<Order> order = orderRepository.findById(orderId);
        if (order.isEmpty()) {
            throw new RuntimeException("Order not found");
        }

        Order orderEntity = order.get();
        orderEntity.setStatus(status);
        orderEntity.setUpdatedAt(LocalDateTime.now());
        return orderRepository.save(orderEntity);
    }
}
