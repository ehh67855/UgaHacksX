package com.sergio.jwt.backend.services;

import java.io.File;
import java.io.IOException;
import java.util.Optional;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.Files;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.sergio.jwt.backend.entites.Project;
import com.sergio.jwt.backend.entites.ProjectVersion;
import com.sergio.jwt.backend.entites.User;
import com.sergio.jwt.backend.repositories.ProjectRepository;
import com.sergio.jwt.backend.repositories.ProjectVersionRepository;
import com.sergio.jwt.backend.repositories.UserRepository;

@Service
public class ProjectService {

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    public Project createProject(String name, String description, MultipartFile file, String login) {
        // Retrieve the user from the database
        User user = userRepository.findByLogin(login)
                .orElseThrow(() -> new RuntimeException("User not found with login: " + login));
    
        // Create a new project
        Project project = new Project();
        project.setName(name);
        project.setDescription(description);
        project.setOwner(user);
    
        // Create the initial project version
        ProjectVersion projectVersion = new ProjectVersion();
        projectVersion.setName(file.getOriginalFilename()); // Use file name
        try {
            projectVersion.setBlobData(file.getBytes()); // Store file as binary data
        } catch (IOException e) {
            throw new RuntimeException("File processing failed", e);
        }
    
        projectVersion.setProject(project);
    
        // Add the version to the project's list
        project.getProjectVersions().add(projectVersion);
    
        // Save the project (cascades will save ProjectVersion)
        return projectRepository.save(project);
    }
    
}

