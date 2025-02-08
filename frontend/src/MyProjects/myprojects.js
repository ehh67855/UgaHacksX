import React, { useEffect, useState } from 'react';
import { Card, Button, Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { getAuthToken, getLogin } from 'src/services/BackendService';

export default function MyProjects() {
    const navigate = useNavigate();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    const userLogin = getLogin(getAuthToken()); // Replace with actual user login (from auth context/session)

    useEffect(() => {
        fetch(`http://localhost:8080/api/projects/${userLogin}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error("Failed to load projects.");
                }
                return response.json();
            })
            .then(data => {
                setProjects(data);
                setLoading(false);
            })
            .catch(error => {
                setError(error.message);
                setLoading(false);
            });
    }, []);
    

    return (
        <Container className="mt-5 mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>My Projects</h1>
                <Button variant="success" onClick={() => navigate('/NewProject')}>
                    Add Project
                </Button>
            </div>

            {loading && <Spinner animation="border" />}
            {error && <Alert variant="danger">{error}</Alert>}

            <Row>
                {projects.length > 0 ? projects.map((project, index) => (
                    <Col key={project.id || index} md={12} className="mb-4">
                        <Card>
                            <Card.Body>
                                <Card.Title>{project.name}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">
                                    Posted on {project.datePosted}
                                </Card.Subtitle>
                                <Card.Text>{project.description}</Card.Text>
                                <Button variant="primary" href={`/project/${project.id}`} className="me-2">
                                    View More
                                </Button>
                                <Button 
                                    variant="outline-danger" 
                                    onClick={async () => {
                                        if (window.confirm('Are you sure you want to delete this project?')) {
                                            try {
                                                const response = await fetch(
                                                    `http://localhost:8080/api/projects/${project.id}/delete?login=${userLogin}`,
                                                    {
                                                        method: 'POST',
                                                        headers: {
                                                            'Authorization': `Bearer ${getAuthToken()}`
                                                        }
                                                    }
                                                );
                                                
                                                if (!response.ok) {
                                                    throw new Error('Failed to delete project');
                                                }
                                                
                                                setProjects(currentProjects => 
                                                    currentProjects.filter(p => p.id !== project.id)
                                                );
                                            } catch (error) {
                                                setError(error.message);
                                            }
                                        }
                                    }}
                                >
                                    Delete
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                )) : <p>No projects found.</p>}
            </Row>
        </Container>
    );
}
