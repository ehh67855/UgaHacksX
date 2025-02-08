package com.sergio.jwt.backend.entites;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;
import java.util.ArrayList;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Builder
@Data
@Entity
@Table(name = "project_version")
public class ProjectVersion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 255)
    private String name;

    @Lob
    @Column(nullable = false)
    private byte[] blobData;

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    // @OneToMany(mappedBy = "projectVersion", cascade = CascadeType.ALL, orphanRemoval = true)
    // private List<Comment> comments = new ArrayList<>();
}