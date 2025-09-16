package com.kalakriti.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ArtistProfileDto {
    private Long id;
    private String bio;
    private String profileImageUrl;
    private String contactInfo;
    private String socialLinks;
    private String username;
    private String email;
}
