import Order from '../models/Order.js';

export const createOrder = async (req, res) => {
  const order = await Order.create(req.body);
  res.status(201).json(order);
};

export const getOrders = async (req, res) => {
  const orders = await Order.find().populate('user');
  res.json(orders);
};
