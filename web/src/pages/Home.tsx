import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface HomeProps {
  userName?: string;
}

export default function Home({ userName = 'Farmer' }: HomeProps): JSX.Element {
  const [count, setCount] = useState(0);

  const images = [
    'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80',
    'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&q=80',
    'https://images.unsplash.com/photo-1595855759920-86d3879c5b40?w=800&q=80'
  ];

  const features = [
    { icon: '/icons/crop-listing.svg', title: 'Crop Listing', desc: 'List produce with photos & quality tags.' },
    { icon: '/icons/direct-orders.svg', title: 'Direct Orders', desc: 'Receive orders straight from buyers.' },
    { icon: '/icons/notifications.svg', title: 'Notifications', desc: 'Instant alerts for orders & messages.' },
    { icon: '/icons/realtime-pricing.svg', title: 'Real-time Pricing', desc: 'Live market price updates.' },
    { icon: '/icons/secure-payments.svg', title: 'Secure Payments', desc: 'Safe payouts, direct to your account.' },
    { icon: '/icons/location.svg', title: 'Nearby Discovery', desc: 'Buyers find produce by distance.' }
  ];

  return (
    <div>
      <main>
        <section className="hero" style={{ paddingTop: 36, paddingBottom: 36 }}>
          <div className="container hero-grid">
            <div className="hero-content">
              <h1 style={{ margin: 0, fontSize: 44, color: 'var(--text)' }}>
                Connecting Farmers Directly to Buyers
              </h1>
              <p className="lead" style={{ marginTop: 12 }}>
                Fair prices • No middlemen • Transparent marketplace
              </p>

              <div style={{ marginTop: 18, display: 'flex', gap: 12 }}>
                <Link to="/products" className="btn btn-primary">Browse Products</Link>
                <a href="#download" className="btn btn-outline">Download App</a>
              </div>

              {userName && (
                <p className="micro" style={{ marginTop: 12, color: 'var(--muted)' }}>
                  Welcome back, <strong>{userName}</strong> — sell smarter, faster.
                </p>
              )}
            </div>

            <div className="hero-media" aria-hidden>
              <div style={{ display: 'grid', gap: 12 }}>
                {images.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={i === 0 ? 'Farmers using mobile app' : `Farm image ${i}`}
                    className="hero-illustration"
                    style={{
                      borderRadius: 16,
                      boxShadow: i === 0 ? '0 30px 60px rgba(15,23,42,0.10)' : '0 12px 28px rgba(15,23,42,0.06)',
                      transform: i === 1 ? 'rotate(-4deg) scale(0.98)' : i === 2 ? 'rotate(6deg) scale(0.98)' : 'none'
                    }}
                    onError={(e) => (e.currentTarget.style.display = 'none')}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="features" className="features container" style={{ paddingTop: 28, paddingBottom: 28 }}>
          <h2 style={{ marginBottom: 12 }}>Core Features</h2>
          <div className="feature-grid" style={{ marginTop: 12 }}>
            {features.map((f) => (
              <article key={f.title} className="card" style={{ minHeight: 130 }}>
                <img src={f.icon} alt={`${f.title} icon`} className="icon" />
                <h3 style={{ margin: '8px 0' }}>{f.title}</h3>
                <p style={{ margin: 0, color: 'var(--muted)' }}>{f.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="quick-actions container" style={{ paddingTop: 20, paddingBottom: 40 }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
            <Link to="/products" className="btn btn-outline">Browse Listings</Link>
            <Link to="/products/new" className="btn btn-primary">Create Listing</Link>
            <Link to="/profile" className="btn">Your Dashboard</Link>
            <div style={{ marginLeft: 'auto', color: 'var(--muted)' }}>Need help? <Link to="/contact">Contact us</Link></div>
          </div>
        </section>
      </main>
    </div>
  );
}
