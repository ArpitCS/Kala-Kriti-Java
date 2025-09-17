package com.kalakriti.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderItemDto {
    private Long id;
    private Long orderId;
    private Long artworkId;
    private String artworkTitle;
    private String artworkImageUrl;
    private Double artworkPrice;
    private String artistName;
    private Long artistId;
    private int quantity;
    private Double price;
    private Double totalPrice;
}
