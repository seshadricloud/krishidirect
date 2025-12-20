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
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    if (!files) return;

    if (images.length + files.length > 5) {
      setError('Maximum 5 images allowed');
      return;
    }

    const newImages: string[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 5 * 1024 * 1024) {
        setError(`${file.name} is too large. Max 5MB per image.`);
        continue;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        newImages.push(base64);
        if (newImages.length === files.length) {
          setImages(prev => [...prev, ...newImages].slice(0, 5));
          if (newImages.length > 0) {
            setFormData(prev => ({ ...prev, image: newImages[0] }));
          }
        }
      };
      reader.readAsDataURL(file);
    }
  }

  function removeImage(index: number) {
    setImages(prev => prev.filter((_, i) => i !== index));
    if (index === 0 && images.length > 1) {
      setFormData(prev => ({ ...prev, image: images[1] }));
    }
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
        image: formData.image || undefined,
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
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
      padding: '60px 20px'
    }}>
      <div style={{ 
        maxWidth: 650,
        margin: '0 auto',
        background: 'white',
        borderRadius: 24,
        boxShadow: '0 20px 60px rgba(0,0,0,0.08)',
        padding: '48px'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{ 
            width: 80,
            height: 80,
            margin: '0 auto 20px',
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 40
          }}>
            🌾
          </div>
          <h1 style={{ 
            fontSize: 32,
            fontWeight: 700,
            color: '#1f2937',
            marginBottom: 12
          }}>
            Add New Crop Listing
          </h1>
          <p style={{ 
            color: '#6b7280',
            fontSize: 16
          }}>
            List your fresh produce and connect directly with buyers
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {error && (
            <div style={{ 
              padding: 16, 
              background: '#fee2e2', 
              color: '#dc2626', 
              borderRadius: 12,
              border: '1px solid #fecaca',
              display: 'flex',
              alignItems: 'center',
              gap: 12
            }}>
              <span style={{ fontSize: 20 }}>⚠️</span>
              <span>{error}</span>
            </div>
          )}

        <label style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={{ 
            fontWeight: 600,
            color: '#374151',
            fontSize: 14,
            letterSpacing: '0.5px'
          }}>
            Crop Name *
          </span>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Organic Tomatoes"
            required
            style={{ 
              padding: '14px 18px', 
              border: '2px solid #e5e7eb', 
              borderRadius: 12,
              fontSize: 16,
              transition: 'all 0.2s',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#22c55e'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={{ 
            fontWeight: 600,
            color: '#374151',
            fontSize: 14,
            letterSpacing: '0.5px'
          }}>
            Category *
          </span>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            style={{ 
              padding: '14px 18px', 
              border: '2px solid #e5e7eb', 
              borderRadius: 12,
              fontSize: 16,
              background: 'white',
              cursor: 'pointer'
            }}
          >
            {CATEGORIES.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={{ 
            fontWeight: 600,
            color: '#374151',
            fontSize: 14,
            letterSpacing: '0.5px'
          }}>
            Description
          </span>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe your product quality, growing method, etc."
            rows={4}
            style={{ 
              padding: '14px 18px', 
              border: '2px solid #e5e7eb', 
              borderRadius: 12,
              fontSize: 16,
              fontFamily: 'inherit',
              resize: 'vertical',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#22c55e'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
        </label>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', 
          gap: 20,
          alignItems: 'end'
        }}>
          <label style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span style={{ 
              fontWeight: 600,
              color: '#374151',
              fontSize: 14,
              letterSpacing: '0.5px'
            }}>
              Price per Unit *
            </span>
            <div style={{ position: 'relative' }}>
              <span style={{ 
                position: 'absolute',
                left: 18,
                top: '50%',
                transform: 'translateY(-50%)',
                color: '#16a34a',
                fontWeight: 600,
                fontSize: 16
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
                min="0"
                required
                style={{ 
                  padding: '14px 18px 14px 36px', 
                  border: '2px solid #e5e7eb', 
                  borderRadius: 12,
                  fontSize: 16,
                  width: '100%',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#22c55e'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
          </label>

          <label style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <span style={{ 
              fontWeight: 600,
              color: '#374151',
              fontSize: 14,
              letterSpacing: '0.5px'
            }}>
              Unit
            </span>
            <select
              name="unit"
              value={formData.unit}
              onChange={handleChange}
              style={{ 
                padding: '14px 18px', 
                border: '2px solid #e5e7eb', 
                borderRadius: 12,
                fontSize: 16,
                background: 'white',
                cursor: 'pointer',
                boxSizing: 'border-box'
              }}
            >
              {UNITS.map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </label>
        </div>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={{ 
            fontWeight: 600,
            color: '#374151',
            fontSize: 14,
            letterSpacing: '0.5px'
          }}>
            Available Quantity *
          </span>
          <div style={{ display: 'flex', gap: 12 }}>
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
                padding: '14px 18px', 
                border: '2px solid #e5e7eb', 
                borderRadius: 12,
                fontSize: 16,
                outline: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = '#22c55e'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
            <div style={{ 
              padding: '14px 20px', 
              background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
              border: '2px solid #22c55e',
              borderRadius: 12,
              color: '#16a34a',
              fontWeight: 600,
              minWidth: 80,
              textAlign: 'center'
            }}>
              {formData.unit}
            </div>
          </div>
        </label>

        <label style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={{ 
            fontWeight: 600,
            color: '#374151',
            fontSize: 14,
            letterSpacing: '0.5px'
          }}>
            Location
          </span>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., Village, District, State"
            style={{ 
              padding: '14px 18px', 
              border: '2px solid #e5e7eb', 
              borderRadius: 12,
              fontSize: 16,
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#22c55e'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
        </label>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <span style={{ 
            fontWeight: 600,
            color: '#374151',
            fontSize: 14,
            letterSpacing: '0.5px'
          }}>
            Product Images (Max 5)
          </span>
          
          <label style={{
            padding: '32px 20px',
            border: '2px dashed #22c55e',
            borderRadius: 12,
            background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
            cursor: 'pointer',
            textAlign: 'center',
            transition: 'all 0.2s'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.borderColor = '#16a34a';
            e.currentTarget.style.background = 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.borderColor = '#22c55e';
            e.currentTarget.style.background = 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)';
          }}>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageUpload}
              disabled={images.length >= 5}
              style={{ display: 'none' }}
            />
            <div style={{ fontSize: 40, marginBottom: 8 }}>📷</div>
            <div style={{ fontWeight: 600, color: '#16a34a', marginBottom: 4 }}>
              {images.length >= 5 ? 'Maximum images reached' : 'Click to upload images'}
            </div>
            <div style={{ fontSize: 13, color: '#6b7280' }}>
              {images.length}/5 images • Max 5MB per image
            </div>
          </label>

          {images.length > 0 && (
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
              gap: 12,
              marginTop: 8
            }}>
              {images.map((img, idx) => (
                <div key={idx} style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: '2px solid #e5e7eb' }}>
                  <img src={img} alt={`Preview ${idx + 1}`} style={{ width: '100%', height: 140, objectFit: 'cover' }} />
                  <button
                    type="button"
                    onClick={() => removeImage(idx)}
                    style={{
                      position: 'absolute',
                      top: 6,
                      right: 6,
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background: 'rgba(239, 68, 68, 0.9)',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: 16,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 'bold'
                    }}
                  >
                    ×
                  </button>
                  {idx === 0 && (
                    <div style={{
                      position: 'absolute',
                      bottom: 6,
                      left: 6,
                      padding: '4px 8px',
                      background: 'rgba(34, 197, 94, 0.9)',
                      color: 'white',
                      borderRadius: 6,
                      fontSize: 11,
                      fontWeight: 600
                    }}>
                      Main
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
          <button
            type="submit"
            disabled={loading}
            style={{ 
              flex: 1,
              padding: '16px 32px',
              fontSize: 17,
              fontWeight: 600,
              background: loading ? '#9ca3af' : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              color: 'white',
              border: 'none',
              borderRadius: 12,
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 4px 16px rgba(34, 197, 94, 0.3)',
              transition: 'all 0.3s',
              transform: loading ? 'scale(1)' : 'scale(1)'
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(34, 197, 94, 0.4)';
              }
            }}
            onMouseOut={(e) => {
              if (!loading) {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(34, 197, 94, 0.3)';
              }
            }}
          >
            {loading ? '🔄 Creating Listing...' : '✓ Create Listing'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            style={{ 
              padding: '16px 32px',
              fontSize: 17,
              fontWeight: 600,
              background: 'white',
              color: '#6b7280',
              border: '2px solid #e5e7eb',
              borderRadius: 12,
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.borderColor = '#d1d5db';
              e.currentTarget.style.color = '#374151';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.borderColor = '#e5e7eb';
              e.currentTarget.style.color = '#6b7280';
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
  );
}
