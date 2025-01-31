import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Tabs, Tab, Table, Accordion, Card } from 'react-bootstrap';
import axios from 'axios';
import { FaServer, FaDatabase, FaCloud, FaMoneyBillWave, FaGlobe, FaRedo, FaWater } from 'react-icons/fa';
import { SiCloudflare } from 'react-icons/si';

const CloudStatus = () => {
  const [droplets, setDroplets] = useState([]);
  const [databases, setDatabases] = useState([]);
  const [billing, setBilling] = useState(null);
  const [cdnEndpoints, setCdnEndpoints] = useState([]);
  const [spaces, setSpaces] = useState([]);
  const [cloudflareMetrics, setCloudflareMetrics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [expandedDroplet, setExpandedDroplet] = useState(null);
  const [selectedTab, setSelectedTab] = useState('digital-ocean');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    const DO_API_TOKEN = process.env.REACT_APP_DO_API_TOKEN;
    const DO_SPACES_API_TOKEN = process.env.REACT_APP_DO_SPACES_API_TOKEN;
    const CF_API_TOKEN = process.env.REACT_APP_CF_API_TOKEN;
    const CF_ACCOUNT_ID = process.env.REACT_APP_CF_ACCOUNT_ID;
    const headers = { 'Authorization': `Bearer ${DO_API_TOKEN}` };
    const spacesHeaders = { 'Authorization': `Bearer ${DO_SPACES_API_TOKEN}` };
    const cfHeaders = { 'Authorization': `Bearer ${CF_API_TOKEN}` };

    try {
      const [dropletsRes, databasesRes, billingRes, cdnRes, spacesRes, cloudflareRes] = await Promise.allSettled([
        axios.get('https://api.digitalocean.com/v2/droplets', { headers }),
        axios.get('https://api.digitalocean.com/v2/databases', { headers }),
        axios.get('https://api.digitalocean.com/v2/customers/my/balance', { headers }),
        axios.get('https://api.digitalocean.com/v2/cdn/endpoints', { headers }),
        axios.get('https://api.digitalocean.com/v2/spaces', { headers: spacesHeaders }),
        axios.get(`https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/zones`, { headers: cfHeaders })
      ]);

      if (dropletsRes.status === "fulfilled") {
        const dropletsData = dropletsRes.value.data.droplets;
        const dropletsWithMetadata = await Promise.all(dropletsData.map(async (droplet) => {
          const metadataRes = await axios.get(`http://169.254.169.254/metadata/v1.json`, { headers });
          return { ...droplet, metadata: metadataRes.data };
        }));
        setDroplets(dropletsWithMetadata);
      }
      if (databasesRes.status === "fulfilled") setDatabases(databasesRes.value.data.databases);
      if (billingRes.status === "fulfilled") setBilling(billingRes.value.data);
      if (cdnRes.status === "fulfilled") setCdnEndpoints(cdnRes.value.data.endpoints);
      if (spacesRes.status === "fulfilled") setSpaces(spacesRes.value.data.spaces);
      if (cloudflareRes.status === "fulfilled") {
        const zones = cloudflareRes.value.data.result;
        const metrics = zones.filter(zone => ['aobgrp.com', 'aobgagents.com'].includes(zone.name));
        setCloudflareMetrics(metrics);
      }

      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching data:', err);
      setError("Failed to fetch data. Please check your API token or network.");
    }

    setLoading(false);
  };

  const formatTimeAgo = (date) => {
    if (!date) return '';
    const seconds = Math.floor((new Date() - date) / 1000);
    let interval = seconds / 3600;
    if (interval > 1) {
      return Math.floor(interval) + " hours ago";
    }
    interval = seconds / 60;
    if (interval > 1) {
      return Math.floor(interval) + " minutes ago";
    }
    return Math.floor(seconds) + " seconds ago";
  };

  const handleAccordionToggle = (dropletId) => {
    setExpandedDroplet(expandedDroplet === dropletId ? null : dropletId);
  };

  const handleTabChange = (key) => {
    setSelectedTab(key);
  };

  if (loading) {
    return (
      <Container>
        <Row>
          <Col>
            <div className="alert alert-info">Loading... Fetching data...</div>
          </Col>
        </Row>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Row>
          <Col>
            <div className="alert alert-danger">{error}</div>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container>
      <Row className="my-4">
        <Col>
          <h2>Cloud Resources Status</h2>
          <Button onClick={fetchData} variant="primary">
            <FaRedo /> Refresh Now
          </Button>
          <p>Last updated: {formatTimeAgo(lastUpdated)}</p>
        </Col>
      </Row>

      <Tabs activeKey={selectedTab} onSelect={handleTabChange}>
        <Tab eventKey="digital-ocean" title={<><FaWater /> Digital Ocean</>}>
          <h3><FaServer /> Droplets</h3>
          <Row>
            {droplets.map((droplet, index) => (
              <Col key={index} sm={4}>
                <Accordion>
                  <Card>
                    <Accordion.Toggle as={Card.Header} eventKey={droplet.id} onClick={() => handleAccordionToggle(droplet.id)}>
                      {droplet.name} ({droplet.status})
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey={droplet.id}>
                      <Card.Body>
                        <p><strong>Status:</strong> {droplet.status}</p>
                        <p><strong>IP Address:</strong> {droplet.networks.v4[0]?.ip_address || "N/A"}</p>
                        <p><strong>Region:</strong> {droplet.region.name}</p>
                        <Table striped bordered hover>
                          <thead>
                            <tr>
                              <th>Key</th>
                              <th>Value</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(droplet.metadata).map(([key, value]) => (
                              <tr key={key}>
                                <td>{key}</td>
                                <td>{value}</td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                </Accordion>
              </Col>
            ))}
          </Row>

          <h3><FaCloud /> Spaces</h3>
          <Row>
            {spaces.map((space, index) => (
              <Col key={index} sm={4}>
                <Accordion>
                  <Card>
                    <Accordion.Toggle as={Card.Header} eventKey={space.name}>
                      {space.name}
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey={space.name}>
                      <Card.Body>
                        <p><strong>Region:</strong> {space.region}</p>
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                </Accordion>
              </Col>
            ))}
          </Row>

          <h3><FaDatabase /> Databases</h3>
          <Row>
            {databases.map((database, index) => (
              <Col key={index} sm={4}>
                <Accordion>
                  <Card>
                    <Accordion.Toggle as={Card.Header} eventKey={database.name}>
                      {database.name} ({database.status})
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey={database.name}>
                      <Card.Body>
                        <p><strong>Status:</strong> {database.status}</p>
                        <p><strong>Engine:</strong> {database.engine}</p>
                        <p><strong>Region:</strong> {database.region}</p>
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                </Accordion>
              </Col>
            ))}
          </Row>

          <h3><FaGlobe /> CDN Endpoints</h3>
          <Row>
            {cdnEndpoints.map((cdn, index) => (
              <Col key={index} sm={4}>
                <Accordion>
                  <Card>
                    <Accordion.Toggle as={Card.Header} eventKey={cdn.origin}>
                      {cdn.origin}
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey={cdn.origin}>
                      <Card.Body>
                        <p><strong>Endpoint:</strong> {cdn.endpoint}</p>
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                </Accordion>
              </Col>
            ))}
          </Row>

          <h3><FaMoneyBillWave /> Account Balance</h3>
          {billing ? (
            <Accordion>
              <Card>
                <Accordion.Toggle as={Card.Header} eventKey="account-balance">
                  Account Balance
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="account-balance">
                  <Card.Body>
                    <p><strong>Account Balance:</strong> ${billing.account_balance}</p>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          ) : (
            <p>No billing data available.</p>
          )}
        </Tab>
        <Tab eventKey="cloudflare" title={<><SiCloudflare /> Cloudflare</>}>
          <h3><FaGlobe /> Cloudflare Metrics</h3>
          <Row>
            {cloudflareMetrics.map((zone, index) => (
              <Col key={index} sm={4}>
                <Accordion>
                  <Card>
                    <Accordion.Toggle as={Card.Header} eventKey={zone.name}>
                      {zone.name}
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey={zone.name}>
                      <Card.Body>
                        <p><strong>Status:</strong> {zone.status}</p>
                        <p><strong>Plan:</strong> {zone.plan.name}</p>
                        <p><strong>Development Mode:</strong> {zone.development_mode ? "Enabled" : "Disabled"}</p>
                      </Card.Body>
                    </Accordion.Collapse>
                  </Card>
                </Accordion>
              </Col>
            ))}
          </Row>
        </Tab>
      </Tabs>
    </Container>
  );
};

export default CloudStatus;