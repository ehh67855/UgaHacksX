package com.sergio.jwt.backend.repositories;

import com.sergio.jwt.backend.entites.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    List<Comment> findByProjectVersionId(Long projectVersionId);

    List<Comment> findByAuthorId(Long authorId);
}
