import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  useEffect(() => {
    if (id) api.get(`/products/${id}`).then(r => setProduct(r.data)).catch(() => setProduct(null));
  }, [id]);
  if (!product) return <div>Loading...</div>;
  return (
    <div>
      <h2>{product.name}</h2>
      <p>{product.description}</p>
      <p>Price: ₹{product.price}</p>
    </div>
  );
}