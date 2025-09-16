package com.kalakriti.backend.service;

import com.kalakriti.backend.dto.ArtworkDto;
import com.kalakriti.backend.entity.Artwork;
import com.kalakriti.backend.entity.ArtistProfile;
import com.kalakriti.backend.repository.ArtworkRepository;
import com.kalakriti.backend.repository.ArtistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class ArtworkService {
    @Autowired
    private ArtworkRepository artworkRepository;

    @Autowired
    private ArtistRepository artistRepository;

    public Artwork createArtwork(ArtworkDto artworkDto, Long artistId) {
        Optional<ArtistProfile> artist = artistRepository.findById(artistId);
        if (artist.isEmpty()) {
            throw new RuntimeException("Artist not found");
        }

        Artwork artwork = new Artwork();
        artwork.setTitle(artworkDto.getTitle());
        artwork.setDescription(artworkDto.getDescription());
        artwork.setPrice(artworkDto.getPrice());
        artwork.setImageUrl(artworkDto.getImageUrl());
        artwork.setCreatedAt(LocalDateTime.now());
        artwork.setArtist(artist.get());

        return artworkRepository.save(artwork);
    }

    public List<Artwork> findAll() {
        return artworkRepository.findAll();
    }

    public Optional<Artwork> findById(Long id) {
        return artworkRepository.findById(id);
    }

    public List<Artwork> findByArtistId(Long artistId) {
        return artworkRepository.findByArtistId(artistId);
    }

    public List<Artwork> searchByTitle(String title) {
        return artworkRepository.findByTitleContainingIgnoreCase(title);
    }

    public List<Artwork> findByPriceRange(Double minPrice, Double maxPrice) {
        return artworkRepository.findByPriceBetween(minPrice, maxPrice);
    }

    public Artwork updateArtwork(Long id, ArtworkDto artworkDto) {

        Optional<Artwork> existingArtwork = artworkRepository.findById(id);
        if (existingArtwork.isEmpty()) {
            throw new RuntimeException("Artwork not found");
        }

        Artwork artwork = existingArtwork.get();
        artwork.setTitle(artworkDto.getTitle());
        artwork.setDescription(artworkDto.getDescription());
        artwork.setPrice(artworkDto.getPrice());
        artwork.setImageUrl(artworkDto.getImageUrl());

        return artworkRepository.save(artwork);
    }

    public void deleteArtwork(Long id) {
        artworkRepository.deleteById(id);
    }
}
