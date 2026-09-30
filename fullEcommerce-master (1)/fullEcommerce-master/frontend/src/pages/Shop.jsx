import { useEffect, useState, useMemo } from 'react';
import { Search, SlidersHorizontal, X, Sparkles, AlertCircle } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import '../styles/product.css';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filters & Sorting state
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured');
  const [priceFilter, setPriceFilter] = useState('all');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await fetch('/api/products');
        if (!res.ok) {
          throw new Error('Failed to load catalog');
        }
        const data = await res.json();
        setProducts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError('Unable to load products. Please check server connection.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Compute unique categories dynamically from products data
  const categories = useMemo(() => {
    const set = new Set();
    products.forEach((p) => {
      if (p.category && typeof p.category === 'string') {
        set.add(p.category.trim());
      }
    });
    return ['All', ...Array.from(set)];
  }, [products]);

  // Filter and Sort Pipeline
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // 1. Search Query
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((p) => 
        p.name?.toLowerCase().includes(q) || 
        p.description?.toLowerCase().includes(q) ||
        p.category?.toLowerCase().includes(q)
      );
    }

    // 2. Category Filter
    if (selectedCategory !== 'All') {
      result = result.filter((p) => 
        p.category?.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // 3. Price Filter
    if (priceFilter === 'under1000') {
      result = result.filter((p) => (Number(p.price) || 0) < 1000);
    } else if (priceFilter === '1000to3000') {
      result = result.filter((p) => (Number(p.price) || 0) >= 1000 && (Number(p.price) || 0) <= 3000);
    } else if (priceFilter === 'above3000') {
      result = result.filter((p) => (Number(p.price) || 0) > 3000);
    }

    // 4. Sorting
    if (sortBy === 'price-low') {
      result.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    } else if (sortBy === 'name-asc') {
      result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }

    return result;
  }, [products, search, selectedCategory, priceFilter, sortBy]);

  const resetAllFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSortBy('featured');
    setPriceFilter('all');
  };

  return (
    <div className="shop-page-wrapper">
      {/* Hero Header */}
      <section className="shop-hero-header">
        <span className="shop-kicker">Curated Bag Collection</span>
        <h1>Explore Handcrafted Essentials</h1>
        <p>
          Timeless designs, durable materials, and modern utility built for your everyday carry.
        </p>
      </section>

      {/* Control Bar: Search, Category Pills, Filters & Sorting */}
      <div className="shop-controls-container">
        {/* Search input + Sort row */}
        <div className="shop-search-sort-bar">
          <div className="shop-search-wrapper">
            <Search size={18} className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by bag name, leather, style..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="shop-search-input"
            />
            {search && (
              <button 
                onClick={() => setSearch('')} 
                className="clear-search-btn"
                title="Clear search"
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="shop-sort-controls">
            <div className="filter-select-group">
              <SlidersHorizontal size={15} />
              <select 
                value={priceFilter} 
                onChange={(e) => setPriceFilter(e.target.value)}
                className="filter-dropdown"
                aria-label="Filter by Price"
              >
                <option value="all">All Prices</option>
                <option value="under1000">Under ₹1,000</option>
                <option value="1000to3000">₹1,000 - ₹3,000</option>
                <option value="above3000">Above ₹3,000</option>
              </select>
            </div>

            <div className="filter-select-group">
              <span className="sort-label">Sort:</span>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-dropdown"
                aria-label="Sort products"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
              </select>
            </div>
          </div>
        </div>

        {/* Category Pills Navigation */}
        <div className="category-chips-row" role="tablist" aria-label="Product Categories">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`category-chip ${selectedCategory === cat ? 'active' : ''}`}
              role="tab"
              aria-selected={selectedCategory === cat}
            >
              {cat === 'All' && <Sparkles size={13} className="chip-icon" />}
              <span>{cat}</span>
            </button>
          ))}
        </div>

        {/* Results summary & Active Filters indicator */}
        <div className="shop-results-info">
          <span>
            Showing <strong>{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'product' : 'products'}
          </span>
          {(search || selectedCategory !== 'All' || priceFilter !== 'all') && (
            <button onClick={resetAllFilters} className="btn-reset-filters">
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* Main Product Showcase Section */}
      <main className="shop-main-content">
        {loading ? (
          <div className="shop-loading-grid">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
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
          <div className="shop-error-card">
            <AlertCircle size={40} className="error-icon" />
            <h3>Unable to load catalog</h3>
            <p>{error}</p>
            <button onClick={() => window.location.reload()} className="btn">Retry</button>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="shop-no-results">
            <Search size={44} className="no-results-icon" />
            <h3>No products found</h3>
            <p>
              We couldn't find any products matching your current filters or search query.
            </p>
            <button onClick={resetAllFilters} className="btn btn-empty-cta">
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="shop-product-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product._id || product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}