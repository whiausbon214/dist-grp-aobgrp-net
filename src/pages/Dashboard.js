import { Container, Card, Row, Col, Button } from "react-bootstrap";
import { FiMail, FiCloud, FiExternalLink } from "react-icons/fi";
import { SiMailchimp } from "react-icons/si";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const sections = [
    {
      title: "Distribution Group Manager",
      description: "Manage internal email distribution groups.",
      icon: <FiMail size={50} />,
      color: "primary",
      link: "/distribution-groups"
    },
    {
      title: "Cloud Status",
      description: "View real-time cloud infrastructure status.",
      icon: <FiCloud size={50} />,
      color: "success",
      link: "/cloud-status"
    },
    {
      title: "ACA Mass Email List Manager",
      description: "Manage and update your MailChimp mailing list.",
      icon: <SiMailchimp size={50} />,
      color: "warning",
      link: "/aca-email-manager"
    }
  ];

  const quickLinks = [
    { name: "E123", url: "https://aobgenrollment.com/manage/", icon: <FiExternalLink /> },
    { name: "ACA Resource Center", url: "https://aobgagents.com/aca/", icon: <FiExternalLink /> },
    { name: "Contracting Portal", url: "https://agents.aobgrp.com/manage", icon: <FiExternalLink /> },
    { name: "HealthSherpa", url: "https://healthsherpa.com/sessions/new", icon: <FiExternalLink /> },
    { name: "TLD", url: "https://aobg.tldcrm.com/adg/index?limit=100&page=1", icon: <FiExternalLink /> },
    { name: "SmartSheet", url: "https://app.smartsheet.com/", icon: <FiExternalLink /> },
    { name: "Sircon", url: "https://www.sircon.com/login.jsp?accountType=business", icon: <FiExternalLink /> },
    { name: "BIG Background Checks", url: "https://v2.mybig.com/dashboard/page/home", icon: <FiExternalLink /> },
    { name: "Vector One", url: "https://debit-check.com/login", icon: <FiExternalLink /> },
    { name: "Adobe Sign", url: "https://gallagher.na1.adobesign.com/account/homeJS", icon: <FiExternalLink /> },
    { name: "Zendesk", url: "https://aobg.zendesk.com/agent/", icon: <FiExternalLink /> }
  ];

  const adminQuickLinks = [
    { name: "Digital Ocean", url: "https://cloud.digitalocean.com/projects", icon: <FiExternalLink /> },
    { name: "Cloudflare", url: "https://dash.cloudflare.com/", icon: <FiExternalLink /> },
    { name: "aobgagents.com Admin", url: "https://aobgagents.com/manager/", icon: <FiExternalLink /> },
    { name: "BeePro", url: "https://pro.beefree.io/", icon: <FiExternalLink /> },
    { name: "Short.io", url: "https://app.short.io/users/dashboard/links", icon: <FiExternalLink /> }
  ];

  return (
    <Container className="py-5">
      <h2>AOBG Internal Tools Dashboard</h2>

      {/* Feature Sections */}
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

      {/* Quick Links Section */}
      <h4 className="mt-5">Quick Links</h4>
      <Row className="g-3">
        {quickLinks.map((link, index) => (
          <Col key={index} md={3}>
            <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
              <Card className="p-3 text-center shadow-sm">
                {link.icon}
                <Card.Text>{link.name}</Card.Text>
              </Card>
            </a>
          </Col>
        ))}
      </Row>

      <hr className="my-5" />

      {/* Admin Quick Links Section */}
      <h4>Admin Quick Links</h4>
      <Row className="g-3">
        {adminQuickLinks.map((link, index) => (
          <Col key={index} md={3}>
            <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-decoration-none">
              <Card className="p-3 text-center shadow-sm">
                {link.icon}
                <Card.Text>{link.name}</Card.Text>
              </Card>
            </a>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Dashboard;
