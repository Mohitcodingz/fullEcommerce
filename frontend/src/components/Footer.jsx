import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <img src="/myBagsLightTheme.png" alt="YBags Logo" />
            
          </Link>
          <p className="footer-copy">
            Carry your story in style.
          </p>
        </div>

        <div className="footer-links">
          <div className="footer-column">
            <h4>Shop</h4>
            <Link to="/shop">New Arrivals</Link>
            <Link to="/shop">Bags</Link>
            <Link to="/shop">Accessories</Link>
          </div>

          <div className="footer-column">
            <h4>Company</h4>
            <Link to="/about">About Us</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/faq">FAQs</Link>
          </div>

          <div className="footer-column">
            <h4>Support</h4>
            <Link to="/shipping">Shipping</Link>
            <Link to="/returns">Returns</Link>
            <Link to="/track-order">Track Order</Link>
          </div>
        </div>

        <div className="footer-newsletter">
          <h4>Stay Updated</h4>
          <form className="newsletter-form">
            <input type="email" placeholder="Enter your email" />
            <button type="submit">Join</button>
          </form>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2026 YBags. All rights reserved.</span>
        <div className="footer-social">
          <a href="#">Instagram</a>
          <a href="#">Facebook</a>
          <a href="#">Pinterest</a>
        </div>
      </div>
    </footer>
  )
}
