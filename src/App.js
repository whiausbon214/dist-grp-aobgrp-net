import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AppNavbar from "./components/Navbar";
import Dashboard from "./pages/Dashboard";
import DistributionGroups from "./pages/DistributionGroups";
import CloudStatus from "./pages/CloudStatus"; // Import the CloudStatus component
import '@ibm/plex-sans';

function App() {
  return (
    <Router>
      <AppNavbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/distribution-groups" element={<DistributionGroups />} />
        <Route path="/cloud-status" element={<CloudStatus />} /> {/* Add the new route */}
      </Routes>
    </Router>
  );
}

export default App;
