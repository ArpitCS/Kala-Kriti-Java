package com.kalakriti.product.controller;

import com.kalakriti.product.dto.ProductCreateDTO;
import com.kalakriti.product.dto.ProductDTO;
import com.kalakriti.product.dto.ProductUpdateDTO;
import com.kalakriti.product.entity.Product;
import com.kalakriti.product.service.ProductMappingService;
import com.kalakriti.product.service.ProductService;
import jakarta.validation.Valid;
import java.util.List;
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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductService productService;

    @Autowired
    private ProductMappingService mappingService;

    @GetMapping
    public List<ProductDTO> getAllProducts() {
        List<Product> products = productService.getAllProducts();
        return mappingService.toProductDTOList(products);
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable Long id) {
        try {
            Product product = productService.getProductById(id);
            ProductDTO productDTO = mappingService.toProductDTO(product);
            return ResponseEntity.ok(productDTO);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/artist/{artistId}")
    public List<ProductDTO> getProductsByArtist(@PathVariable Long artistId) {
        List<Product> products = productService.getProductsByArtist(artistId);
        return mappingService.toProductDTOList(products);
    }

    @GetMapping("/category/{categoryId}")
    public List<ProductDTO> getProductsByCategory(@PathVariable Long categoryId) {
        List<Product> products = productService.getProductsByCategory(categoryId);
        return mappingService.toProductDTOList(products);
    }

    @GetMapping("/search")
    public List<ProductDTO> searchProducts(@RequestParam String name) {
        List<Product> products = productService.searchProducts(name);
        return mappingService.toProductDTOList(products);
    }

    @PostMapping
    public ResponseEntity<ProductDTO> createProduct(@Valid @RequestBody ProductCreateDTO productCreateDTO) {
        Product product = mappingService.toProduct(productCreateDTO);
        Product created = productService.createProduct(product);
        ProductDTO productDTO = mappingService.toProductDTO(created);
        return ResponseEntity.status(HttpStatus.CREATED).body(productDTO);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable Long id, @Valid @RequestBody ProductUpdateDTO productUpdateDTO) {
        try {
            Product existingProduct = productService.getProductById(id);
            Product updatedProduct = mappingService.updateProductFromDTO(existingProduct, productUpdateDTO);
            Product saved = productService.updateProduct(id, updatedProduct);
            ProductDTO productDTO = mappingService.toProductDTO(saved);
            return ResponseEntity.ok(productDTO);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        try {
            productService.deleteProduct(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }
}
