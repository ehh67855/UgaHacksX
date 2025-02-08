import React, { useState } from 'react';
import { Container, Row, Col, Nav, Navbar, Form, Button, Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Footer() {


    return (
        <Navbar fixed="bottom" bg="dark" variant="dark" className="justify-content-center">
            <Container>
                <Row className="align-items-center">
                    <Col className="text-center">
                        <Nav>
                            <Nav.Link href="#contact" className="mx-2">Contact Us</Nav.Link>
                        </Nav>
                    </Col>
                </Row>
            </Container>
        </Navbar>
    );
}
