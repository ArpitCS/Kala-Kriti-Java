package com.kalakriti.backend.repository;

import com.kalakriti.backend.entity.Artwork;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ArtworkRepository extends JpaRepository<Artwork, Long> {
    List<Artwork> findByArtistId(Long artistId);
    List<Artwork> findByTitleContainingIgnoreCase(String title);
    List<Artwork> findByPriceBetween(Double minPrice, Double maxPrice);
}
