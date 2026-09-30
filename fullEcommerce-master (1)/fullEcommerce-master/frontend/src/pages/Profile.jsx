import { useContext, useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  ShieldCheck, 
  Package, 
  LogOut, 
  ExternalLink 
} from 'lucide-react';
import AuthContext from '../context/authContextValue';
import '../styles/cart.css';

export default function Profile() {
  const { user, logout } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    if (!user?.token) return;

    const fetchMyOrders = async () => {
      try {
        const res = await fetch('/api/orders/myOrders', {
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
        }
      } catch (err) {
        console.error('Error loading order history:', err);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchMyOrders();
  }, [user]);

  if (!user) return <Navigate to="/login" replace />;

  return (
    <main className="profile-page">
      <div className="cart-header-row">
        <div className="cart-title-meta">
          <span className="homeKicker">Customer Account</span>
          <h1>Welcome, {user.name}</h1>
        </div>
        <button onClick={logout} className="clear-cart-btn" style={{ color: '#c45128' }}>
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Account Info Card */}
      <div style={{
        background: '#fbf8f2',
        border: '1px solid #e7dfd3',
        borderRadius: '14px',
        padding: '24px',
        marginBottom: '36px'
      }}>
        <h3 style={{ margin: '0 0 16px', fontFamily: 'Georgia, serif', fontSize: '20px' }}>Account Information</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <User size={20} color="#c45128" />
            <div>
              <small style={{ color: '#69736b', display: 'block' }}>Name</small>
              <strong>{user.name}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Mail size={20} color="#c45128" />
            <div>
              <small style={{ color: '#69736b', display: 'block' }}>Email Address</small>
              <strong>{user.email}</strong>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <ShieldCheck size={20} color="#c45128" />
            <div>
              <small style={{ color: '#69736b', display: 'block' }}>Account Type</small>
              <strong style={{ textTransform: 'capitalize' }}>{user.role || 'Member'}</strong>
            </div>
          </div>
        </div>

        {user.role === 'admin' && (
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #ded5c8' }}>
            <Link to="/admin" className="btn btn-hero-secondary" style={{ display: 'inline-flex', gap: '8px', fontSize: '13px', padding: '8px 16px' }}>
              <ExternalLink size={15} />
              <span>Go to Admin Dashboard</span>
            </Link>
          </div>
        )}
      </div>

      {/* Orders Section */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <h2 style={{ margin: 0, fontFamily: 'Georgia, serif', fontSize: '24px' }}>Recent Order History</h2>
          <span className="cart-count-pill">{orders.length} {orders.length === 1 ? 'Order' : 'Orders'}</span>
        </div>

        {loadingOrders ? (
          <p style={{ color: '#69736b', padding: '20px 0' }}>Loading your orders...</p>
        ) : orders.length === 0 ? (
          <div style={{
            background: '#ffffff',
            border: '1px dashed #dcd4c7',
            borderRadius: '12px',
            padding: '36px',
            textAlign: 'center'
          }}>
            <Package size={36} color="#8c968f" style={{ marginBottom: '12px' }} />
            <h4 style={{ margin: '0 0 8px' }}>No orders placed yet</h4>
            <p style={{ color: '#69736b', margin: '0 0 18px', fontSize: '14px' }}>
              Your past purchases and tracking history will show up here once you place an order.
            </p>
            <Link to="/shop" className="btn" style={{ display: 'inline-flex', gap: '8px' }}>
              Explore Collection
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {orders.map((orderItem) => (
              <div 
                key={orderItem._id}
                style={{
                  background: '#ffffff',
                  border: '1px solid #e7dfd3',
                  borderRadius: '12px',
                  padding: '18px 20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '14px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                    <strong style={{ fontSize: '15px' }}>Order #{orderItem._id.slice(-6).toUpperCase()}</strong>
                    <span style={{
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '11px',
                      fontWeight: '700',
                      textTransform: 'uppercase',
                      background: orderItem.status === 'delivered' ? '#ecfdf5' : '#fffbeb',
                      color: orderItem.status === 'delivered' ? '#15803d' : '#b45309',
                      border: `1px solid ${orderItem.status === 'delivered' ? '#a7f3d0' : '#fde68a'}`
                    }}>
                      {orderItem.status || 'Pending'}
                    </span>
                  </div>
                  <div style={{ fontSize: '12.5px', color: '#69736b', display: 'flex', gap: '12px' }}>
                    <span>Placed on {new Date(orderItem.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    <span>•</span>
                    <span>Recipient: {orderItem.address?.fullName}</span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '17px', fontWeight: '800', color: '#c45128' }}>
                    ₹{Number(orderItem.totalAmount || 0).toLocaleString('en-IN')}
                  </div>
                  <small style={{ color: '#8c968f', fontSize: '11.5px' }}>Payment ID: {orderItem.paymentId?.slice(0, 15)}...</small>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}