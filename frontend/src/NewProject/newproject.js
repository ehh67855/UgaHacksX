import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function NewProject() {
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    return (
        <Container className="mt-5">
            <h1 className="text-center">Add New Project</h1>
            <Form>
                <Form.Group controlId="formProjectName">
                    <Form.Label>Project Name</Form.Label>
                    <Form.Control type="text" placeholder="Enter project name" />
                </Form.Group>

                <Form.Group controlId="formProjectDescription" className="mt-3">
                    <Form.Label>Project Description</Form.Label>
                    <Form.Control as="textarea" rows={3} placeholder="Enter project description" />
                </Form.Group>

                <Form.Group controlId="formProjectFile" className="mt-3">
                    <Form.Label>Project File</Form.Label>
                    <Form.Control 
                        type="file" 
                        onChange={handleFileChange}
                        accept="*/*"  // Specify accepted file types
                    />
                    <Form.Text className="text-muted">
                        Upload your project documentation or related files
                    </Form.Text>
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-3">
                    Submit
                </Button>
            </Form>
        </Container>
    );
}