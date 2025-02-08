package com.sergio.jwt.backend.controllers;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.multipart.MultipartFile;
import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.Optional;

import com.sergio.jwt.backend.entites.Project;
import com.sergio.jwt.backend.entites.ProjectVersion;
import com.sergio.jwt.backend.repositories.ProjectRepository;
import com.sergio.jwt.backend.services.ProjectService;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<Project> createProject(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("file") MultipartFile file,
            @RequestParam("login") String login) {

        Project savedProject = projectService.createProject(name, description, file, login);
        return ResponseEntity.ok(savedProject);
    }

    @GetMapping("/{login}")
    public ResponseEntity<List<Project>> getUserProjects(@PathVariable String login) {
        List<Project> projects = projectService.getProjectsByUserLogin(login);
        return ResponseEntity.ok(projects);
    }

    @GetMapping("/{projectId}/versions")
    public ResponseEntity<List<ProjectVersion>> getProjectVersions(@PathVariable Long projectId) {
        List<ProjectVersion> versions = projectService.getVersionsByProjectId(projectId);
        return ResponseEntity.ok(versions);
    }

    @GetMapping("/download/{versionId}")
    public ResponseEntity<byte[]> downloadVersion(@PathVariable Long versionId) {
        ProjectVersion version = projectService.getVersionById(versionId);
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + version.getName() + ".zip\"")
                .body(version.getBlobData());
}

    

}
