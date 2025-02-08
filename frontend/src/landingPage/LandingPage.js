import React from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function LandingPage() {
    return (
        <Container className="text-center mt-5">
            <h1>Welcome!</h1>
            <p>Please log in or sign up to continue.</p>
            <Row className="justify-content-md-center">
                <Col md="auto">
                    <Button variant="primary" href="/login">Log In</Button>
                </Col>
                <Col md="auto">
                    <Button variant="secondary" href="/register">Sign Up</Button>
                </Col>
            </Row>
        </Container>
    );
}
