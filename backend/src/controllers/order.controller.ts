import { Request, Response } from 'express';

let prisma: any = null;
async function getPrisma() {
  if (!prisma) {
    const { PrismaClient } = await import('@prisma/client');
    prisma = new PrismaClient();
  }
  return prisma;
}

// Create a new order
export async function createOrder(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { items, deliveryAddress } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Order items are required' });
    }

    const db = await getPrisma();
    
    // Calculate total amount
    let totalAmount = 0;
    for (const item of items) {
      const product = await db.product.findUnique({ where: { id: item.productId } });
      if (!product) {
        return res.status(404).json({ message: `Product ${item.productId} not found` });
      }
      if (product.quantity < item.quantity) {
        return res.status(400).json({ message: `Insufficient quantity for ${product.name}` });
      }
      totalAmount += product.price * item.quantity;
    }

    // Create order with items
    const order = await db.order.create({
      data: {
        buyerId: userId,
        totalAmount,
        deliveryAddress,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price
          }))
        }
      },
      include: {
        items: {
          include: {
            product: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true
                  }
                }
              }
            }
          }
        },
        buyer: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    // Create notifications for farmers
    for (const item of order.items) {
      await db.notification.create({
        data: {
          userId: item.product.userId,
          type: 'order',
          title: 'New Order Received',
          message: `${order.buyer.name} ordered ${item.quantity} ${item.product.unit} of ${item.product.name}`,
          link: `/orders/${order.id}`
        }
      });
    }

    res.status(201).json(order);
  } catch (err) {
    console.error('Create order error:', err);
    res.status(500).json({ message: (err as Error).message });
  }
}

// Get all orders for the authenticated user
export async function getOrders(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const db = await getPrisma();
    const user = await db.user.findUnique({ where: { id: userId } });

    let orders;
    if (user.role === 'farmer') {
      // Farmers see orders for their products
      orders = await db.order.findMany({
        where: {
          items: {
            some: {
              product: {
                userId: userId
              }
            }
          }
        },
        include: {
          items: {
            include: {
              product: true
            }
          },
          buyer: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } else {
      // Buyers see their own orders
      orders = await db.order.findMany({
        where: { buyerId: userId },
        include: {
          items: {
            include: {
              product: {
                include: {
                  user: {
                    select: {
                      id: true,
                      name: true,
                      email: true,
                      phone: true
                    }
                  }
                }
              }
            }
          }
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    }

    res.json(orders);
  } catch (err) {
    console.error('Get orders error:', err);
    res.status(500).json({ message: (err as Error).message });
  }
}

// Get single order
export async function getOrderById(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const db = await getPrisma();
    const order = await db.order.findUnique({
      where: { id: req.params.id },
      include: {
        items: {
          include: {
            product: {
              include: {
                user: {
                  select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true
                  }
                }
              }
            }
          }
        },
        buyer: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (err) {
    console.error('Get order error:', err);
    res.status(500).json({ message: (err as Error).message });
  }
}

// Update order status
export async function updateOrderStatus(req: Request, res: Response) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const db = await getPrisma();
    const order = await db.order.update({
      where: { id: req.params.id },
      data: { status },
      include: {
        buyer: true,
        items: {
          include: {
            product: true
          }
        }
      }
    });

    // Notify buyer
    await db.notification.create({
      data: {
        userId: order.buyerId,
        type: 'order',
        title: `Order ${status}`,
        message: `Your order #${order.orderNumber} has been ${status}`,
        link: `/orders/${order.id}`
      }
    });

    // Create status history entry
    await db.orderStatusHistory.create({
      data: {
        orderId: order.id,
        status,
        notes: `Order status updated to ${status}`
      }
    });

    res.json(order);
  } catch (err) {
    console.error('Update order error:', err);
    res.status(500).json({ message: (err as Error).message });
  }
}

// Get order status history
export async function getOrderStatusHistory(req: Request, res: Response) {
  try {
    const { orderId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    const db = await getPrisma();

    // Check if user has access to this order
    const order = await db.order.findUnique({
      where: { id: orderId },
      include: {
        items: {
          include: {
            product: {
              include: {
                user: true
              }
            }
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user is buyer or seller
    const isBuyer = order.buyerId === userId;
    const isSeller = order.items.some((item: any) => item.product.userId === userId);

    if (!isBuyer && !isSeller) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    // Get status history
    const history = await db.orderStatusHistory.findMany({
      where: { orderId },
      orderBy: { createdAt: 'asc' }
    });

    res.json(history);
  } catch (err) {
    console.error('Get order history error:', err);
    res.status(500).json({ message: (err as Error).message });
  }
}
