package com.sergio.jwt.backend.repositories;

import com.sergio.jwt.backend.entites.Project;
import com.sergio.jwt.backend.entites.ProjectVersion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProjectVersionRepository extends JpaRepository<ProjectVersion, Long> {
    List<ProjectVersion> findByProjectOrderByIdDesc(Project project);
}
