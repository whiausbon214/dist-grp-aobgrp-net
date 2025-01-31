import React, { useState, useEffect } from 'react';
import { Row, Col, Accordion, Card } from 'react-bootstrap';
import axios from 'axios';
import { FaGlobe } from 'react-icons/fa';

const CloudflareTab = () => {
  const [cloudflareZones, setCloudflareZones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    const headers = { 'Authorization': `Bearer ${process.env.REACT_APP_CF_API_TOKEN}` };

    try {
      const response = await axios.get(
        `https://api.cloudflare.com/client/v4/zones`,
        { headers }
      );

      if (response.data.success) {
        const filteredZones = response.data.result.filter(zone =>
          ['aobgrp.com', 'aobgagents.com', 'aobgrp.net'].includes(zone.name)
        );
        setCloudflareZones(filteredZones);
      }
    } catch (err) {
      console.error('Error fetching Cloudflare data:', err);
      setError("Failed to fetch Cloudflare data.");
    }

    setLoading(false);
  };

  if (loading) return <div>Loading Cloudflare data...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div>
      <h3><FaGlobe /> Cloudflare Metrics</h3>
      <Row>
        {cloudflareZones.map((zone) => (
          <Col key={zone.id} sm={12} md={6} lg={4} className="mb-4">
            <Accordion>
              <Card>
                <Accordion.Toggle as={Card.Header} eventKey={zone.name}>
                  {zone.name}
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={zone.name}>
                  <Card.Body>
                    <p><strong>Status:</strong> {zone.status}</p>
                    <p><strong>Plan:</strong> {zone.plan.name}</p>
                    <p><strong>Dev Mode:</strong> {zone.development_mode ? "Enabled" : "Disabled"}</p>
                  </Card.Body>
                </Accordion.Collapse>
              </Card>
            </Accordion>
          </Col>
        ))}
      </Row>
    </div>
  );
};

const fetchData = async () => {
  const headers = { 'Authorization': `Bearer ${process.env.REACT_APP_CF_API_TOKEN}` };

  try {
    const response = await axios.get(
      `https://api.cloudflare.com/client/v4/zones`,
      { headers }
    );

    if (response.data.success) {
      const filteredZones = response.data.result.filter(zone =>
        ['aobgrp.com', 'aobgagents.com', 'aobgrp.net'].includes(zone.name)
      );
      return filteredZones;
    } else {
      throw new Error("Failed to fetch Cloudflare data.");
    }
  } catch (err) {
    console.error('Error fetching Cloudflare data:', err);
    throw new Error("Failed to fetch Cloudflare data.");
  }
};

export { fetchData };
export default CloudflareTab;
