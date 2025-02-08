import React, { useState, useEffect } from 'react';
import { Card, Button, Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getAuthToken } from '../services/BackendService';
import { Link } from 'react-router-dom';

export default function Home() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/projects', {
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setProjects(data);
            } else {
                setError('Failed to fetch projects');
            }
        } catch (error) {
            setError('Error loading projects');
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="mt-5 mb-5">
            <h1 className="text-center">Feed</h1>
            {loading && <div className="text-center"><Spinner animation="border" /></div>}
            {error && <Alert variant="danger">{error}</Alert>}
            <Row>
                {projects.map(project => (
                    <Col key={project.id} md={12} className="mb-4">
                        <Card>
                            <Card.Body>
                                <Card.Title>{project.name}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">
                                    Posted by {project.login} on {new Date(project.datePosted).toLocaleDateString()}
                                </Card.Subtitle>
                                <Card.Text>{project.description}</Card.Text>
                                <Button 
                                    as={Link} 
                                    to={`/project/${project.id}`} 
                                    variant="primary"
                                >
                                    View More
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}