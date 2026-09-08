package com.example.demo.controller;

import com.example.demo.entity.Ewaste;
import com.example.demo.service.EwasteService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ewaste")
public class EwasteController {

    private final EwasteService service;

    public EwasteController(EwasteService service) {
        this.service = service;
    }

    // CREATE
    @PostMapping
    public Ewaste addEwaste(
            @Valid @RequestBody Ewaste ewaste) {

        return service.addEwaste(ewaste);
    }

    // READ ALL
    @GetMapping
    public List<Ewaste> getAllEwaste() {

        return service.getAllEwaste();
    }

    // READ BY ID
    @GetMapping("/{id}")
    public Ewaste getEwasteById(
            @PathVariable Long id) {

        return service.getEwasteById(id);
    }

    // UPDATE
    @PutMapping("/{id}")
    public Ewaste updateEwaste(
            @PathVariable Long id,
            @Valid @RequestBody Ewaste ewaste) {

        return service.updateEwaste(id, ewaste);
    }

    // VERIFY
    @PutMapping("/{id}/verify")
    public Ewaste verifyEwaste(
            @PathVariable Long id) {

        return service.verifyEwaste(id);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteEwaste(
            @PathVariable Long id) {

        service.deleteEwaste(id);

        return ResponseEntity.ok(
                "E-waste deleted successfully");
    }

    // TRACKING
    @GetMapping("/track/{trackingId}")
    public Ewaste trackEwaste(
            @PathVariable String trackingId) {

        return service.trackEwaste(trackingId);
    }

    // SEARCH BY SOURCE
    @GetMapping("/search")
    public List<Ewaste> search(
            @RequestParam(required = false) String source,
            @RequestParam(required = false) String type,
            @RequestParam(required = false) String status) {

        if (source != null) {
            return service.searchBySource(source);
        }

        if (type != null) {
            return service.searchByType(type);
        }

        if (status != null) {
            return service.searchByStatus(status);
        }

        return service.getAllEwaste();
    }

    // DASHBOARD STATISTICS
    @GetMapping("/stats")
    public Map<String, Object> getStatistics() {

        return service.getStatistics();
    }
}