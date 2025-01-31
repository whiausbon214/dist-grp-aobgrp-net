# AOBG Internal Tools - Project Notes

## 📌 Overview
This project is a **React-based web application** for managing AOBG internal tools. The app features:
- A **Dashboard** with **card-style navigation**.
- Sections for **Distribution Group Management, Cloud Status, and ACA Email List Management**.
- **Quick Links** and **Admin Quick Links** for easy navigation.
- **SB Admin Pro** inspired UI using Bootstrap.

---

## 📌 Rebranding & Features
### 🔹 **Rebranded to AOBG Internal Tools**
- **Navbar Title:** AOBG Internal Tools
- **Dashboard Page:** Contains colored **cards** linking to different sections.

### 🔹 **Dashboard Sections**
| Section | Icon | Description |
|---------|------|-------------|
| **Distribution Group Manager** | 📧 Envelope | Manages internal email distribution groups. |
| **Cloud Status** | ☁️ Cloud/Network/Server | Displays real-time AOBG cloud infrastructure status. |
| **ACA Mass Email List Manager** | 📨 Mailchimp Logo | Allows adding people to a MailChimp mailing list. |

### 🔹 **Quick Links Section**
| Name | URL |
|------|-----|
| **E123** | [E123](https://aobgenrollment.com/manage/) |
| **ACA Resource Center** | [ACA Resource Center](https://aobgagents.com/aca/) |
| **Contracting Portal Back Office** | [Contracting Portal](https://agents.aobgrp.com/manage) |
| **HealthSherpa** | [HealthSherpa](https://healthsherpa.com/sessions/new) |
| **TLD** | [TLD](https://aobg.tldcrm.com/adg/index?limit=100&page=1) |
| **SmartSheet** | [SmartSheet](https://app.smartsheet.com/workspaces/) |
| **Sircon** | [Sircon](https://www.sircon.com/login.jsp?accountType=business) |
| **BIG Background Checks** | [BIG Background Checks](https://v2.mybig.com/dashboard/page/home) |
| **Vector One** | [Vector One](https://debit-check.com/login) |
| **Adobe Sign** | [Adobe Sign](https://gallagher.na1.adobesign.com/account/homeJS) |
| **Zendesk** | [Zendesk](https://aobg.zendesk.com/agent//) |

### 🔹 **Admin Quick Links Section**
| Name | URL |
|------|-----|
| **Digital Ocean** | [Digital Ocean](https://cloud.digitalocean.com/projects) |
| **Cloudflare** | [Cloudflare](https://dash.cloudflare.com/) |
| **aobgagents.com Admin** | [AOBG Admin](https://aobgagents.com/manager/) |
| **BeePro** | [BeePro](https://pro.beefree.io/) |
| **Short.io** | [Short.io](https://app.short.io/users/dashboard/links) |

---

## 📌 Code Files

### 🔹 **Navbar Component**
📄 `src/components/Navbar.js`
```jsx
import { Navbar, Container, Button, Image } from "react-bootstrap";
import { FiLogOut } from "react-icons/fi";

function AppNavbar({ onLogout }) {
  return (
    <Navbar bg="dark" variant="dark" className="py-3 shadow-sm">
      <Container>
        <Navbar.Brand className="d-flex align-items-center">
          <Image src="/logo.png" alt="App Logo" height={40} className="me-2" />
          AOBG Internal Tools
        </Navbar.Brand>
        <Button variant="outline-light" onClick={onLogout} className="d-flex align-items-center">
          <FiLogOut size={20} className="me-2" /> Logout
        </Button>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
```

---

### 🔹 **Dashboard Page**
📄 `src/pages/Dashboard.js`
```jsx
import { Container, Card, Row, Col, Button } from "react-bootstrap";
import { FiMail, FiCloud, FiUsers, FiExternalLink } from "react-icons/fi";
import { SiMailchimp } from "react-icons/si";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const sections = [
    { title: "Distribution Group Manager", description: "Manage internal email distribution groups.", icon: <FiMail size={50} />, color: "primary", link: "/distribution-groups" },
    { title: "Cloud Status", description: "View real-time cloud infrastructure status.", icon: <FiCloud size={50} />, color: "success", link: "/cloud-status" },
    { title: "ACA Mass Email List Manager", description: "Manage and update your MailChimp mailing list.", icon: <SiMailchimp size={50} />, color: "warning", link: "/aca-email-manager" }
  ];

  return (
    <Container className="py-5">
      <h2>AOBG Internal Tools Dashboard</h2>
      <Row className="mt-4">
        {sections.map((section, index) => (
          <Col key={index} md={4} className="mb-4">
            <Card bg={section.color} text="white" className="h-100 shadow">
              <Card.Body className="d-flex justify-content-between align-items-center">
                <div>
                  <Card.Title>{section.title}</Card.Title>
                  <Card.Text>{section.description}</Card.Text>
                  <Link to={section.link}>
                    <Button variant="light">Go to {section.title}</Button>
                  </Link>
                </div>
                {section.icon}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Dashboard;
```

---

### 🔹 **Routing for New Pages**
📄 `src/App.js`
```jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import AppNavbar from "./components/Navbar";
import Login from "./components/Login";
import Dashboard from "./pages/Dashboard";
import AliasManager from "./pages/DistributionGroups";

function App() {
  const [authenticated, setAuthenticated] = useState(false);

  return (
    <Router>
      <AppNavbar onLogout={() => setAuthenticated(false)} />
      {authenticated ? (
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/distribution-groups" element={<AliasManager />} />
        </Routes>
      ) : (
        <Login onLogin={() => setAuthenticated(true)} />
      )}
    </Router>
  );
}

export default App;
```

---

### ✅ **Final Notes**
- **AOBG Internal Tools Dashboard** created.
- **Sections moved into separate pages**.
- **Added Quick Links & Admin Links sections**.
- **Navbar updated to reflect the new branding**.

---
