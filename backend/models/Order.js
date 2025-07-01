import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  // your schema fields like user, products, amount, etc.
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);
export default Order;
