import express from 'express';
import Order from '../models/Order.js'; 
import { protect, admin } from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/', protect, async (req, res) => {
  const { orderItems, totalPrice } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400).json({ message: 'No order items' });
  } else {
    const order = new Order({
      user: req.user._id,
      items: orderItems,
      totalPrice,
    });

    const createdOrder = await order.save();
    res.status(201).json(createdOrder);
  }
});

router.get('/:id', protect, async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'username email');

  if (order) {
    if (order.user._id.toString() === req.user._id.toString() || req.user.role === 'admin') {
      res.json(order);
    } else {
      res.status(403).json({ message: 'Not authorized to view this order' });
    }
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
});

router.get('/', protect, admin, async (req, res) => {
  const orders = await Order.find({}).populate('user', 'username email');
  res.json(orders);
});

router.get('/myorders', protect, async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).populate('user', 'username email');
  res.json(orders);
});

router.put('/:id/status', protect, admin, async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.status = req.body.status || order.status;
    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
});

router.delete('/:id', protect, admin, async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    await order.deleteOne();
    res.json({ message: 'Order removed' });
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
});

export default router;