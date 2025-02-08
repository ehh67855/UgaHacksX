import React from 'react';
import { Container, Row, Col, Navbar } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Footer() {
    return (
        <Navbar fixed="bottom" bg="dark" variant="dark" className="pe-4">
            <Container fluid>
                <Row className="w-100">
                    <Col className="text-end" style={{ color: '#808080' }}>
                        Andy Tadesse, Evan Hammam, & William Petit
                    </Col>
                </Row>
            </Container>
        </Navbar>
    );
}
