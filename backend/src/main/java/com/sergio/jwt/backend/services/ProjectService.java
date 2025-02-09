package com.sergio.jwt.backend.services;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.Files;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.sergio.jwt.backend.dtos.CommentRequest;
import com.sergio.jwt.backend.entites.Comment;
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
    private ProjectVersionRepository projectVersionRepository; // Fix: Changed type from ProjectRepository

    @Autowired
    private UserRepository userRepository;

    public Project createProject(String name, String description, MultipartFile file, String login) {
        User user = userRepository.findByLogin(login)
                .orElseThrow(() -> new RuntimeException("User not found with login: " + login));
    
        Project project = new Project();
        project.setName(name);
        project.setDescription(description);
        project.setOwner(user);
    
        ProjectVersion projectVersion = new ProjectVersion();
        projectVersion.setName(file.getOriginalFilename());
        try {
            projectVersion.setBlobData(file.getBytes());
        } catch (IOException e) {
            throw new RuntimeException("File processing failed", e);
        }
    
        projectVersion.setProject(project);
        project.getProjectVersions().add(projectVersion);
        
        return projectRepository.save(project);
    }


    public List<Project> getProjectsByUserLogin(String login) {
        List<Project> projects = projectRepository.findByOwnerLogin(login);
        // Ensure each project is properly loaded
        return projects.stream()
            .map(project -> {
                Project fullProject = new Project();
                fullProject.setId(project.getId());
                fullProject.setName(project.getName());
                fullProject.setDescription(project.getDescription());
                fullProject.setOwner(project.getOwner());
                fullProject.setProjectVersions(project.getProjectVersions());
                fullProject.setComments(project.getComments());
                return fullProject;
            })
            .collect(Collectors.toList());
    }

    public List<ProjectVersion> getVersionsByProjectId(Long projectId) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));
        return projectVersionRepository.findByProjectOrderByIdDesc(project);
    }

    public ProjectVersion getVersionById(Long versionId) {
        return projectVersionRepository.findById(versionId)
            .orElseThrow(() -> new RuntimeException("Version not found with id: " + versionId));
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public ProjectVersion addProjectVersion(Long projectId, MultipartFile file) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));
    
        ProjectVersion projectVersion = new ProjectVersion();
        projectVersion.setProject(project);
        projectVersion.setName(file.getOriginalFilename());
    
        try {
            projectVersion.setBlobData(file.getBytes());
        } catch (IOException e) {
            throw new RuntimeException("Failed to process file", e);
        }
    
        return projectVersionRepository.save(projectVersion);
    }

    public void deleteProject(Long projectId, String login) {
        // Find the project
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));
        
        // Verify ownership
        if (!project.getOwner().getLogin().equals(login)) {
            throw new RuntimeException("User is not authorized to delete this project");
        }
        
        try {
            // Delete associated versions first
            List<ProjectVersion> versions = projectVersionRepository.findByProjectOrderByIdDesc(project);
            projectVersionRepository.deleteAll(versions);
            
            // Delete the project
            projectRepository.delete(project);
        } catch (Exception e) {
            throw new RuntimeException("Failed to delete project: " + e.getMessage());
        }
    }
    
    public Project getProjectById(Long projectId) {
        return projectRepository.findById(projectId)
            .orElseThrow(() -> new RuntimeException("Project not found with id: " + projectId));
    }
    

}
