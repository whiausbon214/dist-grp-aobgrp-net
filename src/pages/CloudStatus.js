import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import axios from 'axios';

const CloudStatus = () => {
  const [statusData, setStatusData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatusData = async () => {
      try {
        const response = await axios.get('https://api.statuspage.io/v1/pages/YOUR_PAGE_ID/status');
        setStatusData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching status data:', error);
        setLoading(false);
      }
    };

    fetchStatusData();
  }, []);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2>Cloud Status</h2>
      <Row className="mt-4">
        {statusData && statusData.components.map((component, index) => (
          <Col key={index} md={4} className="mb-4">
            <Card className="h-100 shadow">
              <Card.Body>
                <Card.Title>{component.name}</Card.Title>
                <Card.Text>Status: {component.status}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default CloudStatus;