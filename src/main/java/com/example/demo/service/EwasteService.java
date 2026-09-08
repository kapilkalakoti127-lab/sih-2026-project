package com.example.demo.service;

import com.example.demo.entity.Ewaste;
import com.example.demo.repository.EwasteRepository;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class EwasteService {

    private final EwasteRepository repository;

    public EwasteService(EwasteRepository repository) {
        this.repository = repository;
    }

    // CREATE
    public Ewaste addEwaste(Ewaste ewaste) {

        if (ewaste.getStatus() == null || ewaste.getStatus().isBlank()) {
            ewaste.setStatus("Collected");
        }

        ewaste.setVerified(false);

        return repository.save(ewaste);
    }

    // READ ALL
    public List<Ewaste> getAllEwaste() {
        return repository.findAll();
    }

    // READ BY ID
    public Ewaste getEwasteById(Long id) {

        return repository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("E-waste not found with id: " + id));
    }

    // UPDATE
    public Ewaste updateEwaste(Long id, Ewaste ewaste) {

        Ewaste existing = getEwasteById(id);

        existing.setType(ewaste.getType());
        existing.setQuantity(ewaste.getQuantity());
        existing.setCollector(ewaste.getCollector());
        existing.setSource(ewaste.getSource());
        existing.setStatus(ewaste.getStatus());
        existing.setDate(ewaste.getDate());

        return repository.save(existing);
    }

    // VERIFY
    public Ewaste verifyEwaste(Long id) {

        Ewaste ewaste = getEwasteById(id);

        ewaste.setVerified(true);
        ewaste.setStatus("Verified");

        return repository.save(ewaste);
    }

    // DELETE
    public void deleteEwaste(Long id) {

        if (!repository.existsById(id)) {
            throw new RuntimeException(
                    "E-waste not found with id: " + id);
        }

        repository.deleteById(id);
    }

    // TRACK BY TRACKING ID
    public Ewaste trackEwaste(String trackingId) {

        return repository.findByTrackingId(trackingId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "E-waste not found with tracking ID: "
                                        + trackingId));
    }

    // SEARCH BY SOURCE
    public List<Ewaste> searchBySource(String source) {
        return repository.findBySourceContainingIgnoreCase(source);
    }

    // SEARCH BY TYPE
    public List<Ewaste> searchByType(String type) {
        return repository.findByTypeContainingIgnoreCase(type);
    }

    // SEARCH BY STATUS
    public List<Ewaste> searchByStatus(String status) {
        return repository.findByStatusContainingIgnoreCase(status);
    }

    // DASHBOARD STATISTICS
    public Map<String, Object> getStatistics() {

        List<Ewaste> all = repository.findAll();

        double totalQuantity = all.stream()
                .mapToDouble(Ewaste::getQuantity)
                .sum();

        long verified = repository.countByVerifiedTrue();

        long collected =
                repository.countByStatusIgnoreCase("Collected");

        long processed =
                repository.countByStatusIgnoreCase("Processed");

        long recycled =
                repository.countByStatusIgnoreCase("Recycled");

        Map<String, Object> stats = new HashMap<>();

        stats.put("totalRecords", all.size());
        stats.put("totalQuantity", totalQuantity);
        stats.put("verifiedRecords", verified);
        stats.put("collectedRecords", collected);
        stats.put("processedRecords", processed);
        stats.put("recycledRecords", recycled);

        return stats;
    }
}