import React, { useState } from 'react';
import { Container, Form, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getAuthToken } from 'src/services/BackendService';
import { getLogin } from 'src/services/BackendService';

export default function NewProject() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        
        if (selectedFile && selectedFile.size > 10 * 1024 * 1024) {
            alert("File is too large! Please select a file under 10MB.");
            return;
        }
    
        setFile(selectedFile);
    };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!name || !description || !file) {
            alert("Please fill out all fields and select a file.");
            return;
        }

        setIsLoading(true);
        
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("file", file);
        formData.append("login", getLogin(getAuthToken()));

        try {
            const response = await fetch("http://localhost:8080/api/projects", {
                method: "POST",
                body: formData
            });

            if (response.ok) {
                alert("Project uploaded successfully!");
                setName('');
                setDescription('');
                setFile(null);
            } else {
                alert("Failed to upload project.");
            }
        } catch (error) {
            console.error("Error uploading project:", error);
            alert("An error occurred. Please try again.");
        }

        setIsLoading(false);
    };

    return (
        <Container className="mt-5">
            <h1 className="text-center">Add New Project</h1>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formProjectName">
                    <Form.Label>Project Name</Form.Label>
                    <Form.Control 
                        type="text" 
                        placeholder="Enter project name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                    />
                </Form.Group>

                <Form.Group controlId="formProjectDescription" className="mt-3">
                    <Form.Label>Project Description</Form.Label>
                    <Form.Control 
                        as="textarea" 
                        rows={3} 
                        placeholder="Enter project description" 
                        value={description} 
                        onChange={(e) => setDescription(e.target.value)} 
                    />
                </Form.Group>

                <Form.Group controlId="formProjectFile" className="mt-3">
                    <Form.Label>Project File</Form.Label>
                    <Form.Control 
                        type="file" 
                        onChange={handleFileChange}
                        accept=".logicx,.band" // Allow Logic Pro X and GarageBand files
                    />
                    <Form.Text className="text-muted">
                        Upload your Logic Pro X or GarageBand project files
                    </Form.Text>
                </Form.Group>

                <Button variant="primary" type="submit" className="mt-3" disabled={isLoading}>
                    {isLoading ? "Uploading..." : "Submit"}
                </Button>
            </Form>
        </Container>
    );
}
