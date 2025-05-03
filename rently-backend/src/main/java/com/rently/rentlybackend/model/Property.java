package com.rently.rentlybackend.model;


import com.rently.rentlybackend.enums.PropertyType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "properties")
public class Property {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false)
    private UUID id;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description", nullable = false)
    private String description;

    @Column(name = "max_number_of_guests", nullable = false)
    private Integer maxNumberOfGuests;

    @Column(name = "price_per_night", nullable = false)
    private BigDecimal pricePerNight;

    @Column(name = "type", nullable = false)
    @Enumerated(EnumType.STRING)
    private PropertyType propertyType;

    @Column(name = "approved", nullable = false)
    private boolean approved;

    @JoinColumn(name = "user_id", nullable = false)
    @ManyToOne
    private User user;

    @OneToOne(mappedBy = "property", cascade = CascadeType.ALL)
    @PrimaryKeyJoinColumn
    private Address address;

    @OneToMany(mappedBy = "property")
    private List<Rating> ratings;


    public Property(String name, String description, Integer maxNumberOfGuests, BigDecimal pricePerNight, PropertyType propertyType) {
        this.name = name;
        this.description = description;
        this.maxNumberOfGuests = maxNumberOfGuests;
        this.pricePerNight = pricePerNight;
        this.propertyType = propertyType;
    }
}
