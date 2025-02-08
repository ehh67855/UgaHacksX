import React from 'react';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function MyProjects() {
    const navigate = useNavigate();

    // TODO: Replace this with actual API call to get user's projects
    const myProjects = [
        {
            id: 1,
            name: 'My Project One',
            description: 'This is my first project',
            datePosted: '2025-02-01'
        },
        // Add more projects as needed
    ];

    return (
        <Container className="mt-5 mb-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>My Projects</h1>
                <Button 
                    variant="success" 
                    onClick={() => navigate('/NewProject')}
                >
                    Add Project
                </Button>
            </div>
            
            <Row>
                {myProjects.map(project => (
                    <Col key={project.id} md={12} className="mb-4">
                        <Card>
                            <Card.Body>
                                <Card.Title>{project.name}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">
                                    Posted on {project.datePosted}
                                </Card.Subtitle>
                                <Card.Text>{project.description}</Card.Text>
                                <Button 
                                    variant="primary" 
                                    href={`/project/${project.id}`}
                                    className="me-2"
                                >
                                    View More
                                </Button>
                                <Button 
                                    variant="outline-danger"
                                    onClick={() => {
                                        // TODO: Implement delete functionality
                                        if(window.confirm('Are you sure you want to delete this project?')) {
                                            console.log('Delete project:', project.id);
                                        }
                                    }}
                                >
                                    Delete
                                </Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}