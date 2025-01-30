import { useState } from "react";
import Login from "./components/Login";
import AliasManager from "./components/AliasManager";
import AppNavbar from "./components/Navbar";
import { Container } from "react-bootstrap";

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  return (
    <div>
      {authenticated ? (
        <>
          <AppNavbar onLogout={() => setAuthenticated(false)} />
          <Container>
            <AliasManager />
          </Container>
        </>
      ) : (
        <Login onLogin={() => setAuthenticated(true)} />
      )}
    </div>
  );
}

export default App;
