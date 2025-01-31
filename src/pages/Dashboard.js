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
    <Container>
      <Row className="my-4">
        <Col>
          <h2>AOBG Internal Tools Dashboard</h2>
        </Col>
      </Row>
      <Row>
        {sections.map((section, index) => (
          <Col key={index} sm={4}>
            <Card className="mb-4">
              <Card.Header>
                <h3>{section.title}</h3>
              </Card.Header>
              <Card.Body>
                <Card.Text>{section.description}</Card.Text>
                {section.icon}
              </Card.Body>
              <Card.Footer>
                <Button as={Link} to={section.link} variant="primary">
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
