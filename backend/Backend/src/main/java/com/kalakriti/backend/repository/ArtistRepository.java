package com.kalakriti.backend.repository;

import com.kalakriti.backend.entity.ArtistProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ArtistRepository extends JpaRepository<ArtistProfile, Long> {
    Optional<ArtistProfile> findByUserId(Long userId);
    Optional<ArtistProfile> findByUserUsername(String username);
}
