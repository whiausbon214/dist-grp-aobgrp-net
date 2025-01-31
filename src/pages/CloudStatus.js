import React, { useState, useEffect } from 'react';
import { Container, Grid, Card, CardContent, Typography, CircularProgress, Alert, Button } from '@mui/joy';
import axios from 'axios';
import { FaServer, FaDatabase, FaCloud, FaMoneyBillWave, FaGlobe, FaRedo } from 'react-icons/fa';

const CloudStatus = () => {
  const [droplets, setDroplets] = useState([]);
  const [databases, setDatabases] = useState([]);
  const [billing, setBilling] = useState(null);
  const [cdnEndpoints, setCdnEndpoints] = useState([]);
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    const DO_API_TOKEN = process.env.REACT_APP_DO_API_TOKEN;
    const DO_SPACES_API_TOKEN = process.env.REACT_APP_DO_SPACES_API_TOKEN;
    const headers = { 'Authorization': `Bearer ${DO_API_TOKEN}` };
    const spacesHeaders = { 'Authorization': `Bearer ${DO_SPACES_API_TOKEN}` };

    try {
      const [dropletsRes, databasesRes, billingRes, cdnRes, spacesRes] = await Promise.allSettled([
        axios.get('https://api.digitalocean.com/v2/droplets', { headers }),
        axios.get('https://api.digitalocean.com/v2/databases', { headers }),
        axios.get('https://api.digitalocean.com/v2/customers/my/balance', { headers }),
        axios.get('https://api.digitalocean.com/v2/cdn/endpoints', { headers }),
        axios.get('https://api.digitalocean.com/v2/spaces', { headers: spacesHeaders })
      ]);

      if (dropletsRes.status === "fulfilled") setDroplets(dropletsRes.value.data.droplets);
      if (databasesRes.status === "fulfilled") setDatabases(databasesRes.value.data.databases);
      if (billingRes.status === "fulfilled") setBilling(billingRes.value.data);
      if (cdnRes.status === "fulfilled") setCdnEndpoints(cdnRes.value.data.endpoints);
      if (spacesRes.status === "fulfilled") setSpaces(spacesRes.value.data.spaces);
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
        DigitalOcean Resources Status
      </Typography>
      <Button onClick={fetchData} className="mb-4" variant="contained" color="primary">
        <FaRedo /> Refresh Now
      </Button>

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
    </Container>
  );
};

export default CloudStatus;