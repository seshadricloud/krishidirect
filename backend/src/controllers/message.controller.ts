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
 * Get conversation with a specific user
 * GET /api/messages/:userId
 */
export async function getConversation(req: Request, res: Response) {
  try {
    const { userId } = req.params;
    const currentUserId = req.user?.id;

    if (!currentUserId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const db = await getPrisma();

    const messages = await db.message.findMany({
      where: {
        OR: [
          { senderId: currentUserId, recipientId: userId },
          { senderId: userId, recipientId: currentUserId }
        ]
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            profileImage: true
          }
        },
        recipient: {
          select: {
            id: true,
            name: true,
            profileImage: true
          }
        },
        product: {
          select: {
            id: true,
            name: true,
            image: true
          }
        }
      },
      orderBy: {
        createdAt: 'asc'
      }
    });

    res.json(messages);
  } catch (error) {
    console.error('Error fetching conversation:', error);
    res.status(500).json({ message: 'Failed to fetch conversation' });
  }
}

/**
 * Get all conversations for current user
 * GET /api/messages/conversations
 */
export async function getConversations(req: Request, res: Response) {
  try {
    const currentUserId = req.user?.id;

    if (!currentUserId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const db = await getPrisma();

    // Get all unique users the current user has chatted with
    const messages = await db.message.findMany({
      where: {
        OR: [
          { senderId: currentUserId },
          { recipientId: currentUserId }
        ]
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            profileImage: true
          }
        },
        recipient: {
          select: {
            id: true,
            name: true,
            profileImage: true
          }
        },
        product: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Group by conversation partner
    const conversationsMap = new Map();
    
    messages.forEach(message => {
      const partnerId = message.senderId === currentUserId 
        ? message.recipientId 
        : message.senderId;
      
      if (!conversationsMap.has(partnerId)) {
        conversationsMap.set(partnerId, {
          user: message.senderId === currentUserId ? message.recipient : message.sender,
          lastMessage: message,
          unreadCount: 0
        });
      }

      // Count unread messages
      if (message.recipientId === currentUserId && !message.isRead) {
        const conv = conversationsMap.get(partnerId);
        conv.unreadCount += 1;
      }
    });

    const conversations = Array.from(conversationsMap.values());
    
    res.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    res.status(500).json({ message: 'Failed to fetch conversations' });
  }
}

/**
 * Send a message (REST endpoint as fallback)
 * POST /api/messages
 */
export async function sendMessage(req: Request, res: Response) {
  try {
    const { recipientId, content, productId } = req.body;
    const currentUserId = req.user?.id;

    if (!currentUserId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!recipientId || !content) {
      return res.status(400).json({ message: 'Recipient and content are required' });
    }

    const db = await getPrisma();

    const message = await db.message.create({
      data: {
        senderId: currentUserId,
        recipientId,
        content,
        productId: productId || null
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            profileImage: true
          }
        }
      }
    });

    res.status(201).json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ message: 'Failed to send message' });
  }
}
