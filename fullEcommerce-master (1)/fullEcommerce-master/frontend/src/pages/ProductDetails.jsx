import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { 
  ShoppingBag, 
  Check, 
  Star, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  ArrowLeft, 
  Plus, 
  Minus, 
  Package, 
  Share2
} from 'lucide-react';
import { addToCart } from '../redux/cartSlice';
import '../styles/product.css';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedToast, setAddedToast] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) {
          throw new Error('Product not found or unavailable');
        }
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Error loading product details');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const price = Number(product?.price) || 0;
  const originalPrice = product?.originalPrice ? Number(product.originalPrice) : Math.round(price * 1.3);
  const stock = typeof product?.stock === 'number' ? product.stock : 12;
  const isOutOfStock = stock <= 0;

  const fallbackImage = 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=800&auto=format&fit=crop&q=80';
  const displayImage = product?.imageUrl || product?.image || fallbackImage;

  const handleAddToCart = (redirectAfter = false) => {
    if (!product || isOutOfStock) return;

    dispatch(addToCart({
      productId: product._id || product.id,
      name: product.name,
      price: price,
      imageUrl: displayImage,
      qty: quantity
    }));

    if (redirectAfter) {
      navigate('/cart');
    } else {
      setAddedToast(true);
      setTimeout(() => setAddedToast(false), 2500);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard?.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="detail-loading-wrapper">
        <div className="detail-skeleton-grid">
          <div className="skeleton-image shimmer"></div>
          <div className="skeleton-details">
            <div className="skeleton-line shimmer short"></div>
            <div className="skeleton-line shimmer" style={{ height: '36px', width: '70%' }}></div>
            <div className="skeleton-line shimmer medium" style={{ height: '28px' }}></div>
            <div className="skeleton-line shimmer" style={{ height: '90px' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="detail-error-wrapper">
        <h2>Product Not Found</h2>
        <p>The product you are looking for may have been removed or is temporarily unavailable.</p>
        <Link to="/shop" className="btn">
          <ArrowLeft size={16} />
          <span>Back to Collection</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="product-detail-page">
      {/* Toast Notification */}
      {addedToast && (
        <div className="toast-notification-banner" role="status" aria-live="polite">
          <Check size={18} className="toast-check-icon" />
          <span>Added <strong>{quantity} × {product.name}</strong> to your bag!</span>
          <Link to="/cart" className="toast-view-cart-link">View Bag</Link>
        </div>
      )}

      {/* Breadcrumb Navigation */}
      <nav className="detail-breadcrumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link>
        <span className="crumb-sep">/</span>
        <Link to="/shop">Shop</Link>
        <span className="crumb-sep">/</span>
        {product.category && (
          <>
            <span>{product.category}</span>
            <span className="crumb-sep">/</span>
          </>
        )}
        <span className="active-crumb">{product.name}</span>
      </nav>

      {/* Main Details Presentation */}
      <div className="product-detail-layout">
        {/* Left Side: Product Image Showcase */}
        <div className="detail-gallery-container">
          <div className="detail-main-image-frame">
            <img 
              src={displayImage} 
              alt={product.name} 
              className="detail-large-image"
              onError={(e) => {
                e.target.src = fallbackImage;
              }}
            />
            {product.category && (
              <span className="detail-category-badge">{product.category}</span>
            )}
          </div>
        </div>

        {/* Right Side: Product Buy Box */}
        <div className="detail-info-column">
          {/* Rating & Social Share */}
          <div className="detail-top-meta">
            <div className="detail-rating-pill">
              <Star size={14} className="star-icon filled" />
              <span>4.9</span>
              <span className="review-count">(42 verified reviews)</span>
            </div>

            <button onClick={handleShare} className="detail-share-btn" title="Share this item">
              <Share2 size={16} />
              <span>Share</span>
            </button>
          </div>

          <h1 className="detail-product-title">{product.name}</h1>

          {/* Pricing */}
          <div className="detail-price-box">
            <span className="current-price">₹{price.toLocaleString('en-IN')}</span>
            {originalPrice > price && (
              <>
                <span className="original-price">₹{originalPrice.toLocaleString('en-IN')}</span>
                <span className="detail-discount-badge">
                  Save ₹{(originalPrice - price).toLocaleString('en-IN')}
                </span>
              </>
            )}
          </div>

          {/* Stock Status Pill */}
          <div className="detail-stock-indicator">
            <span className={`stock-status-badge ${isOutOfStock ? 'out' : 'in'}`}>
              <Package size={14} />
              {isOutOfStock ? 'Temporarily Out of Stock' : `In Stock • Ready to dispatch`}
            </span>
          </div>

          {/* Short Excerpt */}
          <p className="detail-excerpt">
            {product.description || 'Expertly crafted with premium materials, reinforced stitching, and refined hardware tailored for everyday elegance.'}
          </p>

          {/* Purchase Actions: Quantity + Add to Cart + Buy Now */}
          <div className="detail-action-block">
            <div className="detail-qty-group">
              <label htmlFor="qty-stepper-btn">Qty:</label>
              <div className="detail-qty-stepper" id="qty-stepper-btn">
                <button 
                  type="button" 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1 || isOutOfStock}
                  aria-label="Decrease quantity"
                >
                  <Minus size={15} />
                </button>
                <span className="qty-number">{quantity}</span>
                <button 
                  type="button" 
                  onClick={() => setQuantity(quantity + 1)}
                  disabled={isOutOfStock}
                  aria-label="Increase quantity"
                >
                  <Plus size={15} />
                </button>
              </div>
            </div>

            <div className="detail-cta-buttons">
              <button 
                type="button"
                onClick={() => handleAddToCart(false)}
                className={`btn detail-add-cart-btn ${addedToast ? 'added-anim' : ''}`}
                disabled={isOutOfStock}
              >
                {addedToast ? (
                  <>
                    <Check size={18} />
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={18} />
                    <span>Add to Shopping Bag</span>
                  </>
                )}
              </button>

              <button 
                type="button"
                onClick={() => handleAddToCart(true)}
                className="btn detail-buy-now-btn"
                disabled={isOutOfStock}
              >
                Buy Now
              </button>
            </div>
          </div>

          {/* Trust Guarantees */}
          <div className="detail-perks-grid">
            <div className="detail-perk">
              <Truck size={20} />
              <div>
                <strong>Express Delivery</strong>
                <p>Ships in 24 hours. Free on orders &gt; ₹999</p>
              </div>
            </div>
            <div className="detail-perk">
              <RotateCcw size={20} />
              <div>
                <strong>7-Day Returns</strong>
                <p>Hassle-free exchanges & full refunds</p>
              </div>
            </div>
            <div className="detail-perk">
              <ShieldCheck size={20} />
              <div>
                <strong>1-Year Warranty</strong>
                <p>100% genuine craftsmanship guaranteed</p>
              </div>
            </div>
          </div>

          {/* Tabs for Specification & Care */}
          <div className="detail-tabs-section">
            <div className="tabs-header">
              <button 
                className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
                onClick={() => setActiveTab('description')}
              >
                Overview & Details
              </button>
              <button 
                className={`tab-btn ${activeTab === 'shipping' ? 'active' : ''}`}
                onClick={() => setActiveTab('shipping')}
              >
                Shipping & Returns
              </button>
            </div>

            <div className="tab-content">
              {activeTab === 'description' ? (
                <div className="tab-panel">
                  <p>{product.description}</p>
                  <ul className="product-spec-list">
                    <li><strong>Category:</strong> {product.category || 'Luxury Carryall'}</li>
                    <li><strong>Material:</strong> Full-grain leather with weather-resistant lining</li>
                    <li><strong>Hardware:</strong> Brushed brass / antique metallic hardware</li>
                    <li><strong>Pockets:</strong> Dedicated padded laptop sleeve + organizer slots</li>
                  </ul>
                </div>
              ) : (
                <div className="tab-panel">
                  <p>All items are carefully packaged in signature dust bags and inspected before dispatch.</p>
                  <ul className="product-spec-list">
                    <li>Standard Delivery: 3 to 5 business days.</li>
                    <li>Express Delivery: 1 to 2 business days in major metros.</li>
                    <li>Cash on Delivery & Razorpay / UPI accepted.</li>
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}