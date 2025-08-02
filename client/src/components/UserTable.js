import React, { useState } from 'react';
import { Table, Button, Badge, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { usersAPI } from '../services/api';

const UserTable = ({ users, onUsersUpdate }) => {
  // State for selected users (REQUIREMENT #4 - Multiple Selection)
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Handle select all checkbox (REQUIREMENT #4)
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedUsers(users.map(user => user.id));
    } else {
      setSelectedUsers([]);
    }
  };

  // Handle individual user selection (REQUIREMENT #4)
  const handleUserSelection = (userId, checked) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId]);
    } else {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    }
  };

  // Check if all users are selected
  const isAllSelected = users.length > 0 && selectedUsers.length === users.length;

  // Block selected users
  const handleBlockUsers = async () => {
    if (selectedUsers.length === 0) {
      toast.warning('Please select users to block');
      return;
    }

    setLoading(true);
    try {
      await usersAPI.blockUsers(selectedUsers);
      toast.success('Users blocked successfully');
      setSelectedUsers([]);
      onUsersUpdate();
    } catch (error) {
      toast.error('Failed to block users');
    } finally {
      setLoading(false);
    }
  };

  // Unblock selected users
  const handleUnblockUsers = async () => {
    if (selectedUsers.length === 0) {
      toast.warning('Please select users to unblock');
      return;
    }

    setLoading(true);
    try {
      await usersAPI.unblockUsers(selectedUsers);
      toast.success('Users unblocked successfully');
      setSelectedUsers([]);
      onUsersUpdate();
    } catch (error) {
      toast.error('Failed to unblock users');
    } finally {
      setLoading(false);
    }
  };

  // Delete selected users
  const handleDeleteUsers = async () => {
    if (selectedUsers.length === 0) {
      toast.warning('Please select users to delete');
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedUsers.length} user(s)?`)) {
      return;
    }

    setLoading(true);
    try {
      await usersAPI.deleteUsers(selectedUsers);
      toast.success('Users deleted successfully');
      setSelectedUsers([]);
      onUsersUpdate();
    } catch (error) {
      toast.error('Failed to delete users');
    } finally {
      setLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    return new Date(dateString).toLocaleString();
  };

  return (
    <div>
      {/* Toolbar with action buttons (REQUIREMENT #2) */}
      <div className="mb-3 d-flex gap-2">
        <Button 
          variant="warning" 
          onClick={handleBlockUsers} 
          disabled={loading || selectedUsers.length === 0}
        >
          Block ({selectedUsers.length})
        </Button>
        
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip>Unblock Users</Tooltip>}
        >
          <Button 
            variant="success" 
            onClick={handleUnblockUsers} 
            disabled={loading || selectedUsers.length === 0}
          >
            <i className="bi bi-unlock"></i> Unblock
          </Button>
        </OverlayTrigger>
        
        <OverlayTrigger
          placement="top"
          overlay={<Tooltip>Delete Users</Tooltip>}
        >
          <Button 
            variant="danger" 
            onClick={handleDeleteUsers} 
            disabled={loading || selectedUsers.length === 0}
          >
            <i className="bi bi-trash"></i> Delete
          </Button>
        </OverlayTrigger>
      </div>

      {/* User Table (REQUIREMENT #2) */}
      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>
              {/* Select All Checkbox (REQUIREMENT #4) */}
              <input
                type="checkbox"
                checked={isAllSelected}
                onChange={(e) => handleSelectAll(e.target.checked)}
                className="form-check-input"
              />
            </th>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Last Login</th>
            <th>Registration Time</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                {/* Individual User Checkbox (REQUIREMENT #4) */}
                <input
                  type="checkbox"
                  checked={selectedUsers.includes(user.id)}
                  onChange={(e) => handleUserSelection(user.id, e.target.checked)}
                  className="form-check-input"
                />
              </td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <Badge bg={user.status === 'active' ? 'success' : 'danger'}>
                  {user.status}
                </Badge>
              </td>
              <td>{formatDate(user.last_login)}</td>
              <td>{formatDate(user.registration_time)}</td>
            </tr>
          ))}
        </tbody>
      </Table>

      {users.length === 0 && (
        <div className="text-center text-muted py-4">
          No users found
        </div>
      )}
    </div>
  );
};

export default UserTable; 