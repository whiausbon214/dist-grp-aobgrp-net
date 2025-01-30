import { useState } from "react";
import { Container, Form, Button, Card } from "react-bootstrap";

function Login({ onLogin }) {
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === process.env.REACT_APP_PASSWORD) {
      onLogin();
    } else {
      alert("Incorrect password");
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Card className="p-4 shadow-sm">
        <Card.Body>
          <h2 className="mb-3">Enter Password</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3 w-100">
              Login
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Login;
