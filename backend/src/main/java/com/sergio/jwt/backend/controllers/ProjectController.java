package com.sergio.jwt.backend.controllers;

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
import java.util.Optional;

import com.sergio.jwt.backend.entites.Project;
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
            @RequestParam("login") String login) { // 'login' is passed, assuming it represents user identification

        // Log the user login received
        System.out.println("Received login: " + login);

        // Create and save the project using the service
        Project savedProject = projectService.createProject(name, description, file, login);

        System.out.println("Project created: " + savedProject.getName());
        
        return ResponseEntity.ok(savedProject);
    }
}