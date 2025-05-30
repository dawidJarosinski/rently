package com.rently.rentlybackend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Data
@Table(name = "addresses")
@NoArgsConstructor
@AllArgsConstructor
public class Address {
    @Id
    @Column(name = "property_id", nullable = false)
    private UUID id;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "property_id", nullable = false)
    @MapsId
    private Property property;

    @Column(name = "country", nullable = false)
    private String country;

    @Column(name = "city", nullable = false)
    private String city;

    @Column(name = "street", nullable = false)
    private String street;

    @Column(name = "house_number", nullable = false)
    private String houseNumber;

    @Column(name = "local_number")
    private String localNumber;

    @Column(name = "postal_code", nullable = false)
    private String postalCode;

    public Address(String country, String city, String street, String houseNumber, String localNumber, String postalCode) {
        this.country = country;
        this.city = city;
        this.street = street;
        this.houseNumber = houseNumber;
        this.localNumber = localNumber;
        this.postalCode = postalCode;
    }

    public Address(String city, String country) {
        this.city = city;
        this.country = country;
    }
}
