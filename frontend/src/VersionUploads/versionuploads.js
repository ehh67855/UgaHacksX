import React, { useEffect, useState } from 'react';
import { Container, Card, Button, ListGroup, Row, Col, Spinner, Alert, Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';

export default function VersionUploads() {
    const { id } = useParams();
    const [versions, setVersions] = useState([]);
    const [latestVersion, setLatestVersion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState(null);

    useEffect(() => {
        fetchVersions();
    }, [id]);

    const fetchVersions = () => {
        axios.get(`http://localhost:8080/api/projects/${id}/versions`)
            .then(response => {
                if (response.data.length > 0) {
                    setLatestVersion(response.data[0]); // Latest version
                    setVersions(response.data.slice(1)); // Older versions
                }
                setLoading(false);
            })
            .catch(error => {
                setError("Failed to load project versions.");
                setLoading(false);
            });
    };

    const handleDownload = async (versionId, fileName) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/projects/download/${versionId}`, {
                responseType: 'blob',
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
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

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleFileUpload = async () => {
        if (!file) {
            alert("Please select a file to upload.");
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append("file", file);

        try {
            await axios.post(`http://localhost:8080/api/projects/${id}/upload`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            alert("File uploaded successfully!");
            setFile(null);
            fetchVersions(); // Refresh the versions list
        } catch (error) {
            alert("File upload failed.");
            console.error("Upload error:", error);
        } finally {
            setUploading(false);
        }
    };

    if (loading) return <Spinner animation="border" />;
    if (error) return <Alert variant="danger">{error}</Alert>;

    return (
        <Container className="my-5 pb-5">
            <h1 className="text-center mb-4">Version Uploads</h1>

            {/* File Upload Section */}
            <Card className="mb-4 p-3 shadow">
                <Row className="align-items-center">
                    <Col md={8}>
                        <Form.Control type="file" onChange={handleFileChange} />
                    </Col>
                    <Col md={4} className="text-md-end mt-3 mt-md-0">
                        <Button variant="success" onClick={handleFileUpload} disabled={uploading}>
                            {uploading ? "Uploading..." : "Add Version"}
                        </Button>
                    </Col>
                </Row>
            </Card>

            {latestVersion && (
                <Card className="mb-5 shadow">
                    <Card.Header as="h2">Latest Version</Card.Header>
                    <Card.Body>
                        <Card.Title>{latestVersion.name}</Card.Title>
                        <Card.Subtitle className="mb-2 text-muted">
                            Uploaded on {latestVersion.uploadDate}
                        </Card.Subtitle>
                        <Card.Text>{latestVersion.description}</Card.Text>
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
                                        <p>{version.description}</p>
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
