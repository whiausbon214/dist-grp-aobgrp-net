import React from 'react';
import { Grid, Row, Column, Button, Card, CardContent, CardFooter, CardHeader } from '@carbon/react';
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
    <Grid>
      <Row>
        <Column>
          <h2>AOBG Internal Tools Dashboard</h2>
        </Column>
      </Row>
      <Row>
        {sections.map((section, index) => (
          <Column key={index} sm={4}>
            <Card>
              <CardHeader>
                <h3>{section.title}</h3>
              </CardHeader>
              <CardContent>
                <p>{section.description}</p>
                {section.icon}
              </CardContent>
              <CardFooter>
                <Button as={Link} to={section.link} kind="primary">
                  Go to {section.title}
                </Button>
              </CardFooter>
            </Card>
          </Column>
        ))}
      </Row>
    </Grid>
  );
};

export default Dashboard;
