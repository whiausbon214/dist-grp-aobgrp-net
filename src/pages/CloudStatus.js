import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner } from 'react-bootstrap';
import axios from 'axios';

const CloudStatus = () => {
  const [droplets, setDroplets] = useState([]);
  const [spaces, setSpaces] = useState([]);
  const [databases, setDatabases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const DO_API_TOKEN = process.env.REACT_APP_DO_API_TOKEN;
    const fetchDroplets = async () => {
      try {
        const response = await axios.get('https://api.digitalocean.com/v2/droplets', {
          headers: {
            'Authorization': `Bearer ${DO_API_TOKEN}`
          }
        });
        setDroplets(response.data.droplets);
      } catch (error) {
        console.error('Error fetching droplets:', error);
      }
    };

    const fetchSpaces = async () => {
      try {
        const response = await axios.get('https://api.digitalocean.com/v2/spaces', {
          headers: {
            'Authorization': `Bearer ${DO_API_TOKEN}`
          }
        });
        setSpaces(response.data.spaces);
      } catch (error) {
        console.error('Error fetching spaces:', error);
      }
    };

    const fetchDatabases = async () => {
      try {
        const response = await axios.get('https://api.digitalocean.com/v2/databases', {
          headers: {
            'Authorization': `Bearer ${DO_API_TOKEN}`
          }
        });
        setDatabases(response.data.databases);
      } catch (error) {
        console.error('Error fetching databases:', error);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchDroplets(), fetchSpaces(), fetchDatabases()]);
      setLoading(false);
    };

    fetchData();
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

      <h3 className="mt-4">Spaces</h3>
      <Row className="mt-2">
        {spaces.map((space, index) => (
          <Col key={index} md={4} className="mb-4">
            <Card className="h-100 shadow">
              <Card.Body>
                <Card.Title>{space.name}</Card.Title>
                <Card.Text>
                  <strong>Region:</strong> {space.region}
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