import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Container, Button, Table, Modal, Form } from 'react-bootstrap';
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
  const filteredAliases = aliases.filter(alias => alias.name !== 'commissions@aobgrp.com');

  // Define the deleteAlias function
  const deleteAlias = async () => {
    try {
      await axios.delete(`${API_BASE_URL}/domains/${DOMAIN_NAME}/aliases/${selectedAlias.id}`, {
        auth: { username: API_KEY, password: APP_PASSWORD }
      });
      setShowDeleteModal(false);
      fetchAliases();
    } catch (error) {
      console.error("Error deleting alias:", error);
    }
  };

  return (
    <Container>
      <Button variant="primary" onClick={() => setShowCreateModal(true)}>
        Create Alias
      </Button>
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Alias</th>
            <th>Recipients</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredAliases.map((alias) => (
            <tr key={alias.id}>
              <td>{alias.name}</td>
              <td>{alias.recipients.join(", ")}</td>
              <td>
                <Button variant="outline-primary" onClick={() => { setSelectedAlias(alias); setShowEditModal(true); }}>
                  <FiEdit />
                </Button>
                <Button variant="outline-danger" onClick={() => { setSelectedAlias(alias); setShowDeleteModal(true); }}>
                  <FiTrash2 />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Alias</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="aliasName">
              <Form.Label>Alias Name</Form.Label>
              <Form.Control
                type="text"
                value={aliasName}
                onChange={(e) => setAliasName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="recipients">
              <Form.Label>Recipients</Form.Label>
              {recipients.map((recipient, index) => (
                <Form.Control
                  key={index}
                  type="text"
                  value={recipient}
                  onChange={(e) => {
                    const newRecipients = [...recipients];
                    newRecipients[index] = e.target.value;
                    setRecipients(newRecipients);
                  }}
                  className="mb-2"
                />
              ))}
            </Form.Group>
            <Button variant="primary" onClick={() => { /* handle create alias */ }}>
              Create
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Alias</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="aliasName">
              <Form.Label>Alias Name</Form.Label>
              <Form.Control
                type="text"
                value={aliasName}
                onChange={(e) => setAliasName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="recipients">
              <Form.Label>Recipients</Form.Label>
              {recipients.map((recipient, index) => (
                <Form.Control
                  key={index}
                  type="text"
                  value={recipient}
                  onChange={(e) => {
                    const newRecipients = [...recipients];
                    newRecipients[index] = e.target.value;
                    setRecipients(newRecipients);
                  }}
                  className="mb-2"
                />
              ))}
            </Form.Group>
            <Button variant="primary" onClick={() => { /* handle edit alias */ }}>
              Save
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-danger">
            <FiAlertTriangle /> This action is <strong>irreversible</strong>. Once deleted, the alias cannot be recovered.
          </p>
          <Form.Group controlId="confirmPassword">
            <Form.Label>Enter Password to Confirm</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter app password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={deleteAlias}>
            Confirm Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default AliasManager;