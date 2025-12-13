// ProductCard.tsx
import React from 'react';

// Define the props for the ProductCard component
interface ProductCardProps {
    id: string;
    name: string;
    price: number;
    imageUrl: string;
    description: string;
}

// Functional component to display individual product details
const ProductCard: React.FC<ProductCardProps> = ({ id, name, price, imageUrl, description }) => {
    return (
        <div className="product-card" key={id}>
            <img src={imageUrl} alt={name} className="product-image" />
            <h2 className="product-name">{name}</h2>
            <p className="product-description">{description}</p>
            <p className="product-price">${price.toFixed(2)}</p>
            <button className="add-to-cart-button">Add to Cart</button>
        </div>
    );
};

export default ProductCard;