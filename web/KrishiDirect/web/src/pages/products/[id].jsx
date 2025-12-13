import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getProductById } from '../../services/productService';
import Loader from '../../components/ui/Loader';
import Card from '../../components/ui/Card';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const data = await getProductById(id);
        setProduct(data);
      } catch (err) {
        setError('Failed to fetch product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <Loader />;
  if (error) return <div>{error}</div>;

  return (
    <div className="product-detail">
      <Card>
        <h1>{product.name}</h1>
        <img src={product.imageUrl} alt={product.name} />
        <p>{product.description}</p>
        <p>Price: ${product.price}</p>
      </Card>
    </div>
  );
};

export default ProductDetail;