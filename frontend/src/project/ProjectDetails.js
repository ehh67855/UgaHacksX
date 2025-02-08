import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card, ListGroup, Button, Row, Col, Spinner, Alert, Form } from 'react-bootstrap';
import { getAuthToken, getLogin } from '../services/BackendService';

export default function ProjectDetails() {
    const { id } = useParams();
    const [project, setProject] = useState(null);
    const [versions, setVersions] = useState([]);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const isLoggedIn = !!getAuthToken();
    const currentUser = getLogin(getAuthToken());

    useEffect(() => {
        fetchProjectDetails();
        fetchComments();
    }, [id]);

    const fetchProjectDetails = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/projects/${id}`, {
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`,
                    'Content-Type': 'application/json'
                }
            });            
        
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            console.log('Project data received:', data);
            
            if (!data) {
                throw new Error('No project data received');
            }
    
            setProject(data);
            
            if (Array.isArray(data.projectVersions)) {
                const sortedVersions = data.projectVersions.sort((a, b) => 
                    new Date(b.uploadDate) - new Date(a.uploadDate)
                );
                setVersions(sortedVersions);
            } else {
                setVersions([]);
            }
        } catch (error) {
            console.error('Error in fetchProjectDetails:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };
    
    const fetchComments = async () => {
        try {
            const response = await fetch(`http://localhost:8080/api/projects/${id}/comments`, {
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                const sortedComments = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                setComments(sortedComments);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const handleDownload = async (versionId, fileName) => {
        try {
            const response = await fetch(`http://localhost:8080/api/projects/download/${versionId}`, {
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`
                }
            });
    
            if (!response.ok) {
                throw new Error('Download failed');
            }
    
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${fileName}.zip`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed", error);
            alert("Failed to download file.");
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const response = await fetch(`http://localhost:8080/api/projects/${id}/comments`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    content: newComment,
                    userLogin: currentUser
                })
            });

            if (response.ok) {
                const newCommentData = await response.json();
                setComments([newCommentData, ...comments]);
                setNewComment('');
            }
        } catch (error) {
            console.error('Error posting comment:', error);
        }
    };

    if (loading) return <Container className="mt-5 text-center"><Spinner animation="border" /></Container>;
    if (error) return <Container className="mt-5"><Alert variant="danger">{error}</Alert></Container>;
    if (!project) return <Container className="mt-5"><Alert variant="warning">Project not found</Alert></Container>;

    return (
        <Container className="my-5">
            {/* Project Details Card */}
            <Card className="mb-4">
                <Card.Body>
                    <Card.Title as="h2">{project.name}</Card.Title>
                    <Card.Subtitle className="mb-3 text-muted">
                        Posted by {project.name}
                    </Card.Subtitle>
                    <Card.Text>{project.description}</Card.Text>
                </Card.Body>
            </Card>

            {/* Version History Card */}
            <Card className="mb-4">
                <Card.Header as="h3">Version History</Card.Header>
                <ListGroup variant="flush">
                    {versions.length > 0 ? (
                        versions.map(version => (
                            <ListGroup.Item key={version.id}>
                                <Row className="align-items-center">
                                    <Col md={8}>
                                        <h5>{version.name}</h5>
                                        <p className="text-muted mb-0">
                                            Uploaded on {new Date(version.uploadDate).toLocaleString()}
                                        </p>
                                    </Col>
                                    <Col md={4} className="text-md-end mt-2 mt-md-0">
                                        <Button 
                                            variant="outline-primary" 
                                            size="sm"
                                            onClick={() => handleDownload(version.id, version.name)}
                                        >
                                            Download
                                        </Button>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ))
                    ) : (
                        <ListGroup.Item className="text-center text-muted">
                            No versions available
                        </ListGroup.Item>
                    )}
                </ListGroup>
            </Card>

            {/* Comments Section */}
            <Card>
                <Card.Header as="h3">Comments</Card.Header>
                <Card.Body>
                    {isLoggedIn ? (
                        <Form onSubmit={handleCommentSubmit} className="mb-4">
                            <Form.Group>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Write your comment here..."
                                />
                            </Form.Group>
                            <Button type="submit" className="mt-2">
                                Post Comment
                            </Button>
                        </Form>
                    ) : (
                        <Alert variant="info">
                            Please log in to leave a comment.
                        </Alert>
                    )}

                    <div className="mt-4">
                        {comments.length > 0 ? (
                            comments.map(comment => (
                                <Card key={comment.id} className="mb-3">
                                    <Card.Body>
                                        <Card.Text>{comment.content}</Card.Text>
                                        <div className="d-flex justify-content-between">
                                            <small className="text-muted">
                                                {new Date(comment.createdAt).toLocaleString()}
                                            </small>
                                        </div>
                                    </Card.Body>
                                </Card>
                            ))
                        ) : (
                            <p className="text-center text-muted">
                                No comments yet. Be the first to provide feedback on this project!
                            </p>
                        )}
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
}