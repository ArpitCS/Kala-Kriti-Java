package com.kalakriti.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CartItemDto {
    private Long id;
    private Long artworkId;
    private String artworkTitle;
    private String artworkImageUrl;
    private Double artworkPrice;
    private int quantity;
    private LocalDateTime addedAt;
    private Double totalPrice;
}
