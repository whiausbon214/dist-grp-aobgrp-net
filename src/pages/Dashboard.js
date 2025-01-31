import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FiMail, FiCloud } from 'react-icons/fi';
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
    <Container fluid className="p-4 bg-light">
      <Row className="mb-4">
        <Col>
          <h2 className="text-center">AOBG Internal Tools Dashboard</h2>
        </Col>
      </Row>
      <Row>
        {sections.map((section, index) => (
          <Col key={index} sm={12} md={6} lg={4} className="mb-4">
            <Card className={`h-100 border-${section.color}`}>
              <Card.Header className={`bg-${section.color} text-white`}>
                <h3 className="mb-0">{section.title}</h3>
              </Card.Header>
              <Card.Body className="d-flex flex-column align-items-center">
                {section.icon}
                <Card.Text className="mt-3 text-center">{section.description}</Card.Text>
              </Card.Body>
              <Card.Footer className="text-center">
                <Button as={Link} to={section.link} variant={section.color}>
                  Go to {section.title}
                </Button>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Dashboard;
