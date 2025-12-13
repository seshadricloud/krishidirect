import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../api';

const CATEGORIES = [
  'Vegetables',
  'Fruits',
  'Grains',
  'Pulses',
  'Spices',
  'Dairy',
  'Other'
];

const UNITS = ['kg', 'gram', 'liter', 'piece', 'dozen', 'quintal', 'ton'];

const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal'
];

export default function AddProduct(): JSX.Element {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    unit: 'kg',
    category: 'Vegetables',
    image: '',
    location: ''
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }

      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
      setError(null);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // Enhanced validation
    if (!formData.name || !formData.price || !formData.quantity) {
      return setError('Please fill in all required fields');
    }

    const price = parseFloat(formData.price);
    const quantity = parseFloat(formData.quantity);

    if (price <= 0) {
      return setError('Price must be greater than 0');
    }

    if (quantity <= 0) {
      return setError('Quantity must be greater than 0');
    }

    if (formData.description.length > 500) {
      return setError('Description must be less than 500 characters');
    }

    setLoading(true);
    try {
      await api.post('/products', {
        name: formData.name,
        description: formData.description || undefined,
        price,
        quantity,
        unit: formData.unit,
        category: formData.category,
        image: formData.image || undefined,
        location: formData.location || undefined
      });

      setSuccess(true);
      setTimeout(() => navigate('/dashboard'), 2000);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Failed to create listing');
    } finally {
      setLoading(false);
    }
  }

  if (!user || user.role !== 'farmer') {
    return (
      <div className="container" style={{ padding: '40px 0', textAlign: 'center' }}>
        <h2>Access Denied</h2>
        <p>Only farmers can create product listings.</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '40px 20px', maxWidth: 700 }}>
      {/* Hero Section */}
      <div style={{
        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
        padding: '32px',
        borderRadius: 16,
        marginBottom: 32,
        color: 'white',
        textAlign: 'center'
      }}>
        <h1 style={{ margin: 0, fontSize: 32, marginBottom: 8 }}>🌾 Add New Crop Listing</h1>
        <p style={{ margin: 0, opacity: 0.9 }}>
          List your fresh produce and connect directly with buyers across India
        </p>
      </div>

      {/* Success Message */}
      {success && (
        <div style={{
          padding: 20,
          background: '#d1fae5',
          color: '#065f46',
          borderRadius: 12,
          marginBottom: 24,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          border: '2px solid #10b981'
        }}>
          <span style={{ fontSize: 24 }}>✅</span>
          <div>
            <strong>Success!</strong> Your listing has been created.
            <div style={{ fontSize: 14, marginTop: 4 }}>Redirecting to dashboard...</div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {error && (
          <div style={{ 
            padding: 16, 
            background: '#fee2e2', 
            color: '#dc2626', 
            borderRadius: 12,
            border: '2px solid #ef4444',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <span style={{ fontSize: 20 }}>⚠️</span>
            {error}
          </div>
        )}

        <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20 }}>🌱</span> Crop Name *
          </span>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Organic Tomatoes, Fresh Wheat"
            required
            style={{ 
              padding: '14px 16px', 
              border: '2px solid #e5e7eb', 
              borderRadius: 10,
              fontSize: 16,
              transition: 'border-color 0.2s',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#10b981'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20 }}>📦</span> Category *
          </span>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            style={{ 
              padding: '14px 16px', 
              border: '2px solid #e5e7eb', 
              borderRadius: 10,
              fontSize: 16,
              cursor: 'pointer',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#10b981'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20 }}>📝</span> Description
          </span>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe quality, growing method, organic certification, etc."
            rows={4}
            maxLength={500}
            style={{ 
              padding: '14px 16px', 
              border: '2px solid #e5e7eb', 
              borderRadius: 10,
              fontSize: 16,
              fontFamily: 'inherit',
              resize: 'vertical',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#10b981'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
          <span style={{ fontSize: 12, color: '#6b7280', textAlign: 'right' }}>
            {formData.description.length}/500 characters
          </span>
        </label>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>💰</span> Price per Unit *
            </span>
            <div style={{ position: 'relative' }}>
              <span style={{ 
                position: 'absolute', 
                left: 16, 
                top: '50%', 
                transform: 'translateY(-50%)', 
                color: '#6b7280',
                fontSize: 18,
                fontWeight: 600
              }}>
                ₹
              </span>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0.01"
                required
                style={{ 
                  padding: '14px 16px 14px 38px', 
                  border: '2px solid #e5e7eb', 
                  borderRadius: 10,
                  fontSize: 16,
                  width: '100%',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#10b981'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 20 }}>⚖️</span> Unit *
            </span>
            <select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              style={{ 
                padding: '14px 16px', 
                border: '2px solid #e5e7eb', 
                borderRadius: 10,
                fontSize: 16,
                cursor: 'pointer',
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#10b981'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            >
              {UNITS.map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </label>
        </div>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20 }}>📊</span> Available Quantity *
          </span>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="0"
              step="0.01"
              min="0.01"
              required
              style={{ 
                flex: 1,
                padding: '14px 16px', 
                border: '2px solid #e5e7eb', 
                borderRadius: 10,
                fontSize: 16,
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#10b981'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
            <div style={{ 
              padding: '14px 20px', 
              background: '#f3f4f6',
              border: '2px solid #e5e7eb',
              borderRadius: 10,
              color: '#374151',
              fontWeight: 600,
              minWidth: 80,
              textAlign: 'center'
            }}>
              {formData.unit}
            </div>
          </div>
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20 }}>📍</span> Location
          </span>
          <select
            name="location"
            value={formData.location}
            onChange={handleChange}
            style={{ 
              padding: '14px 16px', 
              border: '2px solid #e5e7eb', 
              borderRadius: 10,
              fontSize: 16,
              cursor: 'pointer',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#10b981'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          >
            <option value="">Select State</option>
            {STATES.map(state => (
              <option key={state} value={state}>{state}</option>
            ))}
          </select>
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontWeight: 600, fontSize: 15, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 20 }}>📷</span> Product Image
          </span>
          
          <div style={{
            border: '2px dashed #d1d5db',
            borderRadius: 10,
            padding: 24,
            textAlign: 'center',
            background: '#f9fafb',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#10b981';
            e.currentTarget.style.background = '#f0fdf4';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#d1d5db';
            e.currentTarget.style.background = '#f9fafb';
          }}
          onClick={() => document.getElementById('imageInput')?.click()}
          >
            <input
              id="imageInput"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
            {imagePreview ? (
              <div style={{ position: 'relative' }}>
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: 300, 
                    borderRadius: 8,
                    objectFit: 'contain'
                  }}
                />
                <div style={{
                  marginTop: 12,
                  fontSize: 14,
                  color: '#10b981',
                  fontWeight: 500
                }}>
                  ✓ Image selected - Click to change
                </div>
              </div>
            ) : (
              <>
                <div style={{ fontSize: 48, marginBottom: 8 }}>📸</div>
                <div style={{ color: '#374151', fontWeight: 500, marginBottom: 4 }}>
                  Click to upload product image
                </div>
                <div style={{ fontSize: 13, color: '#6b7280' }}>
                  PNG, JPG up to 5MB
                </div>
              </>
            )}
          </div>
          
          <div style={{
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: 8,
            padding: 12,
            fontSize: 13,
            color: '#1e40af',
            display: 'flex',
            alignItems: 'start',
            gap: 8
          }}>
            <span style={{ fontSize: 16 }}>💡</span>
            <div>
              <strong>Tip:</strong> High-quality images help buyers make confident purchases. Show your product clearly with good lighting.
            </div>
          </div>
        </label>

        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          <button
            type="submit"
            disabled={loading || success}
            style={{ 
              flex: 1, 
              padding: '16px 24px', 
              fontSize: 16,
              fontWeight: 600,
              background: loading || success ? '#9ca3af' : '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: 10,
              cursor: loading || success ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8
            }}
            onMouseEnter={(e) => {
              if (!loading && !success) {
                e.currentTarget.style.background = '#059669';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(16, 185, 129, 0.3)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading && !success) {
                e.currentTarget.style.background = '#10b981';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }
            }}
          >
            {loading ? (
              <>
                <span style={{ 
                  display: 'inline-block', 
                  width: 16, 
                  height: 16, 
                  border: '2px solid white',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
                Creating...
              </>
            ) : success ? (
              <>✓ Created!</>
            ) : (
              <>✓ Create Listing</>
            )}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            disabled={loading}
            style={{ 
              padding: '16px 24px', 
              fontSize: 16,
              fontWeight: 600,
              background: 'white',
              color: '#374151',
              border: '2px solid #e5e7eb',
              borderRadius: 10,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.background = '#f3f4f6';
                e.currentTarget.style.borderColor = '#d1d5db';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.background = 'white';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }
            }}
          >
            Cancel
          </button>
        </div>
      </form>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
