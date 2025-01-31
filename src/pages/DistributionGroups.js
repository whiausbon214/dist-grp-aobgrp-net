import React from "react";
import { Grid, Row, Column, ContentSwitcher, Switch, Button, TextInput, Form, FormGroup, InlineNotification } from '@carbon/react';
import AliasManager from "../components/AliasManager";

const DistributionGroups = () => {
  return (
    <Grid>
      <Row>
        <Column>
          <h2>Distribution Group Manager</h2>
          <p>Manage internal email distribution groups efficiently.</p>
        </Column>
      </Row>
      <Row>
        <Column>
          <AliasManager />
        </Column>
      </Row>
    </Grid>
  );
};

export default DistributionGroups;
