import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import AliasManager from "../components/AliasManager";

const DistributionGroups = () => {
  return (
    <Container>
      <Row className="my-4">
        <Col>
          <h2>Distribution Group Manager</h2>
          <p>Manage internal email distribution groups efficiently.</p>
        </Col>
      </Row>
      <Row>
        <Col>
          <AliasManager />
        </Col>
      </Row>
    </Container>
  );
};

export default DistributionGroups;
