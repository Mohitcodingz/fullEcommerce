import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Tag, 
  CheckCircle2, 
  ArrowLeft 
} from 'lucide-react';
import { removeFromCart, updateCartQty, clearCart } from '../redux/cartSlice';
import '../styles/cart.css';

export default function Cart() {
  const cartItems = useSelector((state) => state.cart.cartItems || []);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoDiscountRate, setPromoDiscountRate] = useState(0);
  const [promoMessage, setPromoMessage] = useState('');

  // Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + (Number(item.price) || 0) * (Number(item.qty) || 1), 0);
  const totalItemCount = cartItems.reduce((acc, item) => acc + (Number(item.qty) || 1), 0);
  
  // Free shipping threshold: ₹999
  const FREE_SHIPPING_THRESHOLD = 999;
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD || subtotal === 0;
  const shippingFee = isFreeShipping ? 0 : 99;
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  // Promo discount
  const discountAmount = promoApplied ? Math.round(subtotal * promoDiscountRate) : 0;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    const cleanCode = promoCode.trim().toUpperCase();
    if (!cleanCode) return;

    if (cleanCode === 'WELCOME10' || cleanCode === 'YBAGS10') {
      setPromoApplied(true);
      setPromoDiscountRate(0.10);
      setPromoMessage('🎉 10% Welcome Discount applied!');
    } else if (cleanCode === 'SAVE20') {
      setPromoApplied(true);
      setPromoDiscountRate(0.20);
      setPromoMessage('🌟 20% Super Saver applied!');
    } else {
      setPromoApplied(false);
      setPromoDiscountRate(0);
      setPromoMessage('❌ Invalid coupon code. Try WELCOME10');
    }
  };

  const handleQuantityChange = (productId, currentQty, delta) => {
    const nextQty = currentQty + delta;
    if (nextQty <= 0) {
      if (window.confirm('Remove this item from your shopping bag?')) {
        dispatch(removeFromCart(productId));
      }
    } else {
      dispatch(updateCartQty({ productId, qty: nextQty }));
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to empty your entire bag?')) {
      dispatch(clearCart());
    }
  };

  // If bag is empty
  if (cartItems.length === 0) {
    return (
      <div className="cart-empty-page">
        <div className="empty-cart-card">
          <div className="empty-icon-halo">
            <ShoppingBag size={52} className="empty-cart-icon" />
          </div>
          <h2>Your shopping bag is empty</h2>
          <p>
            Looks like you haven't added anything to your cart yet. Discover our latest collection of handcrafted leather bags and travel accessories.
          </p>
          <Link to="/shop" className="btn btn-empty-cta">
            <span>Explore Collection</span>
            <ArrowRight size={18} />
          </Link>

          <div className="empty-perks-row">
            <div className="perk-item">
              <Truck size={20} />
              <span>Free Shipping &gt; ₹999</span>
            </div>
            <div className="perk-item">
              <RotateCcw size={20} />
              <span>7-Day Easy Returns</span>
            </div>
            <div className="perk-item">
              <ShieldCheck size={20} />
              <span>Authentic Guarantee</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page-wrapper">
      {/* Page Title & Navigation Bar */}
      <div className="cart-header-row">
        <div className="cart-title-meta">
          <h1>Shopping Bag</h1>
          <span className="cart-count-pill">{totalItemCount} {totalItemCount === 1 ? 'item' : 'items'}</span>
        </div>
        <div className="cart-header-actions">
          <Link to="/shop" className="continue-shopping-link">
            <ArrowLeft size={16} />
            <span>Continue Shopping</span>
          </Link>
          <button onClick={handleClearAll} className="clear-cart-btn" title="Empty shopping bag">
            <Trash2 size={15} />
            <span>Clear Bag</span>
          </button>
        </div>
      </div>

      {/* Free Shipping Meter */}
      <div className="shipping-progress-banner">
        {isFreeShipping ? (
          <div className="free-shipping-unlocked">
            <CheckCircle2 size={18} />
            <span>Congratulations! You have unlocked <strong>FREE Standard Shipping</strong></span>
          </div>
        ) : (
          <div className="free-shipping-needed">
            <Truck size={18} />
            <span>Add <strong>₹{amountToFreeShipping.toLocaleString('en-IN')}</strong> more to unlock <strong>FREE Shipping!</strong></span>
          </div>
        )}
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${freeShippingProgress}%` }}></div>
        </div>
      </div>

      {/* Main Cart Layout: Items List (Left) + Summary (Right) */}
      <div className="cart-main-layout">
        {/* Left Column: Items */}
        <section className="cart-items-section" aria-label="Cart Items">
          <div className="cart-items-list">
            {cartItems.map((item) => {
              const itemTotal = (Number(item.price) || 0) * (Number(item.qty) || 1);
              return (
                <article key={item.productId} className="cart-item-row">
                  <div className="cart-item-thumb-wrapper">
                    <Link to={`/product/${item.productId}`}>
                      <img 
                        src={item.imageUrl || 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300'} 
                        alt={item.name} 
                        className="cart-item-thumb"
                        onError={(e) => {
                          e.target.src = 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=300';
                        }}
                      />
                    </Link>
                  </div>

                  <div className="cart-item-info">
                    <div className="cart-item-top">
                      <h3 className="cart-item-title">
                        <Link to={`/product/${item.productId}`}>{item.name}</Link>
                      </h3>
                      <button 
                        type="button"
                        onClick={() => dispatch(removeFromCart(item.productId))}
                        className="cart-item-remove-btn"
                        title="Remove product"
                        aria-label={`Remove ${item.name} from bag`}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="cart-item-unit-price">
                      <span>Unit Price: <strong>₹{Number(item.price).toLocaleString('en-IN')}</strong></span>
                    </div>

                    <div className="cart-item-bottom">
                      {/* Quantity Stepper */}
                      <div className="cart-qty-stepper">
                        <button 
                          type="button"
                          onClick={() => handleQuantityChange(item.productId, item.qty, -1)}
                          className="qty-step-btn"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="qty-val" aria-label={`Quantity: ${item.qty}`}>{item.qty}</span>
                        <button 
                          type="button"
                          onClick={() => handleQuantityChange(item.productId, item.qty, 1)}
                          className="qty-step-btn"
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Subtotal for this item */}
                      <div className="cart-item-subtotal">
                        <span className="subtotal-label">Subtotal:</span>
                        <span className="subtotal-number">₹{itemTotal.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </section>

        {/* Right Column: Order Summary Card */}
        <aside className="cart-summary-sidebar" aria-label="Order Summary">
          <div className="summary-card">
            <h2>Order Summary</h2>

            {/* Price breakdown */}
            <div className="summary-lines">
              <div className="summary-line">
                <span>Subtotal ({totalItemCount} {totalItemCount === 1 ? 'item' : 'items'})</span>
                <span className="val-text">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>

              <div className="summary-line">
                <span>Estimated Shipping</span>
                <span className={`val-text ${isFreeShipping ? 'free-tag' : ''}`}>
                  {isFreeShipping ? 'FREE' : `₹${shippingFee}`}
                </span>
              </div>

              {promoApplied && (
                <div className="summary-line discount-line">
                  <span>Promo Discount ({promoDiscountRate * 100}%)</span>
                  <span className="val-text discount-val">- ₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              <div className="summary-line total-line">
                <span>Estimated Total</span>
                <span className="val-text total-number">₹{grandTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Promo Code Input */}
            <form onSubmit={handleApplyPromo} className="promo-form">
              <div className="promo-input-group">
                <Tag size={16} className="promo-tag-icon" />
                <input 
                  type="text" 
                  placeholder="Promo Code (try WELCOME10)" 
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="promo-input"
                />
                <button type="submit" className="promo-apply-btn">Apply</button>
              </div>
              {promoMessage && (
                <p className={`promo-alert ${promoApplied ? 'success' : 'error'}`}>
                  {promoMessage}
                </p>
              )}
            </form>

            {/* Checkout Action Button */}
            <button 
              onClick={() => navigate('/checkout')} 
              className="btn btn-checkout-main"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight size={18} />
            </button>

            {/* Trust Badges */}
            <div className="summary-security-badges">
              <div className="security-badge-item">
                <ShieldCheck size={18} />
                <span>256-Bit SSL Encrypted Checkout</span>
              </div>
              <div className="security-badge-item">
                <Truck size={18} />
                <span>Tracked & Insured Shipping</span>
              </div>
              <div className="security-badge-item">
                <RotateCcw size={18} />
                <span>Easy 7-Day Replacement Guarantee</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}