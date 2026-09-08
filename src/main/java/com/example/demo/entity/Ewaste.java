package com.example.demo.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Positive;

import java.util.UUID;

@Entity
public class Ewaste {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "E-waste type is required")
    private String type;

    @Positive(message = "Quantity must be greater than 0")
    private double quantity;

    @NotBlank(message = "Collector is required")
    private String collector;

    @NotBlank(message = "Source is required")
    private String source;

    private String status;

    private String date;

    private boolean verified;

    @Column(unique = true, nullable = false)
    private String trackingId;

    @PrePersist
    public void generateTrackingId() {
        if (trackingId == null || trackingId.isEmpty()) {
            trackingId = "EW-" +
                    UUID.randomUUID()
                            .toString()
                            .substring(0, 8)
                            .toUpperCase();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public double getQuantity() {
        return quantity;
    }

    public void setQuantity(double quantity) {
        this.quantity = quantity;
    }

    public String getCollector() {
        return collector;
    }

    public void setCollector(String collector) {
        this.collector = collector;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public boolean isVerified() {
        return verified;
    }

    public void setVerified(boolean verified) {
        this.verified = verified;
    }

    public String getTrackingId() {
        return trackingId;
    }

    public void setTrackingId(String trackingId) {
        this.trackingId = trackingId;
    }
}