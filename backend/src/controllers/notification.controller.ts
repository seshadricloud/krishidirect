import { Request, Response } from 'express';

let prisma: any = null;
async function getPrisma() {
  if (!prisma) {
    const { PrismaClient } = await import('@prisma/client');
    prisma = new PrismaClient();
  }
  return prisma;
}

// Get all notifications for user
export async function getNotifications(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const db = await getPrisma();
    const notifications = await db.notification.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: 50
    });

    res.json(notifications);
  } catch (err) {
    console.error('Get notifications error:', err);
    res.status(500).json({ message: (err as Error).message });
  }
}

// Mark notification as read
export async function markAsRead(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const db = await getPrisma();
    const notification = await db.notification.update({
      where: { id: req.params.id },
      data: { isRead: true }
    });

    res.json(notification);
  } catch (err) {
    console.error('Mark notification error:', err);
    res.status(500).json({ message: (err as Error).message });
  }
}

// Mark all as read
export async function markAllAsRead(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const db = await getPrisma();
    await db.notification.updateMany({
      where: { userId, isRead: false },
      data: { isRead: true }
    });

    res.json({ message: 'All notifications marked as read' });
  } catch (err) {
    console.error('Mark all read error:', err);
    res.status(500).json({ message: (err as Error).message });
  }
}

// Get unread count
export async function getUnreadCount(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const db = await getPrisma();
    const count = await db.notification.count({
      where: { userId, isRead: false }
    });

    res.json({ count });
  } catch (err) {
    console.error('Get unread count error:', err);
    res.status(500).json({ message: (err as Error).message });
  }
}
