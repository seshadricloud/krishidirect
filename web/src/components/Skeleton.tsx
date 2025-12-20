import React from 'react';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  style?: React.CSSProperties;
}

export function Skeleton({ width = '100%', height = 20, borderRadius = 8, style }: SkeletonProps) {
  return (
    <div
      style={{
        width,
        height,
        borderRadius,
        background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s infinite',
        ...style
      }}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div
      style={{
        background: 'white',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
      }}
    >
      {/* Image skeleton */}
      <Skeleton height={200} borderRadius={0} />
      
      <div style={{ padding: 16 }}>
        {/* Category badge skeleton */}
        <Skeleton width={80} height={24} style={{ marginBottom: 12 }} />
        
        {/* Title skeleton */}
        <Skeleton height={24} style={{ marginBottom: 8 }} />
        
        {/* Price skeleton */}
        <Skeleton width={120} height={28} style={{ marginBottom: 12 }} />
        
        {/* Quantity skeleton */}
        <Skeleton width={100} height={16} style={{ marginBottom: 8 }} />
        
        {/* Location skeleton */}
        <Skeleton width={150} height={16} style={{ marginBottom: 16 }} />
        
        {/* Button skeleton */}
        <Skeleton height={44} />
      </div>
    </div>
  );
}

// Add shimmer animation to index.css
