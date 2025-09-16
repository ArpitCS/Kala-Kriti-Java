package com.kalakriti.backend.controller;

import com.kalakriti.backend.dto.ArtistProfileDto;
import com.kalakriti.backend.entity.ArtistProfile;
import com.kalakriti.backend.service.ArtistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Optional;

@RestController
@RequestMapping("/api/artists")
@CrossOrigin(origins = "*")
public class ArtistController {
    
    @Autowired
    private ArtistService artistService;
    
    @PostMapping("/profile/{userId}")
    public ResponseEntity<?> createArtistProfile(@PathVariable Long userId, 
                                                 @RequestBody ArtistProfileDto artistProfileDto) {
        try {
            ArtistProfile artistProfile = artistService.createArtistProfile(artistProfileDto, userId);
            return ResponseEntity.ok(artistProfile);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    
    @GetMapping("/profile/{id}")
    public ResponseEntity<ArtistProfile> getArtistProfile(@PathVariable Long id) {
        Optional<ArtistProfile> artistProfile = artistService.findById(id);
        return artistProfile.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/profile/user/{userId}")
    public ResponseEntity<ArtistProfile> getArtistProfileByUserId(@PathVariable Long userId) {
        Optional<ArtistProfile> artistProfile = artistService.findByUserId(userId);
        return artistProfile.map(ResponseEntity::ok).orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/profile/{id}")
    public ResponseEntity<?> updateArtistProfile(@PathVariable Long id, 
                                                 @RequestBody ArtistProfileDto artistProfileDto) {
        try {
            ArtistProfile artistProfile = artistService.updateArtistProfile(id, artistProfileDto);
            return ResponseEntity.ok(artistProfile);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
