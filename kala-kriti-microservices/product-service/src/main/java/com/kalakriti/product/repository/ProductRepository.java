package com.kalakriti.product.repository;

import com.kalakriti.product.model.Product;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByArtistId(Long artistId);
    List<Product> findByCategoryId(Long categoryId);
    List<Product> findByStatus(Product.ProductStatus status);
    List<Product> findByNameContainingIgnoreCase(String name);
}
