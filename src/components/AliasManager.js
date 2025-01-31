import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Container, Button, Table, Modal, TextField, Typography, Box } from '@mui/joy';
import { FiEdit, FiTrash2, FiAlertTriangle } from 'react-icons/fi';

const AliasManager = () => {
  const [aliases, setAliases] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [aliasName, setAliasName] = useState("");
  const [recipients, setRecipients] = useState(Array(10).fill(""));
  const [password, setPassword] = useState("");
  const [selectedAlias, setSelectedAlias] = useState(null);

  const API_BASE_URL = "https://api.forwardemail.net/v1";
  const API_KEY = process.env.REACT_APP_API_KEY;
  const DOMAIN_NAME = process.env.REACT_APP_DOMAIN_NAME;
  const APP_PASSWORD = process.env.REACT_APP_PASSWORD;

  // Fetch aliases from the API
  const fetchAliases = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/domains/${DOMAIN_NAME}/aliases`, {
        auth: { username: API_KEY, password: "" }
      });
      setAliases(response.data);
    } catch (error) {
      console.error("Error fetching aliases:", error);
    }
  }, [API_BASE_URL, API_KEY, DOMAIN_NAME]);

  useEffect(() => {
    fetchAliases();
  }, [fetchAliases]);

  // Filter out the alias 'commissions@aobgrp.com'
  const filteredAliases = aliases.filter(alias => alias.name !== '*');

  return (
    <Container>
      <Button variant="solid" color="primary" onClick={() => setShowCreateModal(true)}>
        Create Alias
      </Button>
      <Table variant="soft" borderAxis="both" hoverRow size="md" sx={{ mt: 2 }}>
        <Table.Head>
          <Table.Row>
            <Table.Cell variant='soft' component='th'>Alias</Table.Cell>
            <Table.Cell variant='soft' component='th'>Recipients</Table.Cell>
            <Table.Cell variant='soft' component='th'>Actions</Table.Cell>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {filteredAliases.map((alias) => (
            <tr key={alias.id}>
              <Table.Cell>{alias.name}</Table.Cell>
              <Table.Cell>{alias.recipients.join(", ")}</Table.Cell>
              <Table.Cell>
                <Button variant="outlined" color="primary" onClick={() => { setSelectedAlias(alias); setShowEditModal(true); }}>
                  <FiEdit />
                </Button>
                <Button variant="outlined" color="danger" onClick={() => { setSelectedAlias(alias); setShowDeleteModal(true); }}>
                  <FiTrash2 />
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      <Modal open={showCreateModal} onClose={() => setShowCreateModal(false)}>
        <Box sx={{ p: 2 }}>
          <Typography level="h5" component="h2" gutterBottom>
            Create Alias
          </Typography>
          <TextField
            label="Alias Name"
            value={aliasName}
            onChange={(e) => setAliasName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Typography level="body1" gutterBottom>
            Recipients
          </Typography>
          {recipients.map((recipient, index) => (
            <TextField
              key={index}
              value={recipient}
              onChange={(e) => {
                const newRecipients = [...recipients];
                newRecipients[index] = e.target.value;
                setRecipients(newRecipients);
              }}
              fullWidth
              margin="normal"
            />
          ))}
          <Button variant="solid" color="primary" onClick={() => { /* handle create alias */ }}>
            Create
          </Button>
        </Box>
      </Modal>

      <Modal open={showEditModal} onClose={() => setShowEditModal(false)}>
        <Box sx={{ p: 2 }}>
          <Typography level="h5" component="h2" gutterBottom>
            Edit Alias
          </Typography>
          <TextField
            label="Alias Name"
            value={aliasName}
            onChange={(e) => setAliasName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Typography level="body1" gutterBottom>
            Recipients
          </Typography>
          {recipients.map((recipient, index) => (
            <TextField
              key={index}
              value={recipient}
              onChange={(e) => {
                const newRecipients = [...recipients];
                newRecipients[index] = e.target.value;
                setRecipients(newRecipients);
              }}
              fullWidth
              margin="normal"
            />
          ))}
          <Button variant="solid" color="primary" onClick={() => { /* handle edit alias */ }}>
            Save
          </Button>
        </Box>
      </Modal>

      <Modal open={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <Box sx={{ p: 2 }}>
          <Typography level="h5" component="h2" gutterBottom color="danger">
            <FiAlertTriangle /> Confirm Deletion
          </Typography>
          <Typography color="danger">
            This action is <strong>irreversible</strong>. Once deleted, the alias cannot be recovered.
          </Typography>
          <TextField
            label="Enter Password to Confirm"
            type="password"
            placeholder="Enter app password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button variant="outlined" color="neutral" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button variant="solid" color="danger" onClick={deleteAlias} sx={{ ml: 2 }}>
              Confirm Delete
            </Button>
          </Box>
        </Box>
      </Modal>
    </Container>
  );
};

export default AliasManager;