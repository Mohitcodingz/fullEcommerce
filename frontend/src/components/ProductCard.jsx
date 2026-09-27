import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { ShoppingBag, Check, Eye, Star } from 'lucide-react';
import { addToCart } from '../redux/cartSlice';
import '../styles/productCard.css';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const [isAdded, setIsAdded] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  if (!product) return null;

  const productId = product._id || product.id;
  const price = Number(product.price) || 0;
  const originalPrice = product.originalPrice ? Number(product.originalPrice) : Math.round(price * 1.25);
  const stock = typeof product.stock === 'number' ? product.stock : 15;
  const category = product.category || 'Handcrafted Collection';
  const rating = product.rating || 4.8;

  // Placeholder fallback if image is missing or broken
  const fallbackImage = 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80';
  const displayImage = product.imageUrl || product.image || fallbackImage;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    dispatch(addToCart({
      productId: productId,
      name: product.name,
      price: price,
      imageUrl: displayImage,
      qty: 1
    }));

    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
    }, 1400);
  };

  return (
    <article className="product-card" aria-label={product.name}>
      {/* Top Media Frame */}
      <div className="product-media-container">
        {category && (
          <span className="product-category-chip">{category}</span>
        )}

        {stock <= 5 && stock > 0 && (
          <span className="stock-alert-chip">Only {stock} Left!</span>
        )}

        <Link to={`/product/${productId}`} className="product-image-anchor" tabIndex={-1}>
          <img 
            src={displayImage} 
            alt={product.name}
            className={`product-img ${imageLoaded ? 'loaded' : 'loading'}`}
            onLoad={() => setImageLoaded(true)}
            onError={(e) => {
              e.target.src = fallbackImage;
              setImageLoaded(true);
            }}
            loading="lazy"
          />
        </Link>

        {/* Hover Quick Action Buttons */}
        <div className="product-hover-overlay">
          <Link 
            to={`/product/${productId}`} 
            className="hover-action-btn view-btn"
            title="View Details"
            aria-label="View Details"
          >
            <Eye size={17} />
            <span>Details</span>
          </Link>

          <button 
            type="button"
            onClick={handleAddToCart}
            className={`hover-action-btn cart-quick-btn ${isAdded ? 'added' : ''}`}
            disabled={stock <= 0}
            title={isAdded ? "Added to Bag" : "Add to Shopping Bag"}
            aria-label={isAdded ? "Added to Bag" : "Add to Shopping Bag"}
          >
            {isAdded ? (
              <>
                <Check size={17} className="check-icon" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag size={17} />
                <span>+ Cart</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="product-content">
        {/* Rating & reviews */}
        <div className="product-rating-row">
          <div className="stars-wrapper" aria-label={`Rated ${rating} out of 5 stars`}>
            <Star size={13} className="star-icon filled" />
            <span className="rating-value">{rating}</span>
          </div>
          <span className="rating-reviews-count">(28 reviews)</span>
        </div>

        {/* Product Title */}
        <h3 className="product-title">
          <Link to={`/product/${productId}`} title={product.name}>
            {product.name}
          </Link>
        </h3>

        {/* Pricing Row */}
        <div className="product-price-row">
          <div className="price-tag-group">
            <span className="price-current">₹{price.toLocaleString('en-IN')}</span>
            {originalPrice > price && (
              <span className="price-original">₹{originalPrice.toLocaleString('en-IN')}</span>
            )}
          </div>

          {originalPrice > price && (
            <span className="discount-tag">Save ₹{(originalPrice - price).toLocaleString('en-IN')}</span>
          )}
        </div>

        {/* Mobile/Direct Add to Cart Button */}
        <div className="product-footer-actions">
          <button 
            type="button" 
            className={`btn-card-add ${isAdded ? 'btn-added' : ''}`}
            onClick={handleAddToCart}
            disabled={stock <= 0}
          >
            {isAdded ? (
              <>
                <Check size={16} />
                <span>Added to Bag</span>
              </>
            ) : stock <= 0 ? (
              <span>Out of Stock</span>
            ) : (
              <>
                <ShoppingBag size={16} />
                <span>Add to Bag</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
