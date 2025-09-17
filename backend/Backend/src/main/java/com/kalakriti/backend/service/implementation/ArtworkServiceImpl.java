package com.kalakriti.backend.service.implementation;

import com.kalakriti.backend.dto.ArtworkDto;
import com.kalakriti.backend.entity.Artwork;
import com.kalakriti.backend.entity.ArtistProfile;
import com.kalakriti.backend.repository.ArtworkRepository;
import com.kalakriti.backend.repository.ArtistRepository;
import com.kalakriti.backend.service.ArtworkService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ArtworkServiceImpl implements ArtworkService {
    private final ArtworkRepository artworkRepository;
    private final ArtistRepository artistRepository;
    private final ModelMapper modelMapper;

    @Override
    public Artwork createArtwork(ArtworkDto artworkDto, Long artistId) {
        Optional<ArtistProfile> artist = artistRepository.findById(artistId);
        if (artist.isEmpty()) {
            throw new RuntimeException("Artist not found");
        }
        Artwork artwork = modelMapper.map(artworkDto, Artwork.class);
        artwork.setCreatedAt(LocalDateTime.now());
        artwork.setArtist(artist.get());
        return artworkRepository.save(artwork);
    }

    @Override
    public List<Artwork> findAll() {
        return artworkRepository.findAll();
    }

    @Override
    public Optional<Artwork> findById(Long id) {
        return artworkRepository.findById(id);
    }

    @Override
    public List<Artwork> findByArtistId(Long artistId) {
        return artworkRepository.findByArtistId(artistId);
    }

    @Override
    public List<Artwork> searchByTitle(String title) {
        return artworkRepository.findByTitleContainingIgnoreCase(title);
    }

    @Override
    public List<Artwork> findByPriceRange(Double minPrice, Double maxPrice) {
        return artworkRepository.findByPriceBetween(minPrice, maxPrice);
    }

    @Override
    public Artwork updateArtwork(Long id, ArtworkDto artworkDto) {
        Optional<Artwork> existingArtwork = artworkRepository.findById(id);
        if (existingArtwork.isEmpty()) {
            throw new RuntimeException("Artwork not found");
        }
        Artwork artwork = existingArtwork.get();
        modelMapper.map(artworkDto, artwork);
        return artworkRepository.save(artwork);
    }

    @Override
    public void deleteArtwork(Long id) {
        artworkRepository.deleteById(id);
    }
}

