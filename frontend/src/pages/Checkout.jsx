import { useId, useState, useContext, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  CreditCard, 
  Truck, 
  ArrowLeft, 
  Lock, 
  AlertCircle 
} from 'lucide-react';
import AuthContext from '../context/authContextValue';
import { clearCart } from '../redux/cartSlice';
import '../styles/cart.css';
// Add this to load CashFree SDK

export default function Checkout() {
  const { user } = useContext(AuthContext);
  const paymentReference = useId();
  const cartItems = useSelector((state) => state.cart.cartItems || []);
  const dispatch = useDispatch();
  const navigate = useNavigate();
useEffect(() => {
  const script = document.createElement('script');

  script.src = 'https://sdk.cashfree.com/js/v3/cashfree.js';
  script.async = true;

  document.body.appendChild(script);

  return () => {
    if (document.body.contains(script)) {
      document.body.removeChild(script);
    }
  };
}, []);

  const [address, setAddress] = useState({
    fullName: user?.name || '',
    street: '',
    city: '',
    postalCode: '',
    country: 'India'
  });

const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' or 'cashfree'
  const [processing, setProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const subtotal = cartItems.reduce((acc, item) => acc + (Number(item.price) || 0) * (Number(item.qty) || 1), 0);
  const shippingFee = subtotal >= 999 || subtotal === 0 ? 0 : 99;
  const totalPrice = subtotal + shippingFee;

  const placeDirectOrder = async (payId) => {
    try {
      const saveOrderRes = await fetch('/api/orders', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        },
        body: JSON.stringify({
          items: cartItems,
          totalAmount: totalPrice,
          address,
          paymentId: payId || `pay_sim_${Date.now()}`
        })
      });

      if (saveOrderRes.ok) {
        dispatch(clearCart());
        navigate('/ordersuccess');
      } else {
        const errorData = await saveOrderRes.json().catch(() => null);
        setErrorMessage(errorData?.message || 'Order could not be saved. Please try again.');
      }
    } catch {
      setErrorMessage('Network error while saving order.');
    } finally {
      setProcessing(false);
    }
  };
  const handleCashFreePayment = async () => {
  try {
    // 1. Create order in your MongoDB
    const createOrderRes = await fetch('/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`
      },
      body: JSON.stringify({
        items: cartItems,
        totalAmount: totalPrice,
        address,
        paymentId: `cashfree_${Date.now()}`
      })
    });

    if (!createOrderRes.ok) {
      const errorData = await createOrderRes.json().catch(() => null);

      setErrorMessage(
        errorData?.message || 'Failed to create order'
      );

      setProcessing(false);
      return;
    }

    const orderData = await createOrderRes.json();

    const orderId = orderData?.order?._id;

    if (!orderId) {
      setErrorMessage('Order creation failed - no order ID returned');
      setProcessing(false);
      return;
    }

    // 2. Create Cashfree payment order
    const cfOrderRes = await fetch(
      `/api/payment/order/${orderId}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`
        }
      }
    );

    const cfOrderData = await cfOrderRes.json().catch(() => null);

    if (!cfOrderRes.ok) {
      setErrorMessage(
        cfOrderData?.message ||
        'Failed to create Cashfree payment order'
      );

      setProcessing(false);
      return;
    }

    // 3. Make sure Cashfree returned a payment session
    if (!cfOrderData?.payment_session_id) {
      setErrorMessage(
        'Cashfree did not return a payment session ID.'
      );

      setProcessing(false);
      return;
    }

    // 4. Wait until Cashfree SDK is loaded
    if (!window.Cashfree) {
      setErrorMessage(
        'Cashfree SDK is still loading. Please try again.'
      );

      setProcessing(false);
      return;
    }

    // 5. Initialize Cashfree
    const cashfree = window.Cashfree({
      mode: 'sandbox'
    });

    // 6. Open Cashfree hosted checkout
    const checkoutOptions = {
      paymentSessionId: cfOrderData.payment_session_id,
      redirectTarget: '_modal'
    };

    const result = await cashfree.checkout(checkoutOptions);

    console.log('Cashfree checkout result:', result);

    // Cashfree completed/returned from checkout
    if (result?.paymentDetails) {
      console.log(
        'Cashfree payment completed:',
        result.paymentDetails
      );
    }

    setProcessing(false);

  } catch (error) {
    console.error('Cashfree Checkout Error:', error);

    setErrorMessage(
      error?.message ||
      'Unable to open Cashfree payment checkout.'
    );

    setProcessing(false);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (!user) {
      alert("Please login first to proceed with checkout.");
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      navigate('/shop');
      return;
    }

    setProcessing(true);

   if (paymentMethod === 'cod') {
  await placeDirectOrder(`COD_${paymentReference.replace(/:/g, '')}_${Date.now()}`);
} else {
  await handleCashFreePayment();  // ✅ CHANGE
}
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout-container">
        <div className="checkout-content" style={{ textAlign: 'center', margin: '60px auto' }}>
          <h2>Your bag is empty</h2>
          <p>Please add products to your bag before checking out.</p>
          <Link to="/shop" className="btn">Continue Shopping</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <div className="cart-header-row">
        <div className="cart-title-meta">
          <h1>Secure Checkout</h1>
        </div>
        <Link to="/cart" className="continue-shopping-link">
          <ArrowLeft size={16} />
          <span>Back to Bag</span>
        </Link>
      </div>

      {errorMessage && (
        <div className="auth-error-banner" style={{ marginBottom: '20px' }}>
          <AlertCircle size={16} style={{ display: 'inline', marginRight: '6px' }} />
          {errorMessage}
        </div>
      )}

      <div className="cart-main-layout">
        {/* Form Column */}
        <div className="checkout-content">
          <form onSubmit={handleSubmit} className="shipping-form">
            <h3>Shipping Details</h3>
            
            <input 
              type="text" 
              placeholder="Full Recipient Name" 
              required 
              value={address.fullName} 
              onChange={(e) => setAddress({...address, fullName: e.target.value})} 
            />
            <input 
              type="text" 
              placeholder="Street Address, Apt / Suite" 
              required 
              value={address.street} 
              onChange={(e) => setAddress({...address, street: e.target.value})} 
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <input 
                type="text" 
                placeholder="City" 
                required 
                value={address.city} 
                onChange={(e) => setAddress({...address, city: e.target.value})} 
              />
              <input 
                type="text" 
                placeholder="Postal / PIN Code" 
                required 
                value={address.postalCode} 
                onChange={(e) => setAddress({...address, postalCode: e.target.value})} 
              />
            </div>
            <input 
              type="text" 
              placeholder="Country" 
              required 
              value={address.country} 
              onChange={(e) => setAddress({...address, country: e.target.value})} 
            />

            <h3 style={{ marginTop: '24px' }}>Payment Method</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  padding: '14px 16px', 
                  border: `2px solid ${paymentMethod === 'cod' ? '#c45128' : '#d4cabe'}`,
                  borderRadius: '10px',
                  background: paymentMethod === 'cod' ? '#fff9f5' : '#fbf8f2',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  value="cod" 
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                />
                <Truck size={20} color="#c45128" />
                <span>Cash on Delivery / Direct Demo Placement (Instant)</span>
              </label>

              <label 
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  padding: '14px 16px', 
                  border: `2px solid ${paymentMethod === 'razorpay' ? '#c45128' : '#d4cabe'}`,
                  borderRadius: '10px',
                  background: paymentMethod === 'razorpay' ? '#fff9f5' : '#fbf8f2',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
             <input
  type="radio"
  name="paymentMethod"
  value="cashfree"
  checked={paymentMethod === 'cashfree'}
  onChange={() => setPaymentMethod('cashfree')}
/>
  <CreditCard size={20} color="#1f2521" />
  <span>CashFree Payment (UPI, Cards, NetBanking)</span>
              </label>
            </div>

            <div className="checkout-summary">
              <h4>Total: ₹{totalPrice.toLocaleString('en-IN')}</h4>
              <button 
                type="submit" 
                className="btn btn-checkout-main" 
                style={{ width: 'auto', minWidth: '200px' }}
                disabled={processing}
              >
                <Lock size={16} />
                <span>{processing ? 'Processing Order...' : 'Complete Purchase'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Sidebar Order Mini Summary */}
        <aside className="cart-summary-sidebar">
          <div className="summary-card">
            <h2>Order Review</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '18px' }}>
              {cartItems.map((item) => (
                <div key={item.productId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13.5px' }}>
                  <span style={{ color: '#4a544c' }}>{item.qty} × {item.name}</span>
                  <strong>₹{((item.price || 0) * (item.qty || 1)).toLocaleString('en-IN')}</strong>
                </div>
              ))}
            </div>

            <div className="summary-lines">
              <div className="summary-line">
                <span>Subtotal</span>
                <span className="val-text">₹{subtotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="summary-line">
                <span>Shipping</span>
                <span className="val-text">{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
              </div>
              <div className="summary-line total-line">
                <span>Total Amount</span>
                <span className="val-text total-number">₹{totalPrice.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="summary-security-badges">
              <div className="security-badge-item">
                <ShieldCheck size={18} />
                <span>Encrypted & Verified Checkout</span>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

 
