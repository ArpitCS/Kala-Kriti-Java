package com.kalakriti.product.service;

import com.kalakriti.product.model.Product;
import com.kalakriti.product.repository.ProductRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ProductService {

    @Autowired
    private ProductRepository productRepository;

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Product not found"));
    }

    public List<Product> getProductsByArtist(Long artistId) {
        return productRepository.findByArtistId(artistId);
    }

    public List<Product> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoryId(categoryId);
    }

    public List<Product> searchProducts(String name) {
        return productRepository.findByNameContainingIgnoreCase(name);
    }

    public Product createProduct(Product product) {
        if (product.getStatus() == null) {
            product.setStatus(Product.ProductStatus.ACTIVE);
        }
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, Product productDetails) {
        Product product = productRepository.findById(id)
            .orElseThrow(() -> new IllegalArgumentException("Product not found"));

        product.setName(productDetails.getName());
        product.setDescription(productDetails.getDescription());
        product.setPrice(productDetails.getPrice());
        product.setImageUrl(productDetails.getImageUrl());
        product.setArtistId(productDetails.getArtistId());
        product.setCategoryId(productDetails.getCategoryId());
        product.setStockQuantity(productDetails.getStockQuantity());
        product.setStatus(productDetails.getStatus());
        product.setDimensions(productDetails.getDimensions());
        product.setMedium(productDetails.getMedium());
        product.setYearCreated(productDetails.getYearCreated());

        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new IllegalArgumentException("Product not found");
        }
        productRepository.deleteById(id);
    }
}
