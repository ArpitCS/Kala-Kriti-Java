package com.kalakriti.backend.service.implementation;

import com.kalakriti.backend.dto.ArtistProfileDto;
import com.kalakriti.backend.entity.ArtistProfile;
import com.kalakriti.backend.entity.User;
import com.kalakriti.backend.repository.ArtistRepository;
import com.kalakriti.backend.repository.UserRepository;
import com.kalakriti.backend.service.ArtistService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ArtistServiceImpl implements ArtistService {
    private final ArtistRepository artistRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @Override
    public ArtistProfile createArtistProfile(ArtistProfileDto artistProfileDto, Long userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isEmpty() || user.get().getUserType() != User.UserType.ARTIST) {
            throw new RuntimeException("User not found or not an artist");
        }
        ArtistProfile artistProfile = modelMapper.map(artistProfileDto, ArtistProfile.class);
        artistProfile.setUser(user.get());
        return artistRepository.save(artistProfile);
    }

    @Override
    public Optional<ArtistProfile> findByUserId(Long userId) {
        return artistRepository.findByUserId(userId);
    }

    @Override
    public Optional<ArtistProfile> findById(Long id) {
        return artistRepository.findById(id);
    }

    @Override
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

