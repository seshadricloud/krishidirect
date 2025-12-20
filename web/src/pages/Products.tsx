import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import api from '../api';
import { useAuth } from '../hooks/useAuth';
import { ProductCardSkeleton } from '../components/Skeleton';
import ImageCarousel from '../components/ImageCarousel';

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
const ITEMS_PER_PAGE = 12;

export default function Products() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [priceRange, setPriceRange] = useState<'all' | 'low' | 'mid' | 'high'>('all');
  const [currentPage, setCurrentPage] = useState(1);

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
    setCurrentPage(1); // Reset to first page when filters change
  }, [products, selectedCategory, searchQuery, priceRange]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div style={{ padding: 40, maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{ marginBottom: 32 }}>Products Marketplace</h1>
        
        {/* Show skeleton grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: 24
        }}>
          {[1, 2, 3, 4, 5, 6].map(i => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

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
      <div style={{ 
        marginBottom: 16, 
        color: '#6b7280', 
        fontSize: 14,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span>
          Showing {startIndex + 1}-{Math.min(endIndex, filteredProducts.length)} of {filteredProducts.length} products
        </span>
        {totalPages > 1 && (
          <span style={{ color: '#94A3B8' }}>Page {currentPage} of {totalPages}</span>
        )}
      </div>

      {!filteredProducts.length ? (
        <div style={{ textAlign: 'center', padding: 60, background: '#F8FAFC', borderRadius: 16 }}>
          <h3 style={{ color: '#64748B' }}>No products found</h3>
          <p style={{ color: '#94A3B8' }}>
            {products.length === 0 ? 'Be the first to list a product!' : 'Try adjusting your filters'}
          </p>
        </div>
      ) : (
        <>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
            gap: 24,
            marginBottom: 40
          }}>
            {currentProducts.map(p => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 8,
              marginTop: 40
            }}>
              {/* Previous Button */}
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                style={{
                  padding: '10px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: 8,
                  background: currentPage === 1 ? '#f9fafb' : 'white',
                  color: currentPage === 1 ? '#9ca3af' : '#374151',
                  cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                  fontSize: 14,
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  if (currentPage !== 1) {
                    e.currentTarget.style.borderColor = '#22c55e';
                    e.currentTarget.style.color = '#22c55e';
                  }
                }}
                onMouseOut={(e) => {
                  if (currentPage !== 1) {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.color = '#374151';
                  }
                }}
              >
                ← Previous
              </button>

              {/* Page Numbers */}
              <div style={{ display: 'flex', gap: 6 }}>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => {
                  // Show first 2, last 2, and pages around current
                  const showPage = pageNum === 1 || 
                                   pageNum === totalPages || 
                                   (pageNum >= currentPage - 1 && pageNum <= currentPage + 1);
                  
                  const showEllipsis = (pageNum === 2 && currentPage > 3) || 
                                       (pageNum === totalPages - 1 && currentPage < totalPages - 2);

                  if (!showPage && !showEllipsis) return null;

                  if (showEllipsis) {
                    return <span key={pageNum} style={{ padding: '0 8px', color: '#9ca3af' }}>...</span>;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      style={{
                        width: 40,
                        height: 40,
                        border: currentPage === pageNum ? '2px solid #22c55e' : '2px solid #e5e7eb',
                        borderRadius: 8,
                        background: currentPage === pageNum ? '#f0fdf4' : 'white',
                        color: currentPage === pageNum ? '#22c55e' : '#374151',
                        cursor: 'pointer',
                        fontWeight: currentPage === pageNum ? 700 : 600,
                        fontSize: 14,
                        transition: 'all 0.2s'
                      }}
                      onMouseOver={(e) => {
                        if (currentPage !== pageNum) {
                          e.currentTarget.style.borderColor = '#22c55e';
                          e.currentTarget.style.color = '#22c55e';
                        }
                      }}
                      onMouseOut={(e) => {
                        if (currentPage !== pageNum) {
                          e.currentTarget.style.borderColor = '#e5e7eb';
                          e.currentTarget.style.color = '#374151';
                        }
                      }}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              {/* Next Button */}
              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                style={{
                  padding: '10px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: 8,
                  background: currentPage === totalPages ? '#f9fafb' : 'white',
                  color: currentPage === totalPages ? '#9ca3af' : '#374151',
                  cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                  fontWeight: 600,
                  fontSize: 14,
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  if (currentPage !== totalPages) {
                    e.currentTarget.style.borderColor = '#22c55e';
                    e.currentTarget.style.color = '#22c55e';
                  }
                }}
                onMouseOut={(e) => {
                  if (currentPage !== totalPages) {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.color = '#374151';
                  }
                }}
              >
                Next →
              </button>
            </div>
          )}
        </>
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
      toast.error('Please log in to place an order');
      window.location.href = '/login';
      return;
    }

    if (user.role !== 'buyer') {
      toast.error(`Only buyers can place orders. Your role: ${user.role}`);
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

      toast.success('Order placed successfully! Check your dashboard for updates.');
      setShowOrderForm(false);
      setOrderQuantity(1);
    } catch (err: any) {
      console.error('Order error:', err);
      toast.error(err?.response?.data?.message || 'Failed to place order. Please try again.');
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
        transition: 'transform 0.2s'
      }}
      onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
      onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{ padding: 12 }}>
        <ImageCarousel 
          images={p.image ? [p.image] : []} 
          productName={p.name}
        />
      </div>

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
          <div style={{ 
            border: '2px solid #2F9E44', 
            borderRadius: 12, 
            padding: 16,
            background: '#f9fafb'
          }}>
            <div style={{ 
              marginBottom: 12, 
              fontSize: 14, 
              fontWeight: 600,
              color: '#374151'
            }}>
              Order Quantity
            </div>
            <div style={{ 
              display: 'flex', 
              gap: 10, 
              marginBottom: 14,
              alignItems: 'center'
            }}>
              <button
                onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
                style={{
                  width: 36,
                  height: 36,
                  padding: 0,
                  border: '2px solid #e5e7eb',
                  borderRadius: 8,
                  background: 'white',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: 18,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#6b7280'
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
                  padding: '10px',
                  border: '2px solid #e5e7eb',
                  borderRadius: 8,
                  textAlign: 'center',
                  fontSize: 16,
                  fontWeight: 600,
                  minWidth: 0,
                  boxSizing: 'border-box'
                }}
              />
              <button
                onClick={() => setOrderQuantity(Math.min(p.quantity, orderQuantity + 1))}
                style={{
                  width: 36,
                  height: 36,
                  padding: 0,
                  border: '2px solid #e5e7eb',
                  borderRadius: 8,
                  background: 'white',
                  cursor: 'pointer',
                  fontWeight: 600,
                  fontSize: 18,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#6b7280'
                }}
              >
                +
              </button>
            </div>
            <div style={{ 
              fontSize: 15, 
              marginBottom: 14, 
              fontWeight: 700,
              color: '#16a34a',
              padding: '8px 12px',
              background: '#f0fdf4',
              borderRadius: 8,
              textAlign: 'center'
            }}>
              Total: ₹{(p.price * orderQuantity).toFixed(2)}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={handleOrder}
                disabled={ordering}
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  background: ordering ? '#9ca3af' : 'linear-gradient(135deg, #2F9E44 0%, #4CAF50 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: 8,
                  fontWeight: 600,
                  cursor: ordering ? 'not-allowed' : 'pointer',
                  fontSize: 14,
                  boxShadow: ordering ? 'none' : '0 2px 8px rgba(47, 158, 68, 0.3)',
                  minWidth: 0
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
                  padding: '12px 20px',
                  background: 'white',
                  border: '2px solid #e5e7eb',
                  borderRadius: 8,
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: 14,
                  color: '#6b7280',
                  whiteSpace: 'nowrap'
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