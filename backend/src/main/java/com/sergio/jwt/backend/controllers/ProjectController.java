package com.sergio.jwt.backend.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.sergio.jwt.backend.dtos.CommentRequest;
import com.sergio.jwt.backend.entites.Comment;
import com.sergio.jwt.backend.entites.Project;
import com.sergio.jwt.backend.entites.ProjectVersion;
import com.sergio.jwt.backend.services.CommentService;
import com.sergio.jwt.backend.services.ProjectService;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    @Autowired
    private ProjectService projectService;

    @Autowired
    private CommentService commentService;

    @PostMapping(consumes = {"multipart/form-data"})
    public ResponseEntity<Project> createProject(
            @RequestParam("name") String name,
            @RequestParam("description") String description,
            @RequestParam("file") MultipartFile file,
            @RequestParam("login") String login) {

        Project savedProject = projectService.createProject(name, description, file, login);
        return ResponseEntity.ok(savedProject);
    }

    @GetMapping("/user/{login}")
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

    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects() {
        List<Project> projects = projectService.getAllProjects();
        return ResponseEntity.ok(projects);
    }
    
    @PostMapping("/{projectId}/upload")
    public ResponseEntity<ProjectVersion> uploadProjectVersion(
            @PathVariable Long projectId,
            @RequestParam("file") MultipartFile file) {

        ProjectVersion newVersion = projectService.addProjectVersion(projectId, file);
        return ResponseEntity.ok(newVersion);
    }

    @PostMapping("/{projectId}/delete")
    public ResponseEntity<?> deleteProject(
            @PathVariable Long projectId,
            @RequestParam String login) {
        try {
            projectService.deleteProject(projectId, login);
            return ResponseEntity.ok().body("Project deleted successfully");
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/{projectId}/comments")
    public ResponseEntity<List<Comment>> getProjectComments(@PathVariable Long projectId) {
        return ResponseEntity.ok(commentService.getCommentsByProject(projectId));
    }

    @PostMapping("/{projectId}/comments")
    public ResponseEntity<Comment> addComment(
            @PathVariable Long projectId,
            @RequestBody CommentRequest request) {
        Comment comment = commentService.addComment(projectId, request.getContent(), request.getUserLogin());
        return ResponseEntity.ok(comment);
    }

    @GetMapping("/{projectId}")
    public ResponseEntity<Project> getProject(@PathVariable Long projectId) {
        try {
            Project project = projectService.getProjectById(projectId);
            return ResponseEntity.ok(project);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    

}
