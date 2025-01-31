import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Spinner, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { FaServer, FaDatabase, FaCloud, FaMoneyBillWave, FaGlobe, FaRedo } from 'react-icons/fa';

const CloudStatus = () => {
  const [droplets, setDroplets] = useState([]);
  const [spaces, setSpaces] = useState([]);
  const [databases, setDatabases] = useState([]);
  const [apps, setApps] = useState([]);
  const [billing, setBilling] = useState(null);
  const [cdnEndpoints, setCdnEndpoints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    const DO_API_TOKEN = process.env.REACT_APP_DO_API_TOKEN;
    const headers = { 'Authorization': `Bearer ${DO_API_TOKEN}` };

    try {
      const [dropletsRes, spacesRes, databasesRes, appsRes, billingRes, cdnRes] = await Promise.allSettled([
        axios.get('https://api.digitalocean.com/v2/droplets', { headers }),
        axios.get('https://api.digitalocean.com/v2/spaces', { headers }),
        axios.get('https://api.digitalocean.com/v2/databases', { headers }),
        axios.get('https://api.digitalocean.com/v2/apps', { headers }),
        axios.get('https://api.digitalocean.com/v2/customers/my/balance', { headers }),
        axios.get('https://api.digitalocean.com/v2/cdn/endpoints', { headers })
      ]);

      if (dropletsRes.status === "fulfilled") setDroplets(dropletsRes.value.data.droplets);
      if (spacesRes.status === "fulfilled") setSpaces(spacesRes.value.data.spaces);
      if (databasesRes.status === "fulfilled") setDatabases(databasesRes.value.data.databases);
      if (appsRes.status === "fulfilled") setApps(appsRes.value.data.apps);
      if (billingRes.status === "fulfilled") setBilling(billingRes.value.data);
      if (cdnRes.status === "fulfilled") setCdnEndpoints(cdnRes.value.data.endpoints);
    } catch (err) {
      setError("Failed to fetch some data. Please check your API token or network.");
    }

    setLoading(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
      case "running":
        return "text-success";
      case "pending":
        return "text-warning";
      case "offline":
      case "error":
      case "stopped":
        return "text-danger";
      default:
        return "text-secondary";
    }
  };

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
      {error && <Alert variant="danger">{error}</Alert>}
      <Button onClick={fetchData} className="mb-4">
        <FaRedo /> Refresh Now
      </Button>

      <h3 className="mt-4"><FaServer /> Droplets</h3>
      <Row className="mt-2">
        {droplets.map((droplet, index) => (
          <Col key={index} md={4} className="mb-4">
            <Card className="h-100 shadow">
              <Card.Body>
                <Card.Title>{droplet.name} <span className={getStatusColor(droplet.status)}>●</span></Card.Title>
                <Card.Text>
                  <strong>Status:</strong> {droplet.status}<br />
                  <strong>IP Address:</strong> {droplet.networks.v4[0]?.ip_address || "N/A"}<br />
                  <strong>Region:</strong> {droplet.region.name}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <h3 className="mt-4"><FaCloud /> Spaces</h3>
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

      <h3 className="mt-4"><FaDatabase /> Databases</h3>
      <Row className="mt-2">
        {databases.map((database, index) => (
          <Col key={index} md={4} className="mb-4">
            <Card className="h-100 shadow">
              <Card.Body>
                <Card.Title>{database.name} <span className={getStatusColor(database.status)}>●</span></Card.Title>
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

      <h3 className="mt-4"><FaGlobe /> CDN Endpoints</h3>
      <Row className="mt-2">
        {cdnEndpoints.map((cdn, index) => (
          <Col key={index} md={4} className="mb-4">
            <Card className="h-100 shadow">
              <Card.Body>
                <Card.Title>{cdn.origin}</Card.Title>
                <Card.Text>
                  <strong>Endpoint:</strong> {cdn.endpoint}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <h3 className="mt-4"><FaMoneyBillWave /> Account Balance</h3>
      {billing ? (
        <Card className="mb-4 shadow">
          <Card.Body>
            <Card.Text>
              <strong>Account Balance:</strong> ${billing.account_balance}
            </Card.Text>
          </Card.Body>
        </Card>
      ) : (
        <p>No billing data available.</p>
      )}

    </Container>
  );
};

export default CloudStatus;