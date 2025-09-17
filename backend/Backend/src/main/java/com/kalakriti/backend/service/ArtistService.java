package com.kalakriti.backend.service;

import com.kalakriti.backend.dto.ArtistProfileDto;
import com.kalakriti.backend.entity.ArtistProfile;
import java.util.Optional;

public interface ArtistService {
    ArtistProfile createArtistProfile(ArtistProfileDto artistProfileDto, Long userId);
    Optional<ArtistProfile> findByUserId(Long userId);
    Optional<ArtistProfile> findById(Long id);
    ArtistProfile updateArtistProfile(Long id, ArtistProfileDto artistProfileDto);
}
