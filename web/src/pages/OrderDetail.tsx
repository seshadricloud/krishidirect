import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../api';
import OrderTimeline from '../components/OrderTimeline';

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product: {
    name: string;
    image?: string;
    unit: string;
  };
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  paymentStatus: string;
  deliveryAddress?: string;
  createdAt: string;
  items: OrderItem[];
}

interface StatusHistory {
  id: string;
  status: string;
  notes?: string;
  createdAt: string;
}

export default function OrderDetail(): JSX.Element {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [order, setOrder] = useState<Order | null>(null);
  const [statusHistory, setStatusHistory] = useState<StatusHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrder();
    fetchStatusHistory();
  }, [id]);

  async function fetchOrder() {
    try {
      const response = await api.get(`/orders/${id}`);
      setOrder(response.data);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to load order');
    } finally {
      setLoading(false);
    }
  }

  async function fetchStatusHistory() {
    try {
      const response = await api.get(`/orders/${id}/history`);
      setStatusHistory(response.data);
    } catch (err) {
      console.error('Failed to fetch status history:', err);
    }
  }

  if (loading) {
    return (
      <div className="container" style={{ padding: '40px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⏳</div>
        <div>Loading order details...</div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="container" style={{ padding: '40px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>❌</div>
        <h2>Order Not Found</h2>
        <p style={{ color: '#6b7280', marginBottom: 24 }}>{error}</p>
        <button onClick={() => navigate('/dashboard')} className="btn btn-primary">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 20px', maxWidth: 1000 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#10b981',
            fontSize: 16,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            marginBottom: 16,
            padding: 0
          }}
        >
          ← Back to Dashboard
        </button>
        <h1 style={{ marginBottom: 8 }}>Order #{order.orderNumber.slice(-8)}</h1>
        <div style={{ color: '#6b7280' }}>
          Placed on {new Date(order.createdAt).toLocaleString('en-IN', {
            dateStyle: 'long',
            timeStyle: 'short'
          })}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: 32 }}>
        {/* Left Column - Order Details */}
        <div>
          {/* Items */}
          <div style={{
            background: 'white',
            border: '2px solid #e5e7eb',
            borderRadius: 12,
            padding: 24,
            marginBottom: 24
          }}>
            <h2 style={{ marginBottom: 20, fontSize: 20 }}>Order Items</h2>
            {order.items.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  gap: 16,
                  padding: '16px 0',
                  borderBottom: '1px solid #f3f4f6'
                }}
              >
                {item.product.image && (
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    style={{
                      width: 80,
                      height: 80,
                      objectFit: 'cover',
                      borderRadius: 8
                    }}
                  />
                )}
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>
                    {item.product.name}
                  </div>
                  <div style={{ color: '#6b7280', fontSize: 14 }}>
                    {item.quantity} {item.product.unit} × ₹{item.price}
                  </div>
                </div>
                <div style={{ fontWeight: 600, fontSize: 16 }}>
                  ₹{(item.quantity * item.price).toFixed(2)}
                </div>
              </div>
            ))}

            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 20,
              paddingTop: 20,
              borderTop: '2px solid #e5e7eb'
            }}>
              <span style={{ fontSize: 18, fontWeight: 600 }}>Total Amount</span>
              <span style={{ fontSize: 24, fontWeight: 700, color: '#10b981' }}>
                ₹{order.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Delivery Address */}
          {order.deliveryAddress && (
            <div style={{
              background: 'white',
              border: '2px solid #e5e7eb',
              borderRadius: 12,
              padding: 24
            }}>
              <h3 style={{ marginBottom: 12, fontSize: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontSize: 20 }}>📍</span> Delivery Address
              </h3>
              <p style={{ color: '#374151', lineHeight: 1.6, margin: 0 }}>
                {order.deliveryAddress}
              </p>
            </div>
          )}
        </div>

        {/* Right Column - Order Timeline */}
        <div>
          <div style={{
            background: 'white',
            border: '2px solid #e5e7eb',
            borderRadius: 12,
            padding: 24,
            position: 'sticky',
            top: 20
          }}>
            <h2 style={{ marginBottom: 4, fontSize: 20 }}>Order Status</h2>
            <div style={{ color: '#6b7280', fontSize: 14, marginBottom: 24 }}>
              Track your order progress
            </div>

            <OrderTimeline 
              currentStatus={order.status} 
              statusHistory={statusHistory}
            />

            {/* Payment Status */}
            <div style={{
              marginTop: 24,
              padding: 16,
              background: order.paymentStatus === 'paid' ? '#f0fdf4' : '#fef3c7',
              border: `2px solid ${order.paymentStatus === 'paid' ? '#bbf7d0' : '#fde68a'}`,
              borderRadius: 10
            }}>
              <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>
                Payment Status
              </div>
              <div style={{ fontSize: 16, fontWeight: 600, textTransform: 'capitalize' }}>
                {order.paymentStatus === 'paid' ? '✅ ' : '⏳ '}
                {order.paymentStatus}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
