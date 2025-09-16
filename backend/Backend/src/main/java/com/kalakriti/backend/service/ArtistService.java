package com.kalakriti.backend.service;

import com.kalakriti.backend.dto.ArtistProfileDto;
import com.kalakriti.backend.entity.ArtistProfile;
import com.kalakriti.backend.entity.User;
import com.kalakriti.backend.repository.ArtistRepository;
import com.kalakriti.backend.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class ArtistService {

    @Autowired
    private ArtistRepository artistRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ModelMapper modelMapper;

    public ArtistProfile createArtistProfile(ArtistProfileDto artistProfileDto, Long userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isEmpty() || user.get().getUserType() != User.UserType.ARTIST) {
            throw new RuntimeException("User not found or not an artist");
        }

        ArtistProfile artistProfile = modelMapper.map(artistProfileDto, ArtistProfile.class);
        artistProfile.setUser(user.get());

        return artistRepository.save(artistProfile);
    }

    public Optional<ArtistProfile> findByUserId(Long userId) {
        return artistRepository.findByUserId(userId);
    }

    public Optional<ArtistProfile> findById(Long id) {
        return artistRepository.findById(id);
    }

    public ArtistProfile updateArtistProfile(Long id, ArtistProfileDto artistProfileDto) {
        Optional<ArtistProfile> existingProfile = artistRepository.findById(id);
        if (existingProfile.isEmpty()) {
            throw new RuntimeException("Artist profile not found");
        }

        ArtistProfile artistProfile = existingProfile.get();
        modelMapper.map(artistProfileDto, artistProfile);

        return artistRepository.save(artistProfile);
    }
}
