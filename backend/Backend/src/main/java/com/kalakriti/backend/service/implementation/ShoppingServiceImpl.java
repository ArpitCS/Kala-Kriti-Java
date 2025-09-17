package com.kalakriti.backend.service.implementation;

import com.kalakriti.backend.entity.CartItem;
import com.kalakriti.backend.entity.Order;
import com.kalakriti.backend.entity.OrderItem;
import com.kalakriti.backend.entity.User;
import com.kalakriti.backend.entity.Artwork;
import com.kalakriti.backend.repository.CartItemRepository;
import com.kalakriti.backend.repository.OrderRepository;
import com.kalakriti.backend.repository.OrderItemRepository;
import com.kalakriti.backend.repository.UserRepository;
import com.kalakriti.backend.repository.ArtworkRepository;
import com.kalakriti.backend.service.ShoppingService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ShoppingServiceImpl implements ShoppingService {
    private final CartItemRepository cartItemRepository;
    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final UserRepository userRepository;
    private final ArtworkRepository artworkRepository;

    @Override
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

    @Override
    public List<CartItem> getCartItems(Long userId) {
        return cartItemRepository.findByUserId(userId);
    }

    @Override
    public void removeFromCart(Long cartItemId) {
        cartItemRepository.deleteById(cartItemId);
    }

    @Override
    @Transactional
    public void clearCart(Long userId) {
        cartItemRepository.deleteByUserId(userId);
    }

    @Override
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

        // Compute total first to avoid inserting Order with null totalAmount
        double totalAmount = cartItems.stream()
                .mapToDouble(ci -> ci.getArtwork().getPrice() * ci.getQuantity())
                .sum();

        Order order = new Order();
        order.setUser(user.get());
        order.setStatus(Order.Status.PENDING);
        order.setCreatedAt(LocalDateTime.now());
        order.setTotalAmount(totalAmount); // ensure not null before first save

        // Persist order once
        order = orderRepository.save(order);

        for (CartItem cartItem : cartItems) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            orderItem.setArtwork(cartItem.getArtwork());
            orderItem.setQuantity(cartItem.getQuantity());
            orderItem.setPrice(cartItem.getArtwork().getPrice());
            orderItemRepository.save(orderItem);
        }

        clearCart(userId);
        return order;
    }

    @Override
    public List<Order> getUserOrders(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    @Override
    public Optional<Order> getOrderById(Long orderId) {
        return orderRepository.findById(orderId);
    }

    @Override
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

