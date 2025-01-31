import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Table, Modal, Form, Pagination, InputGroup, FormControl } from 'react-bootstrap';
import { FiEdit, FiTrash2, FiSearch } from 'react-icons/fi';
import axios from 'axios';

const MailChimpManager = () => {
  const [members, setMembers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [newMember, setNewMember] = useState({ firstName: '', lastName: '', email: '' });

  useEffect(() => {
    fetchMembers();
  }, [currentPage, searchTerm]);

  const fetchMembers = async () => {
    try {
      const response = await axios.get('/api/mailchimp/members', {
        params: { page: currentPage, search: searchTerm }
      });
      setMembers(response.data.members);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const handleAddMember = async () => {
    try {
      await axios.post('/api/mailchimp/members', newMember);
      setShowAddModal(false);
      fetchMembers();
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  const handleEditMember = async () => {
    try {
      await axios.put(`/api/mailchimp/members/${selectedMember.id}`, selectedMember);
      setShowEditModal(false);
      fetchMembers();
    } catch (error) {
      console.error('Error editing member:', error);
    }
  };

  const handleUnsubscribeMember = async () => {
    try {
      await axios.delete(`/api/mailchimp/members/${selectedMember.id}`);
      setShowEditModal(false);
      fetchMembers();
    } catch (error) {
      console.error('Error unsubscribing member:', error);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <Container fluid className="p-4 bg-light">
      <Row className="mb-4">
        <Col>
          <h2 className="text-center">MailChimp Contact Manager</h2>
          <Button variant="primary" onClick={() => setShowAddModal(true)} className="mb-3">
            Add New Member
          </Button>
        </Col>
      </Row>
      <Row className="mb-4">
        <Col>
          <InputGroup>
            <FormControl
              placeholder="Search members"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <InputGroup.Append>
              <Button variant="outline-secondary">
                <FiSearch />
              </Button>
            </InputGroup.Append>
          </InputGroup>
        </Col>
      </Row>
      <Row>
        <Col>
          <Table striped bordered hover responsive className="bg-white">
            <thead className="thead-dark">
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id}>
                  <td>{member.firstName}</td>
                  <td>{member.lastName}</td>
                  <td>{member.email}</td>
                  <td>
                    <Button variant="outline-primary" size="sm" onClick={() => { setSelectedMember(member); setShowEditModal(true); }} className="mr-2">
                      <FiEdit />
                    </Button>
                    <Button variant="outline-danger" size="sm" onClick={() => { setSelectedMember(member); handleUnsubscribeMember(); }}>
                      <FiTrash2 />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination>
            {[...Array(totalPages).keys()].map((page) => (
              <Pagination.Item key={page + 1} active={page + 1 === currentPage} onClick={() => handlePageChange(page + 1)}>
                {page + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </Col>
      </Row>

      {/* Add Member Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Member</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="firstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                value={newMember.firstName}
                onChange={(e) => setNewMember({ ...newMember, firstName: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="lastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                value={newMember.lastName}
                onChange={(e) => setNewMember({ ...newMember, lastName: e.target.value })}
              />
            </Form.Group>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={newMember.email}
                onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
              />
            </Form.Group>
            <Button variant="primary" onClick={handleAddMember}>
              Add Member
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Edit Member Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Member</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedMember && (
            <Form>
              <Form.Group controlId="firstName">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedMember.firstName}
                  onChange={(e) => setSelectedMember({ ...selectedMember, firstName: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="lastName">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  value={selectedMember.lastName}
                  onChange={(e) => setSelectedMember({ ...selectedMember, lastName: e.target.value })}
                />
              </Form.Group>
              <Form.Group controlId="email">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  value={selectedMember.email}
                  onChange={(e) => setSelectedMember({ ...selectedMember, email: e.target.value })}
                />
              </Form.Group>
              <Button variant="primary" onClick={handleEditMember}>
                Save Changes
              </Button>
              <Button variant="danger" className="ml-2" onClick={handleUnsubscribeMember}>
                Unsubscribe
              </Button>
            </Form>
          )}
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default MailChimpManager;