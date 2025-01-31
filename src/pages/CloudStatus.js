import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';
import { FaServer, FaDatabase, FaCloud, FaMoneyBillWave, FaGlobe, FaRedo } from 'react-icons/fa';

const CloudStatus = () => {
  const [droplets, setDroplets] = useState([]);
  const [databases, setDatabases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    const DO_API_TOKEN = ;
    const headers = { 'Authorization': `Bearer ${DO_API_TOKEN}` };

    try {
      const [dropletsRes, databasesRes] = await Promise.all([
        axios.get('https://api.digitalocean.com/v2/droplets', { headers }),
        axios.get('https://api.digitalocean.com/v2/databases', { headers })
      ]);

      setDroplets(dropletsRes.data.droplets);
      setDatabases(databasesRes.data.databases);
    } catch (err) {
      setError("Failed to fetch data. Please check your API token or network.");
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2>DigitalOcean Resources Status</h2>

      <h3 className="mt-4">Droplets</h3>
      <Row className="mt-2">
        {droplets.map((droplet, index) => (
          <Col key={index} md={4} className="mb-4">
            <Card className="h-100 shadow">
              <Card.Body>
                <Card.Title>{droplet.name}</Card.Title>
                <Card.Text>
                  <strong>Status:</strong> {droplet.status}<br />
                  <strong>IP Address:</strong> {droplet.networks.v4[0].ip_address}<br />
                  <strong>Region:</strong> {droplet.region.name}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <h3 className="mt-4">Databases</h3>
      <Row className="mt-2">
        {databases.map((database, index) => (
          <Col key={index} md={4} className="mb-4">
            <Card className="h-100 shadow">
              <Card.Body>
                <Card.Title>{database.name}</Card.Title>
                <Card.Text>
                  <strong>Status:</strong> {database.status}<br />
                  <strong>Engine:</strong> {database.engine}<br />
                  <strong>Region:</strong> {database.region}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default CloudStatus;
