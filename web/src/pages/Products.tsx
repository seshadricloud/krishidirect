import React, { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../hooks/useAuth';

type Product = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  category?: string;
  image?: string;
  location?: string;
  description?: string;
  user?: {
    name: string;
    role: string;
  };
};

const CATEGORIES = ['All', 'Vegetables', 'Fruits', 'Grains', 'Pulses', 'Spices', 'Dairy', 'Other'];

export default function Products() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<'all' | 'low' | 'mid' | 'high'>('all');

  useEffect(() => {
    let mounted = true;
    api.get('/products')
      .then(res => {
        if (mounted) {
          console.log('Products:', res.data);
          setProducts(res.data || []);
          setFilteredProducts(res.data || []);
        }
      })
      .catch(err => {
        if (mounted) {
          console.error('Error fetching products:', err);
          setError(err.response?.data?.message || 'Failed to load products');
          setProducts([]);
          setFilteredProducts([]);
        }
      })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    let filtered = products;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p => 
        p.name.toLowerCase().includes(query) ||
        p.description?.toLowerCase().includes(query) ||
        p.location?.toLowerCase().includes(query)
      );
    }

    // Filter by price range
    if (priceRange === 'low') {
      filtered = filtered.filter(p => p.price < 50);
    } else if (priceRange === 'mid') {
      filtered = filtered.filter(p => p.price >= 50 && p.price < 200);
    } else if (priceRange === 'high') {
      filtered = filtered.filter(p => p.price >= 200);
    }

    setFilteredProducts(filtered);
  }, [products, selectedCategory, searchQuery, priceRange]);

  if (loading) return (
    <div style={{ padding: 40, textAlign: 'center' }}>
      <p>Loading products...</p>
    </div>
  );

  if (error) return (
    <div style={{ padding: 40, textAlign: 'center', color: '#EF4444' }}>
      <p>Error: {error}</p>
    </div>
  );

  return (
    <div style={{ padding: 40, maxWidth: 1200, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <h1 style={{ margin: 0 }}>Products Marketplace</h1>
        {user?.role === 'farmer' && (
          <button
            onClick={() => window.location.href = '/products/new'}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg,#2F9E44 0%,#4CAF50 100%)',
              color: 'white',
              border: 'none',
              borderRadius: 12,
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            + List Product
          </button>
        )}
      </div>

      {/* Filters */}
      <div style={{ marginBottom: 32, padding: 24, background: '#f9fafb', borderRadius: 12 }}>
        {/* Search Bar */}
        <div style={{ marginBottom: 20 }}>
          <input
            type="text"
            placeholder="🔍 Search crops, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              border: '1px solid #d1d5db',
              borderRadius: 8,
              fontSize: 16
            }}
          />
        </div>

        {/* Category Filter */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: '#374151' }}>
            Category
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '8px 16px',
                  border: selectedCategory === cat ? '2px solid #2F9E44' : '1px solid #d1d5db',
                  borderRadius: 20,
                  background: selectedCategory === cat ? '#e8f5e9' : 'white',
                  color: selectedCategory === cat ? '#2F9E44' : '#6b7280',
                  fontWeight: selectedCategory === cat ? 600 : 400,
                  cursor: 'pointer',
                  fontSize: 14
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Price Range Filter */}
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8, color: '#374151' }}>
            Price Range
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              { value: 'all', label: 'All Prices' },
              { value: 'low', label: 'Under ₹50' },
              { value: 'mid', label: '₹50 - ₹200' },
              { value: 'high', label: 'Above ₹200' }
            ].map(range => (
              <button
                key={range.value}
                onClick={() => setPriceRange(range.value as any)}
                style={{
                  padding: '8px 16px',
                  border: priceRange === range.value ? '2px solid #2F9E44' : '1px solid #d1d5db',
                  borderRadius: 20,
                  background: priceRange === range.value ? '#e8f5e9' : 'white',
                  color: priceRange === range.value ? '#2F9E44' : '#6b7280',
                  fontWeight: priceRange === range.value ? 600 : 400,
                  cursor: 'pointer',
                  fontSize: 14
                }}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div style={{ marginBottom: 16, color: '#6b7280', fontSize: 14 }}>
        Showing {filteredProducts.length} of {products.length} products
      </div>

      {!filteredProducts.length ? (
        <div style={{ textAlign: 'center', padding: 60, background: '#F8FAFC', borderRadius: 16 }}>
          <h3 style={{ color: '#64748B' }}>No products found</h3>
          <p style={{ color: '#94A3B8' }}>
            {products.length === 0 ? 'Be the first to list a product!' : 'Try adjusting your filters'}
          </p>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 24
        }}>
          {filteredProducts.map(p => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

function ProductCard({ product: p }: { product: Product }) {
  const { user } = useAuth();
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [ordering, setOrdering] = useState(false);

  async function handleOrder() {
    if (!user) {
      alert('Please log in to place an order');
      window.location.href = '/login';
      return;
    }

    if (user.role !== 'buyer') {
      alert('Only buyers can place orders');
      return;
    }

    setOrdering(true);
    try {
      await api.post('/orders', {
        items: [{
          productId: p.id,
          quantity: orderQuantity,
          price: p.price
        }]
      });

      alert('Order placed successfully! Check your dashboard for updates.');
      setShowOrderForm(false);
      setOrderQuantity(1);
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to place order');
    } finally {
      setOrdering(false);
    }
  }

  return (
    <div
      style={{
        background: 'white',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        transition: 'transform 0.2s',
        cursor: 'pointer'
      }}
      onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
      onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      {p.image ? (
        <img
          src={p.image}
          alt={p.name}
          style={{ width: '100%', height: 200, objectFit: 'cover' }}
        />
      ) : (
        <div style={{
          width: '100%',
          height: 200,
          background: 'linear-gradient(135deg, #E8F5E9, #C8E6C9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 48
        }}>
          🌾
        </div>
      )}

      <div style={{ padding: 20 }}>
        <h3 style={{ margin: '0 0 8px', fontSize: 20, color: '#0F172A' }}>{p.name}</h3>

        {p.category && (
          <span style={{
            display: 'inline-block',
            padding: '4px 12px',
            background: '#E8F5E9',
            color: '#2F9E44',
            borderRadius: 20,
            fontSize: 12,
            fontWeight: 600,
            marginBottom: 12
          }}>
            {p.category}
          </span>
        )}

        <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 28, fontWeight: 700, color: '#2F9E44' }}>
            ₹{p.price}
          </span>
          <span style={{ fontSize: 14, color: '#64748B' }}>
            per {p.unit}
          </span>
        </div>

        <p style={{ fontSize: 14, color: '#64748B', margin: '0 0 12px' }}>
          {p.quantity} {p.unit} available
        </p>

        {p.description && (
          <p style={{ fontSize: 14, color: '#64748B', margin: '0 0 12px' }}>
            {p.description.length > 80 ? p.description.substring(0, 80) + '...' : p.description}
          </p>
        )}

        {p.user && (
          <div style={{
            borderTop: '1px solid #E2E8F0',
            paddingTop: 12,
            marginTop: 12,
            marginBottom: 16,
            fontSize: 13,
            color: '#64748B'
          }}>
            <span>👨‍🌾 {p.user.name}</span>
            {p.location && <span> • 📍 {p.location}</span>}
          </div>
        )}

        {!showOrderForm ? (
          <button
            onClick={() => setShowOrderForm(true)}
            style={{
              width: '100%',
              padding: '12px',
              background: 'linear-gradient(135deg, #2F9E44 0%, #4CAF50 100%)',
              color: 'white',
              border: 'none',
              borderRadius: 8,
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: 14
            }}
          >
            🛒 Place Order
          </button>
        ) : (
          <div style={{ border: '2px solid #2F9E44', borderRadius: 8, padding: 12 }}>
            <div style={{ marginBottom: 8, fontSize: 14, fontWeight: 600 }}>
              Order Quantity
            </div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
              <button
                onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: 6,
                  background: 'white',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                -
              </button>
              <input
                type="number"
                value={orderQuantity}
                onChange={(e) => setOrderQuantity(Math.max(1, parseFloat(e.target.value) || 1))}
                style={{
                  flex: 1,
                  padding: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: 6,
                  textAlign: 'center',
                  fontSize: 14
                }}
              />
              <button
                onClick={() => setOrderQuantity(Math.min(p.quantity, orderQuantity + 1))}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: 6,
                  background: 'white',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
              >
                +
              </button>
            </div>
            <div style={{ fontSize: 14, marginBottom: 12, fontWeight: 600 }}>
              Total: ₹{(p.price * orderQuantity).toFixed(2)}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                onClick={handleOrder}
                disabled={ordering}
                style={{
                  flex: 1,
                  padding: '10px',
                  background: ordering ? '#d1d5db' : 'linear-gradient(135deg, #2F9E44 0%, #4CAF50 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  fontWeight: 600,
                  cursor: ordering ? 'not-allowed' : 'pointer',
                  fontSize: 13
                }}
              >
                {ordering ? 'Placing...' : 'Confirm'}
              </button>
              <button
                onClick={() => {
                  setShowOrderForm(false);
                  setOrderQuantity(1);
                }}
                style={{
                  padding: '10px 16px',
                  background: '#f3f4f6',
                  border: 'none',
                  borderRadius: 6,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: 13
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}