import { Router } from 'express';
import { prisma } from '../db';

const router = Router();

// GET /api/orders/:userId
router.get('/user/:userId', async (req, res) => {
  const orders = await prisma.order.findMany({
    where: { userId: Number(req.params.userId) },
    include: { orderItems: { include: { product: true } } },
  });
  res.json(orders);
});

// POST /api/orders
// body: { userId: 1, items: [{ productId: 1, quantity: 2 }] }
router.post('/', async (req, res) => {
  const { userId, items } = req.body;

  if (!userId || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'userId and items are required' });
  }

  try {
    const order = await prisma.$transaction(async (tx) => {
      const products = await tx.product.findMany({
        where: { id: { in: items.map((i: any) => i.productId) } },
      });

      let total = 0;
      const orderItemsData = items.map((item: any) => {
        const product = products.find((p) => p.id === item.productId);
        if (!product) throw new Error(`Product ${item.productId} not found`);
        if (product.stock < item.quantity) throw new Error(`Insufficient stock for ${product.name}`);

        total += Number(product.price) * item.quantity;
        return {
          productId: product.id,
          quantity: item.quantity,
          priceAtPurchase: product.price,
        };
      });

      const newOrder = await tx.order.create({
        data: {
          userId,
          total,
          orderItems: { create: orderItemsData },
        },
        include: { orderItems: true },
      });

      for (const item of items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return newOrder;
    });

    res.status(201).json(order);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export default router;