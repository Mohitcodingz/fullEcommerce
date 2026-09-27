import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Sparkles, 
  Award,
  ChevronRight
} from 'lucide-react';
import ProductCard from '../components/ProductCard';
import '../styles/home.css';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchProducts() {
      try {
        setLoading(true);
        const response = await fetch('/api/products');
        const data = await response.json().catch(() => null);

        if (!response.ok) {
          throw new Error(data?.message || `Unable to load products (${response.status})`);
        }

        // Show top 8 products for a rich home display
        setProducts(Array.isArray(data) ? data.slice(0, 8) : []);
      } catch (err) {
        console.error(err);
        setError(err.message || 'Unable to load products');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  return (
    <div className="homepage-wrapper">
      {/* Editorial Hero Section */}
      <section className="hero-editorial-section">
        <div className="hero-editorial-content">
          <div className="hero-pill-badge">
            <Sparkles size={14} className="sparkle-gold" />
            <span>Handcrafted Luxury Leather • 2026 Edition</span>
          </div>

          <h1 className="hero-title">
            Carry your story <br className="hero-break" />
            in <span className="hero-italic">uncompromising</span> style.
          </h1>

          <p className="hero-description">
            Thoughtfully engineered bags and everyday accessories crafted from full-grain materials for the places you are going and the life you carry.
          </p>

          <div className="hero-action-group">
            <Link to="/shop" className="btn btn-hero-primary">
              <span>Explore Collection</span>
              <ArrowRight size={18} />
            </Link>
            <Link to="/about" className="btn btn-hero-secondary">
              <span>Our Craftsmanship</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Trust & Value Proposition Ribbon */}
      <section className="value-props-ribbon" aria-label="Brand Guarantees">
        <div className="value-prop-card">
          <div className="prop-icon-halo">
            <Truck size={22} />
          </div>
          <div>
            <h4>Free Shipping</h4>
            <p>On all domestic orders over ₹999</p>
          </div>
        </div>

        <div className="value-prop-card">
          <div className="prop-icon-halo">
            <Award size={22} />
          </div>
          <div>
            <h4>Artisan Leather</h4>
            <p>100% full-grain sustainable materials</p>
          </div>
        </div>

        <div className="value-prop-card">
          <div className="prop-icon-halo">
            <RotateCcw size={22} />
          </div>
          <div>
            <h4>7-Day Returns</h4>
            <p>No questions asked easy replacement</p>
          </div>
        </div>

        <div className="value-prop-card">
          <div className="prop-icon-halo">
            <ShieldCheck size={22} />
          </div>
          <div>
            <h4>Secure Checkout</h4>
            <p>256-bit encrypted card & UPI payment</p>
          </div>
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section className="featured-section">
        <div className="section-header-row">
          <div>
            <span className="section-kicker">Curated for your journey</span>
            <h2 className="section-title">Featured Masterpieces</h2>
          </div>
          <Link to="/shop" className="view-all-link">
            <span>View All Products</span>
            <ChevronRight size={18} />
          </Link>
        </div>

        {loading ? (
          <div className="home-loading-grid">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="product-skeleton-card">
                <div className="skeleton-image shimmer"></div>
                <div className="skeleton-details">
                  <div className="skeleton-line shimmer short"></div>
                  <div className="skeleton-line shimmer"></div>
                  <div className="skeleton-line shimmer medium"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="home-error-state">
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="btn">Retry Loading</button>
          </div>
        ) : products.length === 0 ? (
          <div className="home-empty-state">
            <p>No featured products available at this moment. Check back soon!</p>
          </div>
        ) : (
          <div className="featured-product-grid">
            {products.map((item) => (
              <ProductCard key={item._id || item.id} product={item} />
            ))}
          </div>
        )}
      </section>

      {/* Brand Craftsmanship Spotlight Banner */}
      <section className="craftsmanship-banner">
        <div className="craft-banner-inner">
          <span className="craft-kicker">Signature Quality</span>
          <h2>Engineered for durability. Finished by hand.</h2>
          <p>
            Every seam is reinforced with high-tensile threads, water-repellent biological linings, and hand-finished edges that age with a rich patina unique to your travels.
          </p>
          <Link to="/shop" className="btn btn-craft-cta">
            <span>Discover The Details</span>
            <ArrowRight size={17} />
          </Link>
        </div>
      </section>
    </div>
  );
}
