import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Tabs, Tab } from 'react-bootstrap';
import axios from 'axios';
import { FaRedo, FaDigitalOcean, FaGlobe } from 'react-icons/fa';
import { SiCloudflare } from 'react-icons/si';
import DigitalOceanTab from '../components/DigitalOceanTab';
import CloudflareTab from '../components/CloudflareTab';

const CloudStatus = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedTab, setSelectedTab] = useState('digital-ocean');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Call data fetching functions from separate components
      await Promise.all([
        DigitalOceanTab.fetchData(),
        CloudflareTab.fetchData()
      ]);

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
    <Container fluid className="p-4 bg-light">
      <Row className="mb-4">
        <Col>
          <h2 className="text-center">Cloud Resources Status</h2>
          <Button onClick={fetchData} variant="primary" className="mb-3">
            <FaRedo /> Refresh Now
          </Button>
          <p className="text-center">Last updated: {formatTimeAgo(lastUpdated)}</p>
        </Col>
      </Row>

      <Tabs activeKey={selectedTab} onSelect={handleTabChange} className="mb-3">
        <Tab eventKey="digital-ocean" title={<><FaDigitalOcean /> Digital Ocean</>}>
          <DigitalOceanTab />
        </Tab>
        <Tab eventKey="cloudflare" title={<><SiCloudflare /> Cloudflare</>}>
          <CloudflareTab />
        </Tab>
      </Tabs>
    </Container>
  );
};

export default CloudStatus;