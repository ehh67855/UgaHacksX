import React from 'react';
import { Card, Button, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const projects = [
    {
        id: 1,
        postedBy: 'User1',
        name: 'Project One',
        description: 'This is a short description of Project One.',
        datePosted: '2025-02-01'
    },
    {
        id: 2,
        postedBy: 'User2',
        name: 'Project Two',
        description: 'This is a short description of Project Two.',
        datePosted: '2025-02-02'
    },
    {
        id: 3,
        postedBy: 'User3',
        name: 'Project Three',
        description: 'This is a short description of Project Three.',
        datePosted: '2025-02-03'
    },
    {
        id: 4,
        postedBy: 'User4',
        name: 'Project Four',
        description: 'This is a short description of Project Four.',
        datePosted: '2025-02-04'
    },
    {
        id: 5,
        postedBy: 'User5',
        name: 'Project Five',
        description: 'This is a short description of Project Five.',
        datePosted: '2025-02-05'
    }
];

export default function Home() {
    return (
        <Container className="mt-5 mb-5">
            <h1 className="text-center">Projects</h1>
            <Row>
                {projects.map(project => (
                    <Col key={project.id} md={12} className="mb-4">
                        <Card>
                            <Card.Body>
                                <Card.Title>{project.name}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted">
                                    Posted by {project.postedBy} on {project.datePosted}
                                </Card.Subtitle>
                                <Card.Text>{project.description}</Card.Text>
                                <Button variant="primary" href={`/project/${project.id}`}>View More</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}