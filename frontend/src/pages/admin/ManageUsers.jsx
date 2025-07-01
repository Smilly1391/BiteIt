import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";

const ManageUsers = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [selectedEmail, setSelectedEmail] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/users", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(res.data);
      } catch (err) {
        console.error("Error loading users:", err);
      }
    };

    fetchUsers();
  }, []);

  const confirmDelete = (email) => setSelectedEmail(email);

const handleDelete = async () => {
  try {
    const token = localStorage.getItem("token");
    const userToDelete = users.find((u) => u.email === selectedEmail);

    if (!userToDelete || !userToDelete._id) {
      alert("Invalid user data.");
      return;
    }

    await axios.delete(`http://localhost:5000/api/users/${userToDelete._id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const filtered = users.filter((u) => u._id !== userToDelete._id);
    setUsers(filtered);
    setSelectedEmail(null);
  } catch (error) {
    console.error("Delete failed:", error);
    alert("Failed to delete user.");
  }
};


  return (
    <div className="min-h-screen bg-gray-100 p-8 dark:bg-gray-900">
      <button
        onClick={() => navigate("/admin/dashboard")}
        className="mb-6 flex items-center gap-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
      >
        <FaArrowLeft /> Back to Dashboard
      </button>

      <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
        Manage Users
      </h2>

      {users.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-300">No users found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white dark:bg-gray-800 shadow rounded-lg">
            <thead>
              <tr className="text-left bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200">
                <th className="p-3">Email</th>
                <th className="p-3">Username</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b dark:border-gray-700">
                  <td className="p-3">{user.email}</td>
                  <td className="p-3">{user.username}</td>
                  <td className="p-3">
                    <button
                      onClick={() => confirmDelete(user.email)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {selectedEmail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
              Confirm Delete
            </h3>
            <p className="mb-6 text-sm text-gray-600 dark:text-gray-300">
              Are you sure you want to delete this user?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                Delete
              </button>
              <button
                onClick={() => setSelectedEmail(null)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
