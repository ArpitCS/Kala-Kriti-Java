package com.kalakriti.product.dto;

import jakarta.validation.constraints.NotBlank;

public class CategoryCreateDTO {
    @NotBlank(message = "Category name is required")
    private String name;

    private String description;

    // Default constructor
    public CategoryCreateDTO() {}

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
