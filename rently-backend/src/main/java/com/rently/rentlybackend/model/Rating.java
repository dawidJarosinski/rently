package com.rently.rentlybackend.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "ratings")
public class Rating {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    private UUID id;

    @Column(name = "rate", nullable = false)
    private Integer rate;

    @Column(name = "comment", nullable = false)
    private String comment;

    @JoinColumn(name = "property_id")
    @ManyToOne
    private Property property;

    @JoinColumn(name = "user_id")
    @ManyToOne
    private User user;

    public Rating(Integer rate, String comment, Property property, User user) {
        this.rate = rate;
        this.comment = comment;
        this.property = property;
        this.user = user;
    }
}
