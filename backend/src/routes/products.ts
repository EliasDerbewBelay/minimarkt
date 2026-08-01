import { Router } from 'express';
import { prisma } from '../db';

const router: Router = Router();

// GET /api/products?categoryId=1
router.get('/', async (req, res) => {
  const { categoryId } = req.query;

  const products = await prisma.product.findMany({
    where: categoryId ? { categoryId: Number(categoryId) } : {},
    include: { category: true },
  });
  res.json(products);
});

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  const product = await prisma.product.findUnique({
    where: { id: Number(req.params.id) },
    include: { category: true },
  });

  if (!product) return res.status(404).json({ error: 'Product not found' });
  res.json(product);
});

// POST /api/products
router.post('/', async (req, res) => {
  const { categoryId, name, description, price, stock } = req.body;

  if (!categoryId || !name || price === undefined) {
    return res.status(400).json({ error: 'categoryId, name, and price are required' });
  }

  try {
    const product = await prisma.product.create({
      data: { categoryId, name, description, price, stock: stock ?? 0 },
    });
    res.status(201).json(product);
  } catch (err: any) {
    if (err.code === 'P2003') {
      return res.status(400).json({ error: 'Invalid categoryId' });
    }
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;