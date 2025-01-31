import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, Typography, CircularProgress, Alert, Button, Box, Accordion, AccordionSummary, AccordionDetails, Table, TableBody, TableCell, TableHead, TableRow, Tabs, Tab } from '@mui/joy';
import axios from 'axios';
import { FaServer, FaDatabase, FaCloud, FaMoneyBillWave, FaGlobe, FaRedo, FaChevronDown, FaWater } from 'react-icons/fa';
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
  const [selectedTab, setSelectedTab] = useState(0);

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

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
      case "running":
        return "success";
      case "pending":
        return "warning";
      case "offline":
      case "error":
      case "stopped":
        return "danger";
      default:
        return "secondary";
    }
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

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5 text-center">
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <Typography level="h2" component="h2" gutterBottom>
        Cloud Resources Status
      </Typography>
      <Box display="flex" alignItems="center" mb={4}>
        <Button onClick={fetchData} variant="contained" color="primary" startIcon={<FaRedo />}>
          Refresh Now
        </Button>
        <Typography level="body2" ml={2}>
          Last updated: {formatTimeAgo(lastUpdated)}
        </Typography>
      </Box>

      <Tabs value={selectedTab} onChange={handleTabChange}>
        <Tab label="Digital Ocean" icon={<FaWater />} />
        <Tab label="Cloudflare" icon={<SiCloudflare />} />
      </Tabs>

      {selectedTab === 0 && (
        <>
          <Typography level="h3" component="h3" gutterBottom>
            <FaServer /> Droplets
          </Typography>
          <Grid container spacing={2}>
            {droplets.map((droplet, index) => (
              <Grid key={index} item xs={12} sm={6} md={4}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography level="h5" component="h3">
                      {droplet.name} <span className={getStatusColor(droplet.status)}>●</span>
                    </Typography>
                    <Typography level="body2">
                      <strong>Status:</strong> {droplet.status}<br />
                      <strong>IP Address:</strong> {droplet.networks.v4[0]?.ip_address || "N/A"}<br />
                      <strong>Region:</strong> {droplet.region.name}
                    </Typography>
                    <Button onClick={() => handleAccordionToggle(droplet.id)} variant="text" endIcon={<FaChevronDown />}>
                      View Metadata
                    </Button>
                    <Accordion expanded={expandedDroplet === droplet.id}>
                      <AccordionSummary>
                        <Typography>Metadata</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Key</TableCell>
                              <TableCell>Value</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {Object.entries(droplet.metadata).map(([key, value]) => (
                              <TableRow key={key}>
                                <TableCell>{key}</TableCell>
                                <TableCell>{value}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </AccordionDetails>
                    </Accordion>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Typography level="h3" component="h3" gutterBottom>
            <FaCloud /> Spaces
          </Typography>
          <Grid container spacing={2}>
            {spaces.map((space, index) => (
              <Grid key={index} item xs={12} sm={6} md={4}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography level="h5" component="h3">
                      {space.name}
                    </Typography>
                    <Typography level="body2">
                      <strong>Region:</strong> {space.region}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Typography level="h3" component="h3" gutterBottom>
            <FaDatabase /> Databases
          </Typography>
          <Grid container spacing={2}>
            {databases.map((database, index) => (
              <Grid key={index} item xs={12} sm={6} md={4}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography level="h5" component="h3">
                      {database.name} <span className={getStatusColor(database.status)}>●</span>
                    </Typography>
                    <Typography level="body2">
                      <strong>Status:</strong> {database.status}<br />
                      <strong>Engine:</strong> {database.engine}<br />
                      <strong>Region:</strong> {database.region}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Typography level="h3" component="h3" gutterBottom>
            <FaGlobe /> CDN Endpoints
          </Typography>
          <Grid container spacing={2}>
            {cdnEndpoints.map((cdn, index) => (
              <Grid key={index} item xs={12} sm={6} md={4}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography level="h5" component="h3">
                      {cdn.origin}
                    </Typography>
                    <Typography level="body2">
                      <strong>Endpoint:</strong> {cdn.endpoint}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Typography level="h3" component="h3" gutterBottom>
            <FaMoneyBillWave /> Account Balance
          </Typography>
          {billing ? (
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent>
                <Typography level="body2">
                  <strong>Account Balance:</strong> ${billing.account_balance}
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <Typography level="body2">No billing data available.</Typography>
          )}
        </>
      )}

      {selectedTab === 1 && (
        <>
          <Typography level="h3" component="h3" gutterBottom>
            <FaGlobe /> Cloudflare Metrics
          </Typography>
          <Grid container spacing={2}>
            {cloudflareMetrics.map((zone, index) => (
              <Grid key={index} item xs={12} sm={6} md={4}>
                <Card variant="outlined" sx={{ height: '100%' }}>
                  <CardContent>
                    <Typography level="h5" component="h3">
                      {zone.name}
                    </Typography>
                    <Typography level="body2">
                      <strong>Status:</strong> {zone.status}<br />
                      <strong>Plan:</strong> {zone.plan.name}<br />
                      <strong>Development Mode:</strong> {zone.development_mode ? "Enabled" : "Disabled"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Container>
  );
};

export default CloudStatus;