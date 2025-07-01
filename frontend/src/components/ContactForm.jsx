import React, { useState } from 'react';
import axios from 'axios';

const ContactForm = () => {
  const [form, setForm] = useState({
    name: '', email: '', phone: '', location: '', interest: '', message: ''
  });
   const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async(e) => {
    e.preventDefault();
     setLoading(true);
    setError('');
    setSuccess('');
    try {
      const response = await axios.post('http://localhost:5000/api/contact', form);
      if (response.data.message) {
        setSuccess(response.data.message);
        setForm({ name: '', email: '', phone: '', location: '', interest: '', message: '' });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Submission failed.');
    } finally {
      setLoading(false);
    }
  };

  const inputClasses = "p-2 rounded bg-white text-black dark:bg-blue-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-300";

  return (
    <form onSubmit={handleSubmit} className="bg-blue-900 text-white p-8 rounded-xl h-[70vh] w-full max-w-xl">
      {success && <p className="text-green-400">{success}</p>}
      {error && <p className="text-red-400">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <input type="text" name="name" placeholder="Full Name" value={form.name} onChange={handleChange} required className={inputClasses} />
        <input type="email" name="email" placeholder="Email Address" value={form.email} onChange={handleChange} required className={inputClasses} />
        <input type="tel" name="phone" placeholder="Phone Number" value={form.phone} onChange={handleChange} className={inputClasses} />
        <input type="text" name="location" placeholder="Location" value={form.location} onChange={handleChange} className={inputClasses} />
      </div>
      <select name="interest" value={form.interest} onChange={handleChange} required className={`w-full mb-4 ${inputClasses}`}>
        <option value="">What Expertise You're Interested In</option>
        <option value="engineering">Engineering</option>
        <option value="design">Design</option>
        <option value="development">Development</option>
      </select>
      <textarea
        name="message"
        rows="4"
        value={form.message}
        onChange={handleChange}
        placeholder="Tell us about your project"
        required
        className={`w-full mb-4 ${inputClasses}`}
      ></textarea>
      <button type="submit" disabled={loading} className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 flex items-center gap-2">
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
};

export default ContactForm;