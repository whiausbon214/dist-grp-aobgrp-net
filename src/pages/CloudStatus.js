import React, { useState, useEffect } from 'react';
import { Grid, Row, Column, Button, Tabs, Tab, TabList, TabPanels, TabPanel, DataTable, Table, TableHead, TableRow, TableHeader, TableBody, TableCell, 
  InlineNotification, Accordion, AccordionItem } from '@carbon/react';
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
        return "green";
      case "pending":
        return "yellow";
      case "offline":
      case "error":
      case "stopped":
        return "red";
      default:
        return "gray";
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

  const handleTabChange = (index) => {
    setSelectedTab(index);
  };

  if (loading) {
    return (
      <Grid>
        <Row>
          <Column>
            <InlineNotification kind="info" title="Loading" subtitle="Fetching data..." />
          </Column>
        </Row>
      </Grid>
    );
  }

  if (error) {
    return (
      <Grid>
        <Row>
          <Column>
            <InlineNotification kind="error" title="Error" subtitle={error} />
          </Column>
        </Row>
      </Grid>
    );
  }

  return (
    <Grid>
      <Row>
        <Column>
          <h2>Cloud Resources Status</h2>
          <Button onClick={fetchData} renderIcon={FaRedo}>
            Refresh Now
          </Button>
          <p>Last updated: {formatTimeAgo(lastUpdated)}</p>
        </Column>
      </Row>

      <Tabs selected={selectedTab} onSelectionChange={handleTabChange}>
        <TabList aria-label="Cloud Resources">
          <Tab>
            <FaWater /> Digital Ocean
          </Tab>
          <Tab>
            <SiCloudflare /> Cloudflare
          </Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <h3><FaServer /> Droplets</h3>
            <Row>
              {droplets.map((droplet, index) => (
                <Column key={index} sm={4}>
                  <Accordion>
                    <AccordionItem title={`${droplet.name} (${droplet.status})`} open={expandedDroplet === droplet.id} onClick={() => handleAccordionToggle(droplet.id)}>
                      <p><strong>Status:</strong> {droplet.status}</p>
                      <p><strong>IP Address:</strong> {droplet.networks.v4[0]?.ip_address || "N/A"}</p>
                      <p><strong>Region:</strong> {droplet.region.name}</p>
                      <DataTable rows={Object.entries(droplet.metadata).map(([key, value]) => ({ id: key, key, value }))} headers={[{ key: 'key', header: 'Key' }, { key: 'value', header: 'Value' }]}>
                        {({ rows, headers, getHeaderProps, getRowProps }) => (
                          <Table>
                            <TableHead>
                              <TableRow>
                                {headers.map(header => (
                                  <TableHeader {...getHeaderProps({ header })}>
                                    {header.header}
                                  </TableHeader>
                                ))}
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {rows.map(row => (
                                <TableRow {...getRowProps({ row })}>
                                  {row.cells.map(cell => (
                                    <TableCell key={cell.id}>{cell.value}</TableCell>
                                  ))}
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        )}
                      </DataTable>
                    </AccordionItem>
                  </Accordion>
                </Column>
              ))}
            </Row>

            <h3><FaCloud /> Spaces</h3>
            <Row>
              {spaces.map((space, index) => (
                <Column key={index} sm={4}>
                  <Accordion>
                    <AccordionItem title={space.name}>
                      <p><strong>Region:</strong> {space.region}</p>
                    </AccordionItem>
                  </Accordion>
                </Column>
              ))}
            </Row>

            <h3><FaDatabase /> Databases</h3>
            <Row>
              {databases.map((database, index) => (
                <Column key={index} sm={4}>
                  <Accordion>
                    <AccordionItem title={`${database.name} (${database.status})`}>
                      <p><strong>Status:</strong> {database.status}</p>
                      <p><strong>Engine:</strong> {database.engine}</p>
                      <p><strong>Region:</strong> {database.region}</p>
                    </AccordionItem>
                  </Accordion>
                </Column>
              ))}
            </Row>

            <h3><FaGlobe /> CDN Endpoints</h3>
            <Row>
              {cdnEndpoints.map((cdn, index) => (
                <Column key={index} sm={4}>
                  <Accordion>
                    <AccordionItem title={cdn.origin}>
                      <p><strong>Endpoint:</strong> {cdn.endpoint}</p>
                    </AccordionItem>
                  </Accordion>
                </Column>
              ))}
            </Row>

            <h3><FaMoneyBillWave /> Account Balance</h3>
            {billing ? (
              <Accordion>
                <AccordionItem title="Account Balance">
                  <p><strong>Account Balance:</strong> ${billing.account_balance}</p>
                </AccordionItem>
              </Accordion>
            ) : (
              <p>No billing data available.</p>
            )}
          </TabPanel>
          <TabPanel>
            <h3><FaGlobe /> Cloudflare Metrics</h3>
            <Row>
              {cloudflareMetrics.map((zone, index) => (
                <Column key={index} sm={4}>
                  <Accordion>
                    <AccordionItem title={zone.name}>
                      <p><strong>Status:</strong> {zone.status}</p>
                      <p><strong>Plan:</strong> {zone.plan.name}</p>
                      <p><strong>Development Mode:</strong> {zone.development_mode ? "Enabled" : "Disabled"}</p>
                    </AccordionItem>
                  </Accordion>
                </Column>
              ))}
            </Row>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Grid>
  );
};

export default CloudStatus;