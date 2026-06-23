package com.example.backend.domain.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Entity
@Table(name = "global_images")
@Getter
@Setter
@ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GlobalImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Image name is required")
    @Column(nullable = false)
    private String name;

    @NotBlank(message = "Image URL is required")
    @Column(nullable = false)
    private String imageUrl;

    private String category;
}
