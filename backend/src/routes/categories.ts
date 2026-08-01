import { Router } from "express";
import { prisma } from "../db";

const router: Router = Router();

//GET /api/categories

router.get("/", async (req, res) => {
  const categories = await prisma.category.findMany();
  res.json(categories);
});

// post /api/categories

router.post("/", async (req, res) => {
  const { name } = req.body;

  if (!name || typeof name !== "string") {
    return res.status(400).json({ error: "Name is required" });
  }

  try {
    const category = await prisma.category.create({ data: { name } });
    res.status(201).json(category);
  } catch (err: any) {
    if (err.code === "P2002") {
      return res.status(400).json({ error: "Category already exists" });
    }

    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
