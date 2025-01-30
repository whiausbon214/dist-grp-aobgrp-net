import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Button, Table, Modal, Form } from 'react-bootstrap';

const AliasManager = () => {
  const [aliases, setAliases] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [aliasName, setAliasName] = useState("");
  const [recipients, setRecipients] = useState(Array(10).fill(""));

  const API_BASE_URL = "https://api.forwardemail.net/v1";
  const API_KEY = process.env.REACT_APP_API_KEY;
  const DOMAIN_NAME = process.env.REACT_APP_DOMAIN_NAME;

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

  const createAlias = async () => {
    const filteredRecipients = recipients.filter(email => email.trim() !== ""); // Remove empty fields

    try {
      await axios.post(
        `${API_BASE_URL}/domains/${DOMAIN_NAME}/aliases`,
        { name: aliasName, recipients: filteredRecipients },
        { auth: { username: API_KEY, password: "" } }
      );
      fetchAliases();
      setShowModal(false);
      setAliasName("");
      setRecipients(Array(10).fill(""));
    } catch (error) {
      console.error("Error creating alias:", error);
    }
  };

  const deleteAlias = async (aliasName) => {
    try {
      await axios.delete(`${API_BASE_URL}/domains/${DOMAIN_NAME}/aliases/${aliasName}`, {
        auth: { username: API_KEY, password: "" }
      });
      fetchAliases();
    } catch (error) {
      console.error("Error deleting alias:", error);
    }
  };

  useEffect(() => {
    fetchAliases();
  }, []);

  return (
    <Container className="py-5">
      <h2>Email Alias Manager</h2>

      {/* Open Modal Button */}
      <Button variant="primary" className="mb-3" onClick={() => setShowModal(true)}>
        Create Alias
      </Button>

      {/* Alias List */}
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
            <tr key={alias.name}>
              <td>{alias.name}</td>
              <td>{alias.recipients.join(", ")}</td>
              <td>
                <Button variant="danger" onClick={() => deleteAlias(alias.name)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Create Alias</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* Alias Name Field */}
            <Form.Group className="mb-3">
              <Form.Label>Alias Name</Form.Label>
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
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={createAlias}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default AliasManager;
