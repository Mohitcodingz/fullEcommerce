import { Link } from 'react-router-dom';
import '../styles/footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <img 
              src="/myBagsLightTheme.png" 
              alt="YBags Logo" 
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <span style={{ display: 'none', color: '#fff', fontSize: '22px', fontWeight: 'bold', fontFamily: 'Georgia, serif' }}>
              YBags
            </span>
          </Link>
          <p className="footer-copy">
            Carry your story in uncompromising style. Handcrafted leather bags and lifestyle essentials designed for every journey.
          </p>
        </div>

        <div className="footer-links">
          <div className="footer-column">
            <h4>Shop</h4>
            <Link to="/shop">All Bags</Link>
            <Link to="/shop">New Arrivals</Link>
            <Link to="/shop">Travel & Duffels</Link>
            <Link to="/shop">Everyday Carry</Link>
          </div>

          <div className="footer-column">
            <h4>Company</h4>
            <Link to="/about">Our Story</Link>
            <Link to="/returns">Return Policy</Link>
            <Link to="/disclaimer">Disclaimer</Link>
          </div>

          <div className="footer-column">
            <h4>Customer Care</h4>
            <Link to="/profile">My Account</Link>
            <Link to="/cart">Shopping Bag</Link>
            <Link to="/returns">7-Day Free Exchanges</Link>
          </div>
        </div>

        <div className="footer-newsletter">
          <h4>Exclusive Club</h4>
          <p style={{ color: '#d7ded8', fontSize: '13px', margin: '0 0 12px', maxWidth: '240px' }}>
            Subscribe for secret seasonal drops and 10% off your first luxury order.
          </p>
          <form className="newsletter-form" onSubmit={(e) => { e.preventDefault(); alert('Thank you for joining our private circle!'); }}>
            <input type="email" placeholder="Your email..." required />
            <button type="submit">Join</button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 YBags Atelier. Designed with precision & elegance.</span>
        <div className="footer-social">
          <Link to="/shop">Collection</Link>
          <Link to="/about">About Us</Link>
          <Link to="/returns">Returns</Link>
        </div>
      </div>
    </footer>
  );
}
