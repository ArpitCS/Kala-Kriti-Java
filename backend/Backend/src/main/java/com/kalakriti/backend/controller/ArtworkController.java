package com.kalakriti.backend.controller;

import com.kalakriti.backend.dto.ArtworkDto;
import com.kalakriti.backend.entity.Artwork;
import com.kalakriti.backend.service.ArtworkService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/artworks")
@CrossOrigin(origins = "*")
public class ArtworkController {
    
    @Autowired
    private ArtworkService artworkService;
    
    @GetMapping
    public ResponseEntity<List<Artwork>> getAllArtworks() {
        List<Artwork> artworks = artworkService.findAll();
        return ResponseEntity.ok(artworks);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Artwork> getArtworkById(@PathVariable Long id) {
        Optional<Artwork> artwork = artworkService.findById(id);
        return artwork.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/artist/{artistId}")
    public ResponseEntity<List<Artwork>> getArtworksByArtist(@PathVariable Long artistId) {
        List<Artwork> artworks = artworkService.findByArtistId(artistId);
        return ResponseEntity.ok(artworks);
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Artwork>> searchArtworks(@RequestParam String title) {
        List<Artwork> artworks = artworkService.searchByTitle(title);
        return ResponseEntity.ok(artworks);
    }
    
    @GetMapping("/price-range")
    public ResponseEntity<List<Artwork>> getArtworksByPriceRange(
            @RequestParam Double minPrice, 
            @RequestParam Double maxPrice) {
        List<Artwork> artworks = artworkService.findByPriceRange(minPrice, maxPrice);
        return ResponseEntity.ok(artworks);
    }
    
    @PostMapping("/artist/{artistId}")
    public ResponseEntity<?> createArtwork(@PathVariable Long artistId, @RequestBody ArtworkDto artworkDto) {
        try {
            Artwork artwork = artworkService.createArtwork(artworkDto, artistId);
            return ResponseEntity.ok(artwork);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateArtwork(@PathVariable Long id, @RequestBody ArtworkDto artworkDto) {
        try {
            Artwork artwork = artworkService.updateArtwork(id, artworkDto);
            return ResponseEntity.ok(artwork);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteArtwork(@PathVariable Long id) {
        try {
            artworkService.deleteArtwork(id);
            return ResponseEntity.ok("Artwork deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
