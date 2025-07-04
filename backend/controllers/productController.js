import Product from '../models/Product.js';

export const getAllProducts = async (req, res) => {
    try{
  const products = await Product.find();
  res.json(products);
    } catch (err) {
    res.status(500).json({ message: 'Failed to fetch products' });
  }
};

export const addProduct = async (req, res) => {
  const product = await Product.create(req.body);
  res.status(201).json(product);
};
