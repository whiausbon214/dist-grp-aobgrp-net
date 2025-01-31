import React from "react";
import { Container, Typography, Box } from '@mui/joy';
import AliasManager from "../components/AliasManager";

const DistributionGroups = () => {
  return (
    <Container sx={{ py: 5 }}>
      <Typography level="h2" component="h2" gutterBottom>
        Distribution Group Manager
      </Typography>
      <Typography level="body1" gutterBottom>
        Manage internal email distribution groups efficiently.
      </Typography>
      <Box>
        <AliasManager />
      </Box>
    </Container>
  );
};

export default DistributionGroups;
