package com.sergio.jwt.backend.services;

import com.sergio.jwt.backend.entites.Comment;
import com.sergio.jwt.backend.entites.Project;
import com.sergio.jwt.backend.entites.User;
import com.sergio.jwt.backend.repositories.CommentRepository;
import com.sergio.jwt.backend.repositories.ProjectRepository;
import com.sergio.jwt.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private UserRepository userRepository;

    public List<Comment> getCommentsByProject(Long projectId) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new RuntimeException("Project not found"));
        return commentRepository.findByProjectOrderByCreatedAtDesc(project);
    }

    public Comment addComment(Long projectId, String content, String userLogin) {
        Project project = projectRepository.findById(projectId)
            .orElseThrow(() -> new RuntimeException("Project not found"));
        
        User user = userRepository.findByLogin(userLogin)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Comment comment = Comment.builder()
            .content(content)
            .project(project)
            .author(user)
            .build();

        return commentRepository.save(comment);
    }
}