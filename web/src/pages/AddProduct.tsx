import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import api from '../api';
import { ImageUpload } from '../components/ImageUpload';

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
    images: [] as string[],
    location: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  function handleImagesChange(images: string[]) {
    setFormData(prev => ({ ...prev, images }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!formData.name || !formData.price || !formData.quantity) {
      return setError('Please fill in all required fields');
    }

    setLoading(true);
    try {
      await api.post('/products', {
        name: formData.name,
        description: formData.description || undefined,
        price: parseFloat(formData.price),
        quantity: parseFloat(formData.quantity),
        unit: formData.unit,
        category: formData.category,
        image: formData.images[0] || undefined,
        images: formData.images,
        location: formData.location || undefined
      });

      navigate('/dashboard');
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
    <div className="container" style={{ padding: '40px 0', maxWidth: 600 }}>
      <h1>Add New Crop Listing</h1>
      <p style={{ color: '#6b7280', marginBottom: 32 }}>
        List your fresh produce and connect directly with buyers
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
        {error && (
          <div style={{ padding: 16, background: '#fee2e2', color: '#dc2626', borderRadius: 8 }}>
            {error}
          </div>
        )}

        <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontWeight: 600 }}>Crop Name *</span>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Organic Tomatoes"
            required
            style={{ 
              padding: '12px 16px', 
              border: '1px solid #d1d5db', 
              borderRadius: 8,
              fontSize: 16
            }}
          />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontWeight: 600 }}>Category *</span>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            style={{ 
              padding: '12px 16px', 
              border: '1px solid #d1d5db', 
              borderRadius: 8,
              fontSize: 16
            }}
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontWeight: 600 }}>Description</span>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your product quality, growing method, etc."
            rows={3}
            style={{ 
              padding: '12px 16px', 
              border: '1px solid #d1d5db', 
              borderRadius: 8,
              fontSize: 16,
              fontFamily: 'inherit'
            }}
          />
        </label>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontWeight: 600 }}>Price per Unit *</span>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 16, top: '50%', transform: 'translateY(-50%)', color: '#6b7280' }}>
                ₹
              </span>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
                style={{ 
                  padding: '12px 16px 12px 32px', 
                  border: '1px solid #d1d5db', 
                  borderRadius: 8,
                  fontSize: 16,
                  width: '100%'
                }}
              />
            </div>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <span style={{ fontWeight: 600 }}>Unit</span>
            <select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              style={{ 
                padding: '12px 16px', 
                border: '1px solid #d1d5db', 
                borderRadius: 8,
                fontSize: 16
              }}
            >
              {UNITS.map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </label>
        </div>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontWeight: 600 }}>Available Quantity *</span>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="number"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="0"
              step="0.01"
              min="0"
              required
              style={{ 
                flex: 1,
                padding: '12px 16px', 
                border: '1px solid #d1d5db', 
                borderRadius: 8,
                fontSize: 16
              }}
            />
            <div style={{ 
              padding: '12px 16px', 
              background: '#f9fafb',
              border: '1px solid #d1d5db',
              borderRadius: 8,
              color: '#6b7280'
            }}>
              {formData.unit}
            </div>
          </div>
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <span style={{ fontWeight: 600 }}>Location</span>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., Village, District, State"
            style={{ 
              padding: '12px 16px', 
              border: '1px solid #d1d5db', 
              borderRadius: 8,
              fontSize: 16
            }}
          />
        </label>

        <ImageUpload 
          images={formData.images}
          onImagesChange={handleImagesChange}
          maxImages={5}
          maxSizeMB={2}
        />

        <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ flex: 1, padding: '14px 24px', fontSize: 16 }}
          >
            {loading ? 'Creating Listing...' : '✓ Create Listing'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="btn"
            style={{ padding: '14px 24px', fontSize: 16 }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
