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
    </Container>
  );
}

export default Dashboard;
