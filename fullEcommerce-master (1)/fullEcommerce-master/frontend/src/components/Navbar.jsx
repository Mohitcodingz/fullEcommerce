import { useContext, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X, 
  ShieldAlert, 
  Sparkles 
} from 'lucide-react';
import AuthContext from '../context/authContextValue';
import '../styles/navbar.css';

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const cartItems = useSelector((state) => state.cart.cartItems || []);
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Total quantity of items in cart
  const totalCartCount = cartItems.reduce((acc, item) => acc + (Number(item.qty) || 1), 0);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const handleLogout = () => {
    closeMobileMenu();
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar-header">
      {/* Top micro announcement bar */}
      <div className="announcement-bar">
        <span>✨ Handcrafted Luxury • Complimentary Nationwide Shipping on Orders Above ₹999</span>
      </div>

      <nav className="navbar" aria-label="Main Navigation">
        <div className="navbar-container">
          {/* Brand Logo */}
          <div className="navbarBrand">
            <Link to="/" className="brand-link" aria-label="YBags Home" onClick={closeMobileMenu}>
              <img 
                src="/myBagsLightTheme.png" 
                alt="YBags" 
                className="navbarLogo"
                onError={(e) => {
                  e.target.style.display = 'none';
                  if (e.target.nextSibling) {
                    e.target.nextSibling.style.display = 'flex';
                  }
                }}
              />
              <span className="logo-text-fallback" style={{ display: 'none' }}>
                <Sparkles className="logo-sparkle" size={18} />
                YBags
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <ul className="navbarLinks desktop-nav">
            <li>
              <NavLink to="/" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Home
              </NavLink>
            </li>
            <li>
              <NavLink to="/shop" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Shop Collection
              </NavLink>
            </li>
            <li>
              <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Our Story
              </NavLink>
            </li>
            <li>
              <NavLink to="/returns" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
                Returns
              </NavLink>
            </li>
          </ul>

          {/* Right Action Icons (Cart, Profile/Auth, Hamburger) */}
          <div className="navbar-actions">
            {/* Cart Button with Animated Badge */}
            <Link 
              to="/cart" 
              className="cart-nav-btn"
              onClick={closeMobileMenu}
              aria-label={`Shopping Cart with ${totalCartCount} items`}
            >
              <div className="cart-icon-wrapper">
                <ShoppingBag className="cart-icon" size={22} />
                {totalCartCount > 0 && (
                  <span key={totalCartCount} className="cart-badge" aria-live="polite">
                    {totalCartCount > 99 ? '99+' : totalCartCount}
                  </span>
                )}
              </div>
              <span className="cart-label">Cart</span>
            </Link>

            {/* User Profile or Login */}
            {user ? (
              <div className="user-nav-group desktop-only">
                {user.role === 'admin' && (
                  <Link to="/admin" className="admin-pill-link">
                    <ShieldAlert size={14} />
                    <span>Admin</span>
                  </Link>
                )}
                <Link to="/profile" className="profile-pill-link" title="My Profile">
                  <UserIcon size={16} />
                  <span className="user-name-label">{user.name?.split(' ')[0] || 'Account'}</span>
                </Link>
                <button 
                  onClick={handleLogout} 
                  className="nav-logout-btn" 
                  title="Sign Out"
                  aria-label="Sign Out"
                >
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            ) : (
              <div className="auth-nav-group desktop-only">
                <Link to="/login" className="nav-login-btn">
                  <UserIcon size={16} />
                  <span>Sign In</span>
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button 
              className="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <div className={`mobile-drawer ${mobileMenuOpen ? 'open' : ''}`}>
          <div className="mobile-drawer-content">
            <ul className="mobile-nav-links">
              <li>
                <Link to="/" onClick={closeMobileMenu}>Home</Link>
              </li>
              <li>
                <Link to="/shop" onClick={closeMobileMenu}>Shop Collection</Link>
              </li>
              <li>
                <Link to="/about" onClick={closeMobileMenu}>Our Story</Link>
              </li>
              <li>
                <Link to="/returns" onClick={closeMobileMenu}>Return Policy</Link>
              </li>
              <li>
                <Link to="/cart" onClick={closeMobileMenu}>Shopping Bag ({totalCartCount})</Link>
              </li>
            </ul>

            <div className="mobile-auth-section">
              {user ? (
                <>
                  <div className="mobile-user-info">
                    <UserIcon size={18} />
                    <span>Signed in as <strong>{user.name}</strong></span>
                  </div>
                  {user.role === 'admin' && (
                    <Link to="/admin" onClick={closeMobileMenu} className="mobile-admin-link">
                      <ShieldAlert size={16} /> Admin Portal
                    </Link>
                  )}
                  <Link to="/profile" onClick={closeMobileMenu} className="mobile-profile-link">
                    View Profile
                  </Link>
                  <button onClick={handleLogout} className="mobile-logout-btn">
                    <LogOut size={16} /> Sign Out
                  </button>
                </>
              ) : (
                <div className="mobile-guest-buttons">
                  <Link to="/login" onClick={closeMobileMenu} className="btn btn-primary-mobile">Sign In</Link>
                  <Link to="/register" onClick={closeMobileMenu} className="btn btn-secondary-mobile">Create Account</Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
