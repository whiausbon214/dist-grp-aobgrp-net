import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiExternalLink, FiMail, FiCloud } from 'react-icons/fi';
import { SiMailchimp } from 'react-icons/si';

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
      link: "/aca-email-manager",
      textColor: "black" // Add this property to customize text color
    }
  ];

  const quickLinks = [
    { name: "E123", url: "https://aobgenrollment.com/manage/", icon: <FiExternalLink size={48} /> },
    { name: "ACA Resource Center", url: "https://aobgagents.com/aca/", icon: <FiExternalLink size={48} /> },
    { name: "Contracting Portal", url: "https://agents.aobgrp.com/manage", icon: <FiExternalLink size={48} /> },
    { name: "HealthSherpa", url: "https://healthsherpa.com/sessions/new", icon: <FiExternalLink size={48} /> },
    { name: "TLD", url: "https://aobg.tldcrm.com/adg/index?limit=100&page=1", icon: <FiExternalLink size={48} /> },
    { name: "SmartSheet", url: "https://app.smartsheet.com/", icon: <FiExternalLink size={48} /> },
    { name: "Sircon", url: "https://www.sircon.com/login.jsp?accountType=business", icon: <FiExternalLink size={48} /> },
    { name: "BIG Background Checks", url: "https://v2.mybig.com/dashboard/page/home", icon: <FiExternalLink size={48} /> },
    { name: "Vector One", url: "https://debit-check.com/login", icon: <FiExternalLink size={48} /> },
    { name: "Adobe Sign", url: "https://gallagher.na1.adobesign.com/account/homeJS", icon: <FiExternalLink size={48} /> },
    { name: "Zendesk", url: "https://aobg.zendesk.com/agent/", icon: <FiExternalLink size={48} /> }
  ];

  const adminQuickLinks = [
    { name: "Digital Ocean", url: "https://cloud.digitalocean.com/projects", icon: <FiExternalLink size={48} /> },
    { name: "Cloudflare", url: "https://dash.cloudflare.com/", icon: <FiExternalLink size={48} /> },
    { name: "aobgagents.com Admin", url: "https://aobgagents.com/manager/", icon: <FiExternalLink size={48} /> },
    { name: "BeePro", url: "https://pro.beefree.io/", icon: <FiExternalLink size={48} /> },
    { name: "Short.io", url: "https://app.short.io/users/dashboard/links", icon: <FiExternalLink size={48} /> }
  ];

  return (
    <Container className="py-5">
      <h2>AOBG Internal Tools Dashboard</h2>

      {/* Feature Sections */}
      <Row className="mt-4">
        {sections.map((section, index) => (
          <Col key={index} md={4} className="mb-4">
            <Card bg={section.color} text={section.textColor || "white"} className="h-100 shadow">
              <Card.Body className="d-flex justify-content-between align-items-center">
                <div>
                  <Card.Title>{section.title}</Card.Title>
                  <Card.Text>{section.description}</Card.Text>
                  <Link to={section.link}>
                    <Button variant="light">Go to {section.title}</Button>
                  </Link>
                </div>
                <div>{section.icon}</div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Quick Links */}
      <Row className="mt-4">
        {quickLinks.map((link, index) => (
          <Col key={index} md={3} className="mb-4">
            <Card className="h-100 shadow">
              <Card.Body className="text-center">
                <div>{link.icon}</div>
                <Card.Title className="mt-2">{link.name}</Card.Title>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  <Button variant="primary">Go to {link.name}</Button>
                </a>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Admin Quick Links */}
      <Row className="mt-4">
        {adminQuickLinks.map((link, index) => (
          <Col key={index} md={3} className="mb-4">
            <Card className="h-100 shadow">
              <Card.Body className="text-center">
                <div>{link.icon}</div>
                <Card.Title className="mt-2">{link.name}</Card.Title>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  <Button variant="primary">Go to {link.name}</Button>
                </a>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Dashboard;
