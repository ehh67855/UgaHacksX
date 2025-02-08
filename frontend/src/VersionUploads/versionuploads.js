import React from 'react';
import { Container, Card, Button, ListGroup, Row, Col } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

// Mock data - Replace with actual API calls
const projectVersions = {
    1: {
        currentVersion: {
            id: 'v1.2',
            name: 'Version 1.2',
            uploadDate: '2025-02-08',
            description: 'Latest version with bug fixes and performance improvements',
            fileUrl: '/downloads/v1.2.zip',
            uploadedBy: 'User1'
        },
        previousVersions: [
            {
                id: 'v1.1',
                name: 'Version 1.1',
                uploadDate: '2025-02-01',
                description: 'Added new features',
                fileUrl: '/downloads/v1.1.zip',
                uploadedBy: 'User1'
            },
            {
                id: 'v1.0',
                name: 'Version 1.0',
                uploadDate: '2025-01-25',
                description: 'Initial release',
                fileUrl: '/downloads/v1.0.zip',
                uploadedBy: 'User1'
            }
        ]
    }
};

export default function VersionUploads() {
    const { id } = useParams();
    const projectData = projectVersions[id];

    if (!projectData) {
        return <div>Project not found</div>;
    }

    return (
        <Container className="my-5 pb-5"> {/* Added pb-5 for bottom padding */}
            <h1 className="text-center mb-5">Version Uploads</h1>
            
            {/* Latest Version Card */}
            <Card className="mb-5 shadow">
                <Card.Header as="h2">Latest Version</Card.Header>
                <Card.Body>
                    <Card.Title>{projectData.currentVersion.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                        Uploaded by {projectData.currentVersion.uploadedBy} on {projectData.currentVersion.uploadDate}
                    </Card.Subtitle>
                    <Card.Text>{projectData.currentVersion.description}</Card.Text>
                    <Row className="mt-3">
                        <Col>
                            <Button variant="primary" href={projectData.currentVersion.fileUrl}>
                                Download
                            </Button>
                            <Button variant="secondary" className="ms-2">
                                View Details
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* Previous Versions List */}
            <Card className="shadow">
                <Card.Header as="h3">Previous Versions</Card.Header>
                <ListGroup variant="flush">
                    {projectData.previousVersions.map(version => (
                        <ListGroup.Item key={version.id}>
                            <Row className="align-items-center">
                                <Col md={8}>
                                    <h5>{version.name}</h5>
                                    <p className="text-muted mb-1">
                                        Uploaded by {version.uploadedBy} on {version.uploadDate}
                                    </p>
                                    <p className="mb-0">{version.description}</p>
                                </Col>
                                <Col md={4} className="text-md-end mt-3 mt-md-0">
                                    <Button variant="outline-primary" size="sm" href={version.fileUrl}>
                                        Download
                                    </Button>
                                    <Button variant="outline-secondary" size="sm" className="ms-2">
                                        View Details
                                    </Button>
                                </Col>
                            </Row>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            </Card>
        </Container>
    );
}