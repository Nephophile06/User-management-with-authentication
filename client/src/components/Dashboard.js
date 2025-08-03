import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { usersAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import UserTable from './UserTable';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const fetchUsers = async () => {
    try {
      const response = await usersAPI.getUsers();
      setUsers(response.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to load users');
    }
  };

  useEffect(() => {
    fetchUsers().finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUsers();
    setRefreshing(false);
    toast.success('Users refreshed');
  };

  const handleUsersUpdate = () => {
    fetchUsers();
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <div className="dashboard-container">
      <Container fluid>
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="dashboard-header">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h1 className="dashboard-title">User Management Dashboard</h1>
                  <p className="dashboard-subtitle">
                    Welcome, {user?.name}! ({user?.email})
                  </p>
                </div>
                <div className="d-flex gap-2">
                  <Button 
                    variant="outline-primary" 
                    onClick={handleRefresh}
                    disabled={refreshing}
                    className="btn-custom"
                  >
                    {refreshing ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Refreshing...
                      </>
                    ) : (
                      'Refresh'
                    )}
                  </Button>
                  <Button variant="outline-danger" onClick={handleLogout} className="btn-custom">
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        {/* Main Content */}
        <Row>
          <Col>
            <Card className="user-table-card">
              <Card.Header>
                <h5 className="mb-0">Users ({users.length})</h5>
              </Card.Header>
              <Card.Body>
                <UserTable 
                  users={users} 
                  onUsersUpdate={handleUsersUpdate}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard; 