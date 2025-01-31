import React from 'react';
import { Container, Grid, Card, CardContent, Typography, Button } from '@mui/joy';
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
      <Typography level="h2" component="h2" gutterBottom>
        AOBG Internal Tools Dashboard
      </Typography>
      <Grid container spacing={2}>
        {sections.map((section, index) => (
          <Grid key={index} item xs={12} sm={6} md={4}>
            <Card variant="outlined" sx={{ height: '100%', bgcolor: section.color }}>
              <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography level="h5" component="h3">
                      {section.title}
                    </Typography>
                    <Typography level="body2">{section.description}</Typography>
                    <Button component={Link} to={section.link} variant="contained" color="primary">
                      Go to {section.title}
                    </Button>
                  </Box>
                  <Box>{section.icon}</Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default Dashboard;
