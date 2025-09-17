package com.kalakriti.backend.service;

import com.kalakriti.backend.dto.ArtworkDto;
import com.kalakriti.backend.entity.Artwork;
import java.util.List;
import java.util.Optional;

public interface ArtworkService {
    Artwork createArtwork(ArtworkDto artworkDto, Long artistId);
    List<Artwork> findAll();
    Optional<Artwork> findById(Long id);
    List<Artwork> findByArtistId(Long artistId);
    List<Artwork> searchByTitle(String title);
    List<Artwork> findByPriceRange(Double minPrice, Double maxPrice);
    Artwork updateArtwork(Long id, ArtworkDto artworkDto);
    void deleteArtwork(Long id);
}
