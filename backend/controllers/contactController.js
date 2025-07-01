import Contact from '../models/Contact.js';

export const createContactMessage = async (req, res) => {
  const { name, email, phone, location, interest, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: 'Name, email, and message are required.' });
  }

  try {
    const contact = new Contact({ name, email, phone, location, interest, message });
    await contact.save();
    res.status(201).json({ message: 'Contact message submitted successfully.' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error while saving contact message.' });
  }
};

export const getAllContactMessages = async (req, res) => {
  try {
    const messages = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json(messages);
  } catch (error) {
    console.error('❌ Error fetching contact messages:', error); // Add this
    res.status(500).json({ message: 'Failed to retrieve contact messages.' });
  }
};
