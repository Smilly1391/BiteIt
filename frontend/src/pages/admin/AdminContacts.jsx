import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import axios from 'axios';

const AdminContacts = () => {
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/contact', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMessages(res.data);
      } catch (err) {
        setError('Failed to load contact messages.');
      }
    };

    fetchMessages();
  }, []);

  return (
    <div className="p-6">
            <button
        onClick={() => navigate("/admin/dashboard")}
        className="mb-6 flex items-center gap-2 text-sm bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white px-4 py-2 rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition"
      >
        <FaArrowLeft /> Back to Dashboard
      </button>
      <h2 className="text-2xl font-bold mb-4">Contact Messages</h2>
      {error && <p className="text-red-500">{error}</p>}
      <div className="space-y-4">
        {messages.map((msg) => (
          <div key={msg._id} className="p-4 border rounded bg-white dark:bg-gray-800">
            <p><strong>Name:</strong> {msg.name}</p>
            <p><strong>Email:</strong> {msg.email}</p>
            <p><strong>Message:</strong> {msg.message}</p>
            <p><strong>Sent At:</strong> {new Date(msg.createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminContacts;