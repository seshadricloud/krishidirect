import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../api';

interface Product {
  id: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  category?: string;
  image?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  items: Array<{
    id: string;
    quantity: number;
    price: number;
    product: Product;
  }>;
}

export default function Dashboard(): JSX.Element {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      setLoading(true);
      
      if (user?.role === 'farmer') {
        // Load farmer's products
        const productsRes = await api.get('/products');
        const myProducts = productsRes.data.filter((p: any) => p.userId === user.id);
        setProducts(myProducts);
      }
      
      // Load orders
      const ordersRes = await api.get('/orders');
      setOrders(ordersRes.data);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAcceptOrder(orderId: string) {
    try {
      await api.put(`/orders/${orderId}/status`, { status: 'confirmed' });
<<<<<<< HEAD
=======
      alert('✅ Order accepted successfully!');
>>>>>>> feature/otp-based-login
      loadDashboard();
    } catch (err: any) {
      console.error('Failed to accept order:', err);
<<<<<<< HEAD
      alert('Failed to accept order. Please try again.');
=======
      alert(err?.response?.data?.message || 'Failed to accept order');
>>>>>>> feature/otp-based-login
    }
  }

  async function handleRejectOrder(orderId: string) {
    try {
      await api.put(`/orders/${orderId}/status`, { status: 'cancelled' });
<<<<<<< HEAD
=======
      alert('❌ Order rejected');
>>>>>>> feature/otp-based-login
      loadDashboard();
    } catch (err: any) {
      console.error('Failed to reject order:', err);
<<<<<<< HEAD
      alert('Failed to reject order. Please try again.');
=======
      alert(err?.response?.data?.message || 'Failed to reject order');
>>>>>>> feature/otp-based-login
    }
  }

  if (loading) {
    return (
      <div className="container" style={{ padding: '40px 0', textAlign: 'center' }}>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container" style={{ padding: '40px 0', textAlign: 'center' }}>
        <p>Please log in to view your dashboard.</p>
        <Link to="/login" className="btn btn-primary">Log in</Link>
      </div>
    );
  }

  // Farmer Dashboard
  if (user.role === 'farmer') {
    const pendingOrders = orders.filter(o => o.status === 'pending');
    
    return (
      <div className="container" style={{ padding: '40px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <h1 style={{ margin: 0 }}>Farmer Dashboard</h1>
          <Link to="/products/new" className="btn btn-primary">+ Add New Crop Listing</Link>
        </div>

        {/* Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
          <div style={{ padding: 20, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: 12, color: 'white' }}>
            <div style={{ fontSize: 32, fontWeight: 700 }}>{products.length}</div>
            <div style={{ opacity: 0.9 }}>Active Listings</div>
          </div>
          <div style={{ padding: 20, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', borderRadius: 12, color: 'white' }}>
            <div style={{ fontSize: 32, fontWeight: 700 }}>{pendingOrders.length}</div>
            <div style={{ opacity: 0.9 }}>New Orders</div>
          </div>
          <div style={{ padding: 20, background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', borderRadius: 12, color: 'white' }}>
            <div style={{ fontSize: 32, fontWeight: 700 }}>{orders.length}</div>
            <div style={{ opacity: 0.9 }}>Total Orders</div>
          </div>
        </div>

        {/* Pending Orders */}
        {pendingOrders.length > 0 && (
          <section style={{ marginBottom: 32 }}>
            <h2>New Orders Awaiting Response</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {pendingOrders.map(order => (
                <div key={order.id} style={{ padding: 20, border: '2px solid #fbbf24', borderRadius: 12, background: '#fffbeb' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 18 }}>Order #{order.orderNumber}</div>
                      <div style={{ color: '#6b7280', fontSize: 14 }}>
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: '#059669' }}>
                      ₹{order.totalAmount.toFixed(2)}
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: 12 }}>
                    {order.items.map(item => (
                      <div key={item.id} style={{ fontSize: 14, color: '#374151' }}>
                        {item.product.name} - {item.quantity} {item.product.unit} @ ₹{item.price}/{item.product.unit}
                      </div>
                    ))}
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button 
                      onClick={() => handleAcceptOrder(order.id)}
                      className="btn btn-primary"
                      style={{ flex: 1 }}
                    >
                      ✓ Accept Order
                    </button>
                    <button 
                      onClick={() => handleRejectOrder(order.id)}
                      className="btn"
                      style={{ flex: 1, background: '#ef4444', color: 'white' }}
                    >
                      ✗ Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Active Listings */}
        <section>
          <h2>Your Active Listings</h2>
          {products.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, background: '#f9fafb', borderRadius: 12 }}>
              <p style={{ color: '#6b7280', marginBottom: 16 }}>No products listed yet</p>
              <Link to="/products/new" className="btn btn-primary">+ List Your First Crop</Link>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
              {products.map(product => (
                <div key={product.id} style={{ border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden', background: 'white' }}>
                  {product.image && (
                    <img 
                      src={product.image} 
                      alt={product.name}
                      style={{ width: '100%', height: 180, objectFit: 'cover' }}
                    />
                  )}
                  <div style={{ padding: 16 }}>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: 18 }}>{product.name}</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: 20, fontWeight: 700, color: '#059669' }}>
                        ₹{product.price}/{product.unit}
                      </span>
                      <span style={{ fontSize: 14, color: '#6b7280' }}>
                        {product.quantity} {product.unit}
                      </span>
                    </div>
                    {product.category && (
                      <div style={{ marginTop: 8, fontSize: 12, color: '#6b7280' }}>
                        {product.category}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    );
  }

  // Buyer Dashboard
  return (
    <div className="container" style={{ padding: '40px 0' }}>
      <h1>Buyer Dashboard</h1>

      {/* Quick Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        <div style={{ padding: 20, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: 12, color: 'white' }}>
          <div style={{ fontSize: 32, fontWeight: 700 }}>{orders.length}</div>
          <div style={{ opacity: 0.9 }}>Total Orders</div>
        </div>
        <div style={{ padding: 20, background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', borderRadius: 12, color: 'white' }}>
          <div style={{ fontSize: 32, fontWeight: 700 }}>
            {orders.filter(o => o.status === 'pending').length}
          </div>
          <div style={{ opacity: 0.9 }}>Pending Orders</div>
        </div>
        <div style={{ padding: 20, background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', borderRadius: 12, color: 'white' }}>
          <div style={{ fontSize: 32, fontWeight: 700 }}>
            {orders.filter(o => o.status === 'accepted').length}
          </div>
          <div style={{ opacity: 0.9 }}>Accepted Orders</div>
        </div>
      </div>

      {/* Browse Products Button */}
      <div style={{ marginBottom: 32, textAlign: 'center', padding: 40, background: '#f9fafb', borderRadius: 12 }}>
        <h2 style={{ marginTop: 0 }}>Browse Fresh Produce</h2>
        <p style={{ color: '#6b7280', marginBottom: 20 }}>
          Discover crops directly from farmers near you
        </p>
        <Link to="/products" className="btn btn-primary">🌾 Browse Marketplace</Link>
      </div>

      {/* Order History */}
      <section>
        <h2>Your Orders</h2>
        {orders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 40, background: '#f9fafb', borderRadius: 12 }}>
            <p style={{ color: '#6b7280' }}>No orders yet</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {orders.map(order => (
              <div key={order.id} style={{ 
                padding: 20, 
                border: '1px solid #e5e7eb', 
                borderRadius: 12,
                background: order.status === 'pending' ? '#fffbeb' : 'white'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 12 }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 18 }}>Order #{order.orderNumber}</div>
                    <div style={{ color: '#6b7280', fontSize: 14 }}>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 20, fontWeight: 700, color: '#059669' }}>
                      ₹{order.totalAmount.toFixed(2)}
                    </div>
                    <div style={{ 
                      fontSize: 12, 
                      fontWeight: 600, 
                      textAlign: 'right',
                      color: order.status === 'accepted' ? '#059669' : order.status === 'pending' ? '#f59e0b' : '#6b7280'
                    }}>
                      {order.status.toUpperCase()}
                    </div>
                  </div>
                </div>
                
                <div>
                  {order.items.map(item => (
                    <div key={item.id} style={{ fontSize: 14, color: '#374151', marginBottom: 4 }}>
                      {item.product.name} - {item.quantity} {item.product.unit} @ ₹{item.price}/{item.product.unit}
                    </div>
                  ))}

                <button
                  onClick={() => navigate(`/orders/${order.id}`)}
                  style={{
                    marginTop: 12,
                    padding: '8px 16px',
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'background 0.2s'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.background = '#059669'}
                  onMouseLeave={(e) => e.currentTarget.style.background = '#10b981'}
                >
                  View Details & Track Order →
                </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
