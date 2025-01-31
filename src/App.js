import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import AppNavbar from "./components/Navbar";
import Login from "./components/Login";
import Dashboard from "./pages/Dashboard";
import DistributionGroups from "./pages/DistributionGroups"; 
import CloudStatus from "./pages/CloudStatus"; // Import the CloudStatus component

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  return (
    <Router>
      <AppNavbar onLogout={() => setAuthenticated(false)} isAuthenticated={authenticated} />
      {authenticated ? (
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/distribution-groups" element={<DistributionGroups />} />
          <Route path="/cloud-status" element={<CloudStatus />} /> {/* Add the new route */}
        </Routes>
      ) : (
        <Login onLogin={() => setAuthenticated(true)} />
      )}
    </Router>
  );
}

export default App;
