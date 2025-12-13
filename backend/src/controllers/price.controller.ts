import { Request, Response } from 'express';

let prisma: any = null;
async function getPrisma() {
  if (!prisma) {
    const { PrismaClient } = await import('@prisma/client');
    prisma = new PrismaClient();
  }
  return prisma;
}

// Get current market prices by category
export async function getMarketPrices(req: Request, res: Response) {
  try {
    const { category, region } = req.query;
    const db = await getPrisma();

    const where: any = {};
    if (category) where.category = category as string;
    if (region) where.region = region as string;

    // Get latest price for each category
    const prices = await db.priceHistory.findMany({
      where,
      orderBy: { recordedAt: 'desc' },
      distinct: ['category'],
      take: 20
    });

    res.json(prices);
  } catch (err) {
    console.error('Get market prices error:', err);
    res.status(500).json({ message: (err as Error).message });
  }
}

// Get price history for a category
export async function getPriceHistory(req: Request, res: Response) {
  try {
    const { category } = req.params;
    const { days = '30' } = req.query;

    const db = await getPrisma();
    const daysAgo = new Date();
    daysAgo.setDate(daysAgo.getDate() - parseInt(days as string));

    const history = await db.priceHistory.findMany({
      where: {
        category,
        recordedAt: { gte: daysAgo }
      },
      orderBy: { recordedAt: 'asc' }
    });

    res.json(history);
  } catch (err) {
    console.error('Get price history error:', err);
    res.status(500).json({ message: (err as Error).message });
  }
}

// Record new price (admin only)
export async function recordPrice(req: Request, res: Response) {
  try {
    const { category, region, price, unit } = req.body;

    if (!category || !price) {
      return res.status(400).json({ message: 'Category and price are required' });
    }

    const db = await getPrisma();
    const priceRecord = await db.priceHistory.create({
      data: { category, region, price: parseFloat(price), unit: unit || 'kg' }
    });

    res.status(201).json(priceRecord);
  } catch (err) {
    console.error('Record price error:', err);
    res.status(500).json({ message: (err as Error).message });
  }
}
