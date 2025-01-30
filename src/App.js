import { useState } from "react";
import Login from "./components/Login";
import AliasManager from "./components/AliasManager";
import { Container } from "react-bootstrap";

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  return (
    <Container>
      {authenticated ? <AliasManager /> : <Login onLogin={() => setAuthenticated(true)} />}
    </Container>
  );
}

export default App;
