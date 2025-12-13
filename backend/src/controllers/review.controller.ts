import { Request, Response } from 'express';

let prisma: any = null;

async function getPrisma() {
  if (!prisma) {
    const { PrismaClient } = await import('@prisma/client');
    prisma = new PrismaClient();
  }
  return prisma;
}

/**
 * Create a new review for a product
 * POST /api/reviews
 */
export async function createReview(req: Request, res: Response) {
  try {
    const { productId, rating, comment } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!productId || !rating) {
      return res.status(400).json({ message: 'Product ID and rating are required' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const db = await getPrisma();

    // Check if product exists
    const product = await db.product.findUnique({
      where: { id: productId }
    });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if user already reviewed this product
    const existingReview = await db.review.findUnique({
      where: {
        productId_userId: {
          productId,
          userId
        }
      }
    });

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    const review = await db.review.create({
      data: {
        productId,
        userId,
        rating,
        comment: comment || null
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true
          }
        }
      }
    });

    res.status(201).json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ message: 'Failed to create review' });
  }
}

/**
 * Get all reviews for a product
 * GET /api/products/:productId/reviews
 */
export async function getProductReviews(req: Request, res: Response) {
  try {
    const { productId } = req.params;
    const db = await getPrisma();

    const reviews = await db.review.findMany({
      where: { productId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Calculate average rating
    const averageRating = reviews.length > 0
      ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length
      : 0;

    res.json({
      reviews,
      averageRating: parseFloat(averageRating.toFixed(1)),
      totalReviews: reviews.length
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ message: 'Failed to fetch reviews' });
  }
}

/**
 * Update a review
 * PATCH /api/reviews/:id
 */
export async function updateReview(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ message: 'Rating must be between 1 and 5' });
    }

    const db = await getPrisma();

    // Check if review exists and belongs to user
    const existingReview = await db.review.findUnique({
      where: { id }
    });

    if (!existingReview) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (existingReview.userId !== userId) {
      return res.status(403).json({ message: 'You can only update your own reviews' });
    }

    const updatedReview = await db.review.update({
      where: { id },
      data: {
        ...(rating && { rating }),
        ...(comment !== undefined && { comment: comment || null })
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            profileImage: true
          }
        }
      }
    });

    res.json(updatedReview);
  } catch (error) {
    console.error('Error updating review:', error);
    res.status(500).json({ message: 'Failed to update review' });
  }
}

/**
 * Delete a review
 * DELETE /api/reviews/:id
 */
export async function deleteReview(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const db = await getPrisma();

    // Check if review exists and belongs to user
    const existingReview = await db.review.findUnique({
      where: { id }
    });

    if (!existingReview) {
      return res.status(404).json({ message: 'Review not found' });
    }

    if (existingReview.userId !== userId) {
      return res.status(403).json({ message: 'You can only delete your own reviews' });
    }

    await db.review.delete({
      where: { id }
    });

    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ message: 'Failed to delete review' });
  }
}
