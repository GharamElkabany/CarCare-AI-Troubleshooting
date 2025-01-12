import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./AdminUsers.module.css";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(4);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // State for Add/Edit User Form
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({
    id: "",
    name: "",
    email: "",
    phone: "",
    password: "",
    role: "user",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:5000/users", {
        withCredentials: true,
      });
      if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else if (response.data.Error) {
        setError(response.data.Error);
      }
      setLoading(false);
    } catch (err) {
      setError("Failed to load users. Please try again later.");
      setLoading(false);
    }
  };

  const searchUsers = async (query) => {
    try {
      const response = await axios.get(
        `http://localhost:5000/users/search?q=${query}`,
        { withCredentials: true }
      );
      if (Array.isArray(response.data)) {
        setUsers(response.data);
        setCurrentPage(1);
      } else {
        setError(response.data.Error);
      }
    } catch (err) {
      setError("Failed to search users. Please try again later.");
    }
  };

  const handleAddEditUser = async () => {
    const url = newUser.id
      ? `http://localhost:5000/users/${newUser.id}`
      : "http://localhost:5000/register";
    const method = newUser.id ? "put" : "post";

    try {
      const response = await axios[method](url, newUser, {
        withCredentials: true,
      });
      if (response.data.Status === "Success") {
        alert(newUser.id ? "User updated successfully" : "User added successfully");
        setShowModal(false);
        setNewUser({ id: "", name: "", email: "", phone: "", password: "", role: "user" });
        fetchUsers();
      } else if (response.data.Error) {
        alert(response.data.Error);
      }
    } catch (err) {
      alert("Failed to save user");
    }
  };

  const handleDeleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        const response = await axios.delete(`http://localhost:5000/users/${id}`, {
          withCredentials: true,
        });
        if (response.data.Status === "Success") {
          alert("User deleted successfully");
          fetchUsers();
        } else if (response.data.Error) {
          alert(response.data.Error);
        }
      } catch (err) {
        alert("Failed to delete user");
      }
    }
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = Array.isArray(users)
    ? users.slice(indexOfFirstUser, indexOfLastUser)
    : [];

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleEditUser = (user) => {
    setShowModal(true);
    setNewUser({ ...user, password: "" });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className={styles.UsersPage}>
      <div className={styles.tableContainer}>
        <div className={styles.headerContainer}>
          <h2 className={styles.pageTitle}>List of Users</h2>
          <input
            type="text"
            placeholder="Search by name, email or contact ..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              searchUsers(e.target.value);
            }}
            className={styles.searchBox}
          />
          <button
            onClick={() => {
              setShowModal(true);
              setNewUser({ id: "", name: "", email: "", phone: "", password: "", role: "user" });
              setSearchQuery("");
            }}
            className={styles.addButton}
          >
            + Add User
          </button>
        </div>

        {showModal && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
              <h3>{newUser.id ? "Edit User" : "Add New User"}</h3>
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
                disabled={!!newUser.id}
              />
              <input
                type="text"
                placeholder="Phone"
                value={newUser.phone}
                onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
              />
              {!newUser.id && (
                <input
                  type="password"
                  placeholder="Password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
              )}
              <select
                value={newUser.role}
                onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
              >
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
              <div className={styles.modalActions}>
                <button onClick={handleAddEditUser} className={styles.submitButton}>
                  Save
                </button>
                <button onClick={() => setShowModal(false)} className={styles.cancelButton}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {window.innerWidth <= 768 ? (
          <div>
            {currentUsers.map((user) => (
              <div key={user.id} className={styles.userCard}>
                <div className={styles.userDetails}>
                  <strong>Name:</strong> {user.name}
                  <strong>Email:</strong> {user.email}
                  <strong>Contact:</strong> {user.phone}
                  <strong>Role:</strong> {user.role}
                </div>
                <div className={styles.actions}>
                  <button onClick={() => handleEditUser(user)} className={styles.actionButton}>
                    ✏️
                  </button>
                  <button onClick={() => handleDeleteUser(user.id)} className={styles.actionButton}>
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <table className={styles.userTable}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Contact</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.phone}</td>
                  <td>{user.role}</td>
                  <td>
                    <button onClick={() => handleEditUser(user)} className={styles.actionButton}>
                      ✏️
                    </button>
                    <button onClick={() => handleDeleteUser(user.id)} className={styles.actionButton}>
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

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
