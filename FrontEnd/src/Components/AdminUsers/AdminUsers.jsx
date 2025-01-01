import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './AdminUsers.module.css';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(3);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);  

  // State for Add User Form
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  // Fetch users data
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users", {
        withCredentials: true,
      });
      setUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load users. Please try again later.");
      setLoading(false);
    }
  };

  // Add user handler
  const handleAddUser = async () => {
    try {
      const response = await axios.post("http://localhost:5000/register", newUser, {
        withCredentials: true,
      });
      if (response.data.Status === "Success") {
        alert("User added successfully");
        fetchUsers(); // Fetch updated user list
        setShowModal(false); // Hide modal
        setNewUser({ name: "", email: "", phone: "", password: "" }); // Reset form
      } else {
        alert(response.data.Error);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to add user");
    }
  };

  // Get current users for the current page
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.UsersPage}>
      <div className={styles.tableContainer}>

        <div className={styles.headerContainer}>
          <h2 className={styles.pageTitle}>List of Users</h2>
          {/* Add User Button */}
          <button onClick={() => setShowModal(true)} className={styles.addButton}>
            + Add User
          </button>
        </div>

        {/* Add User Modal */}
        {showModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h3>Add New User</h3>
              <input
                type="text"
                placeholder="Name"
                value={newUser.name}
                onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              />
              <input
                type="email"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              />
              <input
                type="text"
                placeholder="Phone"
                value={newUser.phone}
                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
              />
              <input
                type="password"
                placeholder="Password"
                value={newUser.password}
                onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              />
              <div className={styles.modalActions}>
                <button onClick={handleAddUser} className={styles.submitButton}>
                  Save
                </button>
                <button onClick={() => setShowModal(false)} className={styles.cancelButton}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        <table className={styles.userTable}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Contact</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>
                  <button className={styles.viewButton}>...</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div className={styles.pagination}>
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className={styles.paginationButton}
          >
            Back
          </button>
          <span>Page {currentPage}</span>
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={indexOfLastUser >= users.length}
            className={styles.paginationButton}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
