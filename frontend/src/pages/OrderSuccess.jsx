import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, PackageCheck, ArrowRight, ShoppingBag } from 'lucide-react';
import '../styles/cart.css';

export default function OrderSuccess() {
  const [orderNumber] = useState(() => Math.floor(100000 + Math.random() * 900000));

  return (
    <main className="order-success">
      <div style={{ textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{
          width: '74px',
          height: '74px',
          background: '#eef8f1',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
          color: '#15803d'
        }}>
          <CheckCircle2 size={44} />
        </div>

        <span className="homeKicker" style={{ color: '#15803d' }}>Order Confirmed</span>
        <h1>Thank you for your purchase!</h1>
        <p style={{ fontSize: '16px', color: '#5d685f' }}>
          Your order <strong>#YB-{orderNumber}</strong> has been successfully placed. We are preparing your handcrafted package with utmost care.
        </p>

        <div style={{
          background: '#fbf8f2',
          border: '1px solid #e7dfd3',
          borderRadius: '12px',
          padding: '20px',
          margin: '28px 0',
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          textAlign: 'left'
        }}>
          <PackageCheck size={32} color="#c45128" />
          <div>
            <h4 style={{ margin: '0 0 4px', fontSize: '15px' }}>Complimentary Tracking Sent</h4>
            <p style={{ margin: 0, fontSize: '13px', color: '#69736b' }}>
              A confirmation receipt and shipment tracking details have been generated.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link className="btn btn-checkout-main" to="/shop" style={{ width: 'auto', padding: '14px 28px' }}>
            <ShoppingBag size={18} />
            <span>Continue Shopping</span>
          </Link>
          <Link className="btn btn-hero-secondary" to="/profile" style={{ width: 'auto', padding: '14px 24px' }}>
            <span>View My Orders</span>
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </main>
  );
}