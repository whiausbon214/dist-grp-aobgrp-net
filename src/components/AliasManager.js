import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Button, DataTable, Modal, TextInput, Form, FormGroup, InlineNotification, Grid, Row, Column } from '@carbon/react';
import { Edit16, TrashCan16, WarningAltFilled16 } from '@carbon/icons-react';

const AliasManager = () => {
  const [aliases, setAliases] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [aliasName, setAliasName] = useState("");
  const [recipients, setRecipients] = useState(Array(10).fill(""));
  const [password, setPassword] = useState("");
  const [selectedAlias, setSelectedAlias] = useState(null);

  const API_BASE_URL = "https://api.forwardemail.net/v1";
  const API_KEY = process.env.REACT_APP_API_KEY;
  const DOMAIN_NAME = process.env.REACT_APP_DOMAIN_NAME;
  const APP_PASSWORD = process.env.REACT_APP_PASSWORD;

  // Fetch aliases from the API
  const fetchAliases = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/domains/${DOMAIN_NAME}/aliases`, {
        auth: { username: API_KEY, password: "" }
      });
      setAliases(response.data);
    } catch (error) {
      console.error("Error fetching aliases:", error);
    }
  }, [API_BASE_URL, API_KEY, DOMAIN_NAME]);

  useEffect(() => {
    fetchAliases();
  }, [fetchAliases]);

  // Filter out the alias 'commissions@aobgrp.com'
  const filteredAliases = aliases.filter(alias => alias.name !== '*');

  return (
    <Grid>
      <Row>
        <Column>
          <Button onClick={() => setShowCreateModal(true)}>Create Alias</Button>
        </Column>
      </Row>
      <Row>
        <Column>
          <DataTable
            rows={filteredAliases}
            headers={[
              { key: 'name', header: 'Alias' },
              { key: 'recipients', header: 'Recipients' },
              { key: 'actions', header: 'Actions' }
            ]}
            render={({ rows, headers, getHeaderProps, getRowProps }) => (
              <TableContainer title="Aliases">
                <Table>
                  <TableHead>
                    <TableRow>
                      {headers.map(header => (
                        <TableHeader {...getHeaderProps({ header })}>
                          {header.header}
                        </TableHeader>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map(row => (
                      <TableRow {...getRowProps({ row })}>
                        {row.cells.map(cell => (
                          <TableCell key={cell.id}>{cell.value}</TableCell>
                        ))}
                        <TableCell>
                          <Button
                            kind="ghost"
                            renderIcon={Edit16}
                            onClick={() => { setSelectedAlias(row); setShowEditModal(true); }}
                          >
                            Edit
                          </Button>
                          <Button
                            kind="danger--ghost"
                            renderIcon={TrashCan16}
                            onClick={() => { setSelectedAlias(row); setShowDeleteModal(true); }}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          />
        </Column>
      </Row>

      <Modal open={showCreateModal} onRequestClose={() => setShowCreateModal(false)} modalHeading="Create Alias">
        <Form>
          <FormGroup legendText="">
            <TextInput
              id="alias-name"
              labelText="Alias Name"
              value={aliasName}
              onChange={(e) => setAliasName(e.target.value)}
            />
            <FormGroup legendText="Recipients">
              {recipients.map((recipient, index) => (
                <TextInput
                  key={index}
                  id={`recipient-${index}`}
                  labelText={`Recipient ${index + 1}`}
                  value={recipient}
                  onChange={(e) => {
                    const newRecipients = [...recipients];
                    newRecipients[index] = e.target.value;
                    setRecipients(newRecipients);
                  }}
                />
              ))}
            </FormGroup>
          </FormGroup>
          <Button onClick={() => { /* handle create alias */ }}>Create</Button>
        </Form>
      </Modal>

      <Modal open={showEditModal} onRequestClose={() => setShowEditModal(false)} modalHeading="Edit Alias">
        <Form>
          <FormGroup legendText="">
            <TextInput
              id="alias-name"
              labelText="Alias Name"
              value={aliasName}
              onChange={(e) => setAliasName(e.target.value)}
            />
            <FormGroup legendText="Recipients">
              {recipients.map((recipient, index) => (
                <TextInput
                  key={index}
                  id={`recipient-${index}`}
                  labelText={`Recipient ${index + 1}`}
                  value={recipient}
                  onChange={(e) => {
                    const newRecipients = [...recipients];
                    newRecipients[index] = e.target.value;
                    setRecipients(newRecipients);
                  }}
                />
              ))}
            </FormGroup>
          </FormGroup>
          <Button onClick={() => { /* handle edit alias */ }}>Save</Button>
        </Form>
      </Modal>

      <Modal open={showDeleteModal} onRequestClose={() => setShowDeleteModal(false)} modalHeading="Confirm Deletion">
        <InlineNotification
          kind="error"
          title="Confirm Deletion"
          subtitle="This action is irreversible. Once deleted, the alias cannot be recovered."
          hideCloseButton
        />
        <TextInput
          id="confirm-password"
          labelText="Enter Password to Confirm"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button kind="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
        <Button kind="danger" onClick={deleteAlias}>Confirm Delete</Button>
      </Modal>
    </Grid>
  );
};

export default AliasManager;