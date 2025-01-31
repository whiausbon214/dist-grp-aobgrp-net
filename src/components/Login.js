import { useState } from "react";
import { Container, Form, Button, Card, Image } from "react-bootstrap";
import "./Login.css"; // Import the CSS file

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
    <Container className="login-container">
      <Card className="p-4 shadow-lg text-center" style={{ width: "350px" }}>
        <Image src="/icon.svg" alt="App Logo" height={60} className="mb-3" />
        <h3 className="mb-3">AOBG Email Manager</h3>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4">
            <Form.Label><strong>Enter Password</strong></Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100">
            Login
          </Button>
        </Form>
      </Card>
    </Container>
  );
}

export default Login;
