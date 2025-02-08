import React, { useEffect, useState } from 'react';
import { Container, Card, Button, ListGroup, Row, Col, Spinner, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function VersionUploads() {
    const { id } = useParams();
    const [versions, setVersions] = useState([]);
    const [latestVersion, setLatestVersion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8080/api/projects/${id}/versions`)
            .then(response => {
                if (response.data.length > 0) {
                    setLatestVersion(response.data[0]); // Assuming latest version is first in the list
                    setVersions(response.data.slice(1)); // Remaining versions
                }
                setLoading(false);
            })
            .catch(error => {
                setError("Failed to load project versions.");
                setLoading(false);
            });
    }, [id]);

    const handleDownload = async (versionId, fileName) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/projects/download/${versionId}`, {
                responseType: 'blob',
            });

            // Create a blob link to download the file
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${fileName}.zip`); // Set the filename
            document.body.appendChild(link);
            link.click();

            // Cleanup
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed", error);
            alert("Failed to download file.");
        }
    };

    if (loading) return <Spinner animation="border" />;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <Container className="my-5 pb-5">
            <h1 className="text-center mb-5">Version Uploads</h1>

            {latestVersion && (
                <Card className="mb-5 shadow">
                    <Card.Header as="h2">Latest Version</Card.Header>
                    <Card.Body>
                        <Card.Title>{latestVersion.name}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">
                            Uploaded on {latestVersion.uploadDate}
                        </Card.Subtitle>
                        <Card.Text>{latestVersion.description}</Card.Text> {/* Display description */}
                        <Row className="mt-3">
                            <Col>
                                <Button variant="primary" onClick={() => handleDownload(latestVersion.id, latestVersion.name)}>
                                    Download
                                </Button>
                            </Col>
                        </Row>
                    </Card.Body>
                </Card>
            )}

            {versions.length > 0 && (
                <Card className="shadow">
                    <Card.Header as="h3">Previous Versions</Card.Header>
                    <ListGroup variant="flush">
                        {versions.map(version => (
                            <ListGroup.Item key={version.id}>
                                <Row className="align-items-center">
                                    <Col md={8}>
                                        <h5>{version.name}</h5>
                                        <p className="text-muted mb-1">Uploaded on {version.uploadDate}</p>
                                        <p>{version.description}</p> {/* Display description */}
                                    </Col>
                                    <Col md={4} className="text-md-end mt-3 mt-md-0">
                                        <Button variant="outline-primary" size="sm" onClick={() => handleDownload(version.id, version.name)}>
                                            Download
                                        </Button>
                                    </Col>
                                </Row>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Card>
            )}
        </Container>
    );
}
