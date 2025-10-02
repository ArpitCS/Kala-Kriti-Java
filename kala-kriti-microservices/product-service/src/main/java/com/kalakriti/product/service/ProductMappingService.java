package com.kalakriti.product.service;

import com.kalakriti.product.dto.CategoryCreateDTO;
import com.kalakriti.product.dto.CategoryDTO;
import com.kalakriti.product.dto.ProductCreateDTO;
import com.kalakriti.product.dto.ProductDTO;
import com.kalakriti.product.dto.ProductUpdateDTO;
import com.kalakriti.product.entity.Category;
import com.kalakriti.product.entity.Product;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductMappingService {

    @Autowired
    private ModelMapper modelMapper;

    // Product Entity to DTO mappings
    public ProductDTO toProductDTO(Product product) {
        return modelMapper.map(product, ProductDTO.class);
    }

    public List<ProductDTO> toProductDTOList(List<Product> products) {
        return products.stream()
                .map(this::toProductDTO)
                .collect(Collectors.toList());
    }

    // Product DTO to Entity mappings
    public Product toProduct(ProductCreateDTO productCreateDTO) {
        return modelMapper.map(productCreateDTO, Product.class);
    }

    public Product updateProductFromDTO(Product existingProduct, ProductUpdateDTO updateDTO) {
        modelMapper.getConfiguration().setSkipNullEnabled(true);
        modelMapper.map(updateDTO, existingProduct);
        return existingProduct;
    }

    // Category Entity to DTO mappings
    public CategoryDTO toCategoryDTO(Category category) {
        return modelMapper.map(category, CategoryDTO.class);
    }

    public List<CategoryDTO> toCategoryDTOList(List<Category> categories) {
        return categories.stream()
                .map(this::toCategoryDTO)
                .collect(Collectors.toList());
    }

    // Category DTO to Entity mappings
    public Category toCategory(CategoryCreateDTO categoryCreateDTO) {
        return modelMapper.map(categoryCreateDTO, Category.class);
    }

    public Category updateCategoryFromDTO(Category existingCategory, CategoryDTO categoryDTO) {
        modelMapper.getConfiguration().setSkipNullEnabled(true);
        modelMapper.map(categoryDTO, existingCategory);
        return existingCategory;
    }
}
