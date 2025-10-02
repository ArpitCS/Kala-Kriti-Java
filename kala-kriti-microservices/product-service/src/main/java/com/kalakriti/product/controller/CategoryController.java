package com.kalakriti.product.controller;

import com.kalakriti.product.dto.CategoryCreateDTO;
import com.kalakriti.product.dto.CategoryDTO;
import com.kalakriti.product.entity.Category;
import com.kalakriti.product.service.CategoryService;
import com.kalakriti.product.service.ProductMappingService;
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
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "*")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @Autowired
    private ProductMappingService mappingService;

    @GetMapping
    public List<CategoryDTO> getAllCategories() {
        List<Category> categories = categoryService.getAllCategories();
        return mappingService.toCategoryDTOList(categories);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryDTO> getCategoryById(@PathVariable Long id) {
        try {
            Category category = categoryService.getCategoryById(id);
            CategoryDTO categoryDTO = mappingService.toCategoryDTO(category);
            return ResponseEntity.ok(categoryDTO);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<?> createCategory(@Valid @RequestBody CategoryCreateDTO categoryCreateDTO) {
        try {
            Category category = mappingService.toCategory(categoryCreateDTO);
            Category created = categoryService.createCategory(category);
            CategoryDTO categoryDTO = mappingService.toCategoryDTO(created);
            return ResponseEntity.status(HttpStatus.CREATED).body(categoryDTO);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCategory(@PathVariable Long id, @Valid @RequestBody CategoryDTO categoryDTO) {
        try {
            Category existingCategory = categoryService.getCategoryById(id);
            Category updatedCategory = mappingService.updateCategoryFromDTO(existingCategory, categoryDTO);
            Category saved = categoryService.updateCategory(id, updatedCategory);
            CategoryDTO resultDTO = mappingService.toCategoryDTO(saved);
            return ResponseEntity.ok(resultDTO);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable Long id) {
        try {
            categoryService.deleteCategory(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
        }
    }
}
