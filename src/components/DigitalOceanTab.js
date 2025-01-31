import React, { useState, useEffect } from 'react';
import { Row, Col, Accordion, Card, Table } from 'react-bootstrap';
import axios from 'axios';
import { FaServer, FaDatabase, FaMoneyBillWave, FaGlobe } from 'react-icons/fa';

const DigitalOceanTab = () => {
  const [droplets, setDroplets] = useState([]);
  const [databases, setDatabases] = useState([]);
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
    const headers = { 'Authorization': `Bearer ${process.env.REACT_APP_DO_API_TOKEN}` };

    try {
      const [dropletsRes, databasesRes, billingRes, cdnRes] = await Promise.allSettled([
        axios.get('https://api.digitalocean.com/v2/droplets', { headers }),
        axios.get('https://api.digitalocean.com/v2/databases', { headers }),
        axios.get('https://api.digitalocean.com/v2/customers/my/balance', { headers }),
        axios.get('https://api.digitalocean.com/v2/cdn/endpoints', { headers }),
      ]);

      if (dropletsRes.status === "fulfilled") setDroplets(dropletsRes.value.data.droplets);
      if (databasesRes.status === "fulfilled") setDatabases(databasesRes.value.data.databases);
      if (billingRes.status === "fulfilled") setBilling(billingRes.value.data);
      if (cdnRes.status === "fulfilled") setCdnEndpoints(cdnRes.value.data.endpoints);
    } catch (err) {
      console.error('Error fetching DigitalOcean data:', err);
      setError("Failed to fetch DigitalOcean data.");
    }

    setLoading(false);
  };

  if (loading) return <div>Loading DigitalOcean data...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <h3><FaServer /> Droplets</h3>
      <Row>
        {droplets.map((droplet) => (
          <Col key={droplet.id} sm={12} md={6} lg={4} className="mb-4">
            <Accordion>
              <Card>
                <Accordion.Toggle as={Card.Header} eventKey={droplet.id}>
                  {droplet.name} ({droplet.status})
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={droplet.id}>
                  <Card.Body>
                    <p><strong>Status:</strong> {droplet.status}</p>
                    <p><strong>IP:</strong> {droplet.networks.v4[0]?.ip_address || "N/A"}</p>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </Col>
        ))}
      </Row>

      <h3><FaDatabase /> Databases</h3>
      <Row>
        {databases.map((db) => (
          <Col key={db.name} sm={12} md={6} lg={4} className="mb-4">
            <Card>
              <Card.Body>
                <p><strong>Name:</strong> {db.name}</p>
                <p><strong>Status:</strong> {db.status}</p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <h3><FaGlobe /> CDN Endpoints</h3>
      <Row>
        {cdnEndpoints.map((cdn) => (
          <Col key={cdn.origin} sm={12} md={6} lg={4} className="mb-4">
            <Card>
              <Card.Body>
                <p><strong>Origin:</strong> {cdn.origin}</p>
                <p><strong>Endpoint:</strong> {cdn.endpoint}</p>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <h3><FaMoneyBillWave /> Account Balance</h3>
      {billing ? <p><strong>Balance:</strong> ${billing.account_balance}</p> : <p>No billing data available.</p>}
    </div>
  );
};

const fetchData = async () => {
  const headers = { 'Authorization': `Bearer ${process.env.REACT_APP_DO_API_TOKEN}` };

  try {
    const [dropletsRes, databasesRes, billingRes, cdnRes] = await Promise.allSettled([
      axios.get('https://api.digitalocean.com/v2/droplets', { headers }),
      axios.get('https://api.digitalocean.com/v2/databases', { headers }),
      axios.get('https://api.digitalocean.com/v2/customers/my/balance', { headers }),
      axios.get('https://api.digitalocean.com/v2/cdn/endpoints', { headers }),
    ]);

    return {
      droplets: dropletsRes.status === "fulfilled" ? dropletsRes.value.data.droplets : [],
      databases: databasesRes.status === "fulfilled" ? databasesRes.value.data.databases : [],
      billing: billingRes.status === "fulfilled" ? billingRes.value.data : null,
      cdnEndpoints: cdnRes.status === "fulfilled" ? cdnRes.value.data.endpoints : [],
    };
  } catch (err) {
    console.error('Error fetching DigitalOcean data:', err);
    throw new Error("Failed to fetch DigitalOcean data.");
  }
};

export { fetchData };
export default DigitalOceanTab;
