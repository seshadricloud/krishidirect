import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { StarRating } from '../components/StarRating';
import { ReviewForm } from '../components/ReviewForm';
import { ChatWindow } from '../components/ChatWindow';
import { useAuth } from '../hooks/useAuth';

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  user: {
    id: string;
    name: string;
    profileImage: string | null;
  };
}

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [averageRating, setAverageRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const fetchProduct = () => {
    if (id) {
      api.get(`/products/${id}`)
        .then(r => setProduct(r.data))
        .catch(() => setProduct(null));
    }
  };

  const fetchReviews = () => {
    if (id) {
      fetch(`http://localhost:5000/api/reviews/product/${id}`)
        .then(res => res.json())
        .then(data => {
          setReviews(data.reviews || []);
          setAverageRating(data.averageRating || 0);
          setTotalReviews(data.totalReviews || 0);
        })
        .catch(err => console.error('Failed to fetch reviews:', err));
    }
  };

  useEffect(() => {
    fetchProduct();
    fetchReviews();
  }, [id]);

  const handleReviewSubmitted = () => {
    fetchReviews();
    setShowReviewForm(false);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  if (!product) return <div className="container mx-auto px-4 py-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Product Details */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            {/* Image Carousel */}
            {product.images && product.images.length > 0 ? (
              <div className="space-y-4">
                {/* Main Image */}
                <div className="relative">
                  <img 
                    src={product.images[0]} 
                    alt={product.name}
                    className="w-full h-96 object-cover rounded-lg"
                  />
                </div>
                
                {/* Thumbnail Grid */}
                {product.images.length > 1 && (
                  <div className="grid grid-cols-5 gap-2">
                    {product.images.map((img: string, index: number) => (
                      <img
                        key={index}
                        src={img}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-20 object-cover rounded-lg cursor-pointer border-2 border-gray-300 hover:border-green-600 transition"
                        onClick={(e) => {
                          const mainImg = e.currentTarget.parentElement?.parentElement?.querySelector('img');
                          if (mainImg) mainImg.src = img;
                        }}
                      />
                    ))}
                  </div>
                )}
              </div>
            ) : product.image ? (
              <img 
                src={product.image} 
                alt={product.name}
                className="w-full h-96 object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            
            <div className="flex items-center gap-2 mb-4">
              <StarRating rating={averageRating} size="medium" />
              <span className="text-gray-600">
                {averageRating.toFixed(1)} ({totalReviews} {totalReviews === 1 ? 'review' : 'reviews'})
              </span>
            </div>

            <p className="text-2xl text-green-600 font-bold mb-4">
              ₹{product.price} / {product.unit}
            </p>

            <div className="mb-4">
              <p className="text-gray-700 mb-2"><strong>Category:</strong> {product.category || 'N/A'}</p>
              <p className="text-gray-700 mb-2"><strong>Available:</strong> {product.quantity} {product.unit}</p>
              <p className="text-gray-700 mb-2"><strong>Location:</strong> {product.location || 'N/A'}</p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-gray-700">{product.description || 'No description available'}</p>
            </div>

            <div className="flex gap-3">
              <button className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition">
                Add to Cart
              </button>
              {user && user.id !== product.userId && (
                <button
                  onClick={() => setShowChat(true)}
                  className="bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                >
                  <span style={{ fontSize: '20px' }}>💬</span>
                  Chat with Farmer
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Customer Reviews</h2>
          {user && !showReviewForm && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
            >
              Write a Review
            </button>
          )}
        </div>

        {/* Review Form */}
        {showReviewForm && user && (
          <div className="mb-6">
            <ReviewForm productId={id!} onReviewSubmitted={handleReviewSubmitted} />
            <button
              onClick={() => setShowReviewForm(false)}
              className="mt-4 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
          </div>
        )}

        {/* Reviews List */}
        {reviews.length === 0 ? (
          <div className="bg-white p-8 rounded-lg shadow-md text-center text-gray-500">
            No reviews yet. Be the first to review this product!
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <div key={review.id} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {review.user.profileImage ? (
                      <img
                        src={review.user.profileImage}
                        alt={review.user.name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold">
                        {review.user.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold">{review.user.name}</h4>
                        <StarRating rating={review.rating} size="small" />
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDate(review.createdAt)}
                      </span>
                    </div>
                    {review.comment && (
                      <p className="text-gray-700 mt-2">{review.comment}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chat Window */}
      {showChat && product.user && (
        <ChatWindow
          recipientId={product.user.id}
          recipientName={product.user.name}
          productId={product.id}
          onClose={() => setShowChat(false)}
        />
      )}
    </div>
  );
}
