import React, { useState, useEffect } from 'react';
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
  const fetchAliases = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/domains/${DOMAIN_NAME}/aliases`, {
        auth: { username: API_KEY, password: "" }
      });
      setAliases(response.data);
    } catch (error) {
      console.error("Error fetching aliases:", error);
    }
  };

  useEffect(() => {
    fetchAliases();
  }, []);

  // Open the Create Alias Modal
  const openCreateModal = () => {
    setAliasName("");
    setRecipients(Array(10).fill(""));
    setShowCreateModal(true);
  };

  // Create a new alias
  const createAlias = async () => {
    const filteredRecipients = recipients.filter(email => email.trim() !== ""); // Remove empty fields

    try {
      await axios.post(
        `${API_BASE_URL}/domains/${DOMAIN_NAME}/aliases`,
        { name: aliasName, recipients: filteredRecipients },
        { auth: { username: API_KEY, password: "" } }
      );
      fetchAliases();
      setShowCreateModal(false);
    } catch (error) {
      console.error("Error creating alias:", error);
    }
  };

  // Open the Edit Alias Modal
  const openEditModal = (alias) => {
    setSelectedAlias(alias);
    setAliasName(alias.name);
    setRecipients(alias.recipients.concat(Array(10 - alias.recipients.length).fill(""))); 
    setShowEditModal(true);
  };

  // Update an existing alias
  const updateAlias = async () => {
    const updatedRecipients = recipients.filter(email => email.trim() !== "");

    try {
      await axios.put(
        `${API_BASE_URL}/domains/${DOMAIN_NAME}/aliases/${selectedAlias.id}`,
        { name: aliasName, recipients: updatedRecipients },
        { auth: { username: API_KEY, password: "" } }
      );
      fetchAliases();
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating alias:", error);
    }
  };

  // Open Delete Confirmation Modal
  const openDeleteModal = () => {
    setShowEditModal(false);
    setShowDeleteModal(true);
    setPassword("");
  };

  // Delete an alias (requires password)
  const deleteAlias = async () => {
    if (password !== APP_PASSWORD) {
      alert("Incorrect password. Unable to delete alias.");
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/domains/${DOMAIN_NAME}/aliases/${selectedAlias.id}`, {
        auth: { username: API_KEY, password: "" }
      });
      fetchAliases();
      setShowDeleteModal(false);
    } catch (error) {
      console.error("Error deleting alias:", error);
    }
  };

  return (
    <Container className="py-5">
      <h2>Email Alias Manager</h2>

      {/* Create Alias Button */}
      <Button variant="primary" className="mb-3" onClick={openCreateModal}>
        Create Alias
      </Button>

      {/* Alias Table */}
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>Alias</th>
            <th>Recipients</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {aliases.map((alias) => (
            <tr key={alias.id}>
              <td>{alias.name}</td>
              <td>{alias.recipients.join(", ")}</td>
              <td>
                <Button variant="warning" size="sm" className="me-2" onClick={() => openEditModal(alias)}>
                  <FiEdit /> Edit
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Create Alias Modal */}
      <Modal show={showCreateModal} onHide={() => setShowCreateModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Create Alias</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-4">
              <Form.Label><strong>Alias Name</strong></Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter alias name"
                value={aliasName}
                onChange={(e) => setAliasName(e.target.value)}
              />
              <Form.Text className="text-muted">
                Please enter a short alias for the agency. Do not include spaces or special characters other than period or dash. Do not add the domain at the end.
              </Form.Text>
            </Form.Group>

            {/* Recipients Fields */}
            <Form.Group className="mb-4">
              <Form.Label><strong>Add Recipients</strong></Form.Label>
              {recipients.map((email, index) => (
                <Form.Control
                  key={index}
                  type="email"
                  placeholder={`Recipient ${index + 1}`}
                  value={email}
                  onChange={(e) => {
                    const newRecipients = [...recipients];
                    newRecipients[index] = e.target.value;
                    setRecipients(newRecipients);
                  }}
                  className="mb-2"
                />
              ))}
              <Form.Text className="text-muted">Please add up to 10 recipients.</Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={createAlias}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Edit Alias Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Alias</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-4">
              <Form.Label><strong>Alias Name</strong></Form.Label>
              <Form.Control type="text" value={aliasName} disabled />
              <Form.Text className="text-muted">Alias name cannot be changed.</Form.Text>
            </Form.Group>

            {/* Recipients Fields */}
            <Form.Group className="mb-4">
              <Form.Label><strong>Recipients</strong></Form.Label>
              {recipients.map((email, index) => (
                <Form.Control
                  key={index}
                  type="email"
                  placeholder={`Recipient ${index + 1}`}
                  value={email}
                  onChange={(e) => {
                    const newRecipients = [...recipients];
                    newRecipients[index] = e.target.value;
                    setRecipients(newRecipients);
                  }}
                  className="mb-2"
                />
              ))}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={updateAlias}>
            Save Changes
          </Button>
          <Button variant="danger" size="sm" onClick={openDeleteModal}>
            <FiTrash2 />
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Alias Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">
            <FiAlertTriangle /> Confirm Deletion
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-danger">
            This action is <strong>irreversible</strong>. Once deleted, the alias cannot be recovered.
          </p>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label><strong>Enter Password to Confirm</strong></Form.Label>
              <Form.Control
                type="password"
                placeholder="Enter app password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
          </Form>
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
