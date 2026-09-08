package com.example.demo.repository;

import com.example.demo.entity.Ewaste;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface EwasteRepository extends JpaRepository<Ewaste, Long> {

    Optional<Ewaste> findByTrackingId(String trackingId);

    List<Ewaste> findBySourceContainingIgnoreCase(String source);

    List<Ewaste> findByTypeContainingIgnoreCase(String type);

    List<Ewaste> findByStatusContainingIgnoreCase(String status);

    long countByVerifiedTrue();

    long countByStatusIgnoreCase(String status);
}