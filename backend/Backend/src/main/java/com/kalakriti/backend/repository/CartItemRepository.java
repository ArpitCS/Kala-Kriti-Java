package com.kalakriti.backend.repository;

import com.kalakriti.backend.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUserId(Long userId);

    Optional<CartItem> findByUserIdAndArtworkId(Long userId, Long artworkId);

    void deleteByUserId(Long userId);
}
