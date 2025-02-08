export default function Home() {
    return (
        <Container className="mt-5 mb-5">
            <h1 className="text-center">Feed</h1>
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