import React from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './LandingPage.css';

export default function LandingPage() {
    return (
        <div className="landing-page">
            <div className="content-overlay">
                <Container className="landing-content">
                    <h1>Welcome to TuneShift!</h1>
                    <br></br>
                    <p>Your Sound, Your Archive – Store and Share Your Music Versions.</p>
                    <p>Please log in or sign up to continue.</p>
                    <Row className="justify-content-md-center">
                        <Col xs={12} className="landing-buttons">
                            <Button 
                                variant="primary" 
                                href="/login"
                                className="btn-responsive"
                            >
                                Log In
                            </Button>
                            <Button 
                                variant="secondary" 
                                href="/register"
                                className="btn-responsive"
                            >
                                Sign Up
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    );
}
