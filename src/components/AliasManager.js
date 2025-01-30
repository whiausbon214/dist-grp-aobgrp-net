import { useState, useEffect } from "react";
import axios from "axios";
import { Container, Table, Form, Button, Row, Col } from "react-bootstrap";

function AliasManager() {
  const [aliases, setAliases] = useState([]);
  const [aliasName, setAliasName] = useState("");
  const [recipients, setRecipients] = useState("");

  const API_BASE_URL = "https://api.forwardemail.net/v1";
  const API_KEY = process.env.REACT_APP_API_KEY;
  const DOMAIN_NAME = process.env.REACT_APP_DOMAIN_NAME;

  useEffect(() => {
    fetchAliases();
  }, []);

  // Fetch aliases from API
  const fetchAliases = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/domains/${DOMAIN_NAME}/aliases`,
        {
          auth: {
            username: API_KEY,
            password: "",
          },
        }
      );
      setAliases(response.data);
    } catch (error) {
      console.error("Error fetching aliases:", error);
    }
  };

  // Create a new alias
  const createAlias = async () => {
    try {
      await axios.post(
        `${API_BASE_URL}/domains/${DOMAIN_NAME}/aliases`,
        {
          name: aliasName,
          recipients: recipients.split(",").map((email) => email.trim()),
        },
        {
          auth: {
            username: API_KEY,
            password: "",
          },
        }
      );
      fetchAliases();
      setAliasName("");
      setRecipients("");
    } catch (error) {
      console.error("Error creating alias:", error);
    }
  };

  // Delete an alias
  const deleteAlias = async (id) => {
    try {
      await axios.delete(
        `${API_BASE_URL}/domains/${DOMAIN_NAME}/aliases/${id}`,
        {
          auth: {
            username: API_KEY,
            password: "",
          },
        }
      );
      fetchAliases();
    } catch (error) {
      console.error("Error deleting alias:", error);
    }
  };

  return (
    <Container className="py-5">
      <h2>Email Alias Manager</h2>

      {/* Alias Creation Form */}
      <Form className="mb-4">
        <Row>
          <Col>
            <Form.Control
              type="text"
              placeholder="Alias Name"
              value={aliasName}
              onChange={(e) => setAliasName(e.target.value)}
            />
          </Col>
          <Col>
            <Form.Control
              type="text"
              placeholder="Recipients (comma-separated)"
              value={recipients}
              onChange={(e) => setRecipients(e.target.value)}
            />
          </Col>
          <Col>
            <Button variant="success" onClick={createAlias}>
              Create Alias
            </Button>
          </Col>
        </Row>
      </Form>

      {/* Alias List */}
      <h4>Existing Aliases</h4>
      <Table striped bordered hover>
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
                <Button variant="danger" onClick={() => deleteAlias(alias.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default AliasManager;
