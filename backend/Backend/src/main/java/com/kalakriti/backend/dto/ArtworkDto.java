package com.kalakriti.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArtworkDto {
    private Long id;
    private String title;
    private String description;
    private Double price;
    private String imageUrl;
    private LocalDateTime createdAt;
    private String artistName;
    private Long artistId;
}
