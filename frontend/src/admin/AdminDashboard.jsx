import { useCallback, useContext, useEffect, useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  Boxes,
  ChartNoAxesCombined,
  ChevronRight,
  CirclePlus,
  LayoutDashboard,
  PackagePlus,
  RefreshCw,
  ShoppingBag,
  Store,
  UsersRound,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/authContextValue';
import '../styles/admin.css';

const navigation = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Boxes },
  { to: '/admin/add-product', label: 'Add product', icon: PackagePlus },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/users', label: 'Customers', icon: UsersRound },
];

const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 2,
});

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
}

function getStatsFromResponse(data) {
  const stats = {
    totalRevenue: Number(data.totalRevenue),
    totalOrders: Number(data.totalOrder),
    totalProducts: Number(data.totalProduct),
    totalCustomers: Number(data.totalUser),
  };

  if (Object.values(stats).some((value) => !Number.isFinite(value))) {
    throw new Error('The analytics response did not include valid dashboard totals.');
  }

  return stats;
}

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshCount, setRefreshCount] = useState(0);

  const refreshStats = useCallback(() => {
    setRefreshCount((count) => count + 1);
  }, []);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/', { replace: true });
      return undefined;
    }

    const controller = new AbortController();

    async function fetchStats() {
      setIsLoading(true);
      setError('');

      try {
        const response = await fetch('/api/analytics', {
          headers: { Authorization: `Bearer ${user.token}` },
          signal: controller.signal,
        });
        const data = await response.json();

        if (response.status === 401) {
          navigate('/login', { replace: true });
          return;
        }
        if (!response.ok) {
          throw new Error(data.message || 'Unable to load store analytics.');
        }

        setStats(getStatsFromResponse(data));
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message || 'Unable to load store analytics.');
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    fetchStats();
    return () => controller.abort();
  }, [user, navigate, refreshCount]);

  const firstName = user?.name?.trim().split(/\s+/)[0] || 'Admin';
  const orderValue = stats?.totalOrders
    ? stats.totalRevenue / stats.totalOrders
    : 0;

  const metrics = stats
    ? [
        {
          label: 'Total revenue',
          value: currencyFormatter.format(stats.totalRevenue),
          detail: 'Revenue across all orders',
          icon: ChartNoAxesCombined,
          tone: 'revenue',
          featured: true,
        },
        {
          label: 'Orders',
          value: stats.totalOrders.toLocaleString('en-IN'),
          detail: 'Orders placed in your store',
          icon: ShoppingBag,
          tone: 'orders',
        },
        {
          label: 'Products',
          value: stats.totalProducts.toLocaleString('en-IN'),
          detail: 'Items in your catalog',
          icon: Boxes,
          tone: 'products',
        },
        {
          label: 'Customers',
          value: stats.totalCustomers.toLocaleString('en-IN'),
          detail: 'Registered customer accounts',
          icon: UsersRound,
          tone: 'customers',
        },
      ]
    : [];

  return (
    <div className="admin-dashboard">
      <aside className="dashboard-sidebar">
        <Link to="/admin" className="dashboard-brand" aria-label="ShopNest admin home">
          <span className="dashboard-brand-mark">
            <ChartNoAxesCombined size={20} />
          </span>
          <span>ShopNest<span className="dashboard-brand-caption">ADMIN STUDIO</span></span>
        </Link>

        <p className="dashboard-nav-heading">Workspace</p>
        <nav className="dashboard-navigation" aria-label="Admin navigation">
          {navigation.map(({ to, label, icon: Icon, end }) => (
            <Link
              key={to}
              to={to}
              className={`dashboard-nav-link${end ? ' is-active' : ''}`}
              aria-current={end ? 'page' : undefined}
            >
              <Icon size={18} strokeWidth={1.8} />
              <span>{label}</span>
              {end && <span className="dashboard-nav-indicator" />}
            </Link>
          ))}
        </nav>

        <div className="dashboard-sidebar-bottom">
          <Link to="/" className="dashboard-store-link">
            <Store size={17} />
            <span>View storefront</span>
            <ArrowUpRight size={15} />
          </Link>
          <div className="dashboard-account">
            <span className="dashboard-avatar">{firstName.charAt(0).toUpperCase()}</span>
            <span className="dashboard-account-copy">
              <strong>{user?.name || 'Store admin'}</strong>
              <small>{user?.email || 'Administrator'}</small>
            </span>
            <span className="dashboard-account-status" aria-label="Administrator account" />
          </div>
        </div>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div className="dashboard-breadcrumb">
            <span>Workspace</span>
            <ChevronRight size={14} />
            <strong>Overview</strong>
          </div>
          <div className="dashboard-topbar-meta">
            <span className="dashboard-live-indicator"><i /> Store overview</span>
            <span className="dashboard-date">
              {new Intl.DateTimeFormat('en-IN', {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              }).format(new Date())}
            </span>
          </div>
        </header>

        <div className="dashboard-content">
          <section className="dashboard-welcome">
            <div>
              <p className="dashboard-eyebrow">Your store at a glance</p>
              <h1>{getGreeting()}, {firstName}<span>.</span></h1>
              <p className="dashboard-intro">Here’s what’s happening with your store today.</p>
            </div>
            <button
              className="dashboard-refresh-button"
              type="button"
              onClick={refreshStats}
              disabled={isLoading}
            >
              <RefreshCw size={16} className={isLoading ? 'is-spinning' : ''} />
              {isLoading ? 'Refreshing' : 'Refresh overview'}
            </button>
          </section>

          {error && (
            <div className="dashboard-error" role="alert">
              <span>{error}</span>
              <button type="button" onClick={refreshStats}>Try again</button>
            </div>
          )}

          {isLoading && !stats ? (
            <div className="dashboard-loading" role="status">
              <span className="dashboard-loader" />
              Loading your store overview…
            </div>
          ) : stats ? (
            <>
              <section className="dashboard-metrics" aria-label="Store performance">
                {metrics.map(({ label, value, detail, icon: Icon, tone, featured }) => (
                  <article
                    key={label}
                    className={`dashboard-metric-card tone-${tone}${featured ? ' is-featured' : ''}`}
                  >
                    <div className="dashboard-metric-top">
                      <span className="dashboard-metric-icon"><Icon size={19} strokeWidth={1.8} /></span>
                      <span className="dashboard-metric-period">
                        {featured && <ArrowUpRight size={14} />}
                        All time
                      </span>
                    </div>
                    <p className="dashboard-metric-label">{label}</p>
                    <strong className="dashboard-metric-value">{value}</strong>
                    <span className="dashboard-metric-detail">{detail}</span>
                  </article>
                ))}
              </section>

              <section className="dashboard-lower-grid">
                <article className="dashboard-revenue-panel">
                  <div className="dashboard-section-heading">
                    <div>
                      <p className="dashboard-eyebrow">Business summary</p>
                      <h2>Revenue overview</h2>
                    </div>
                    <span className="dashboard-summary-icon"><ChartNoAxesCombined size={18} /></span>
                  </div>
                  <div className="dashboard-revenue-total">
                    <strong>{currencyFormatter.format(stats.totalRevenue)}</strong>
                    <span>total revenue</span>
                  </div>
                  <div className="dashboard-summary-divider" />
                  <div className="dashboard-summary-row">
                    <span className="dashboard-summary-symbol"><ShoppingBag size={17} /></span>
                    <span className="dashboard-summary-label">Average order value</span>
                    <strong>{currencyFormatter.format(orderValue)}</strong>
                  </div>
                  <div className="dashboard-summary-row">
                    <span className="dashboard-summary-symbol"><Boxes size={17} /></span>
                    <span className="dashboard-summary-label">Products in catalog</span>
                    <strong>{stats.totalProducts.toLocaleString('en-IN')}</strong>
                  </div>
                </article>

                <article className="dashboard-quick-panel">
                  <div className="dashboard-section-heading">
                    <div>
                      <p className="dashboard-eyebrow">Keep things moving</p>
                      <h2>Quick actions</h2>
                    </div>
                    <span className="dashboard-summary-icon"><CirclePlus size={18} /></span>
                  </div>
                  <Link to="/admin/add-product" className="dashboard-action-link">
                    <span className="dashboard-action-icon action-add"><PackagePlus size={18} /></span>
                    <span className="dashboard-action-copy">
                      <strong>Add a product</strong>
                      <small>Grow your store catalog</small>
                    </span>
                    <ChevronRight size={17} />
                  </Link>
                  <Link to="/admin/orders" className="dashboard-action-link">
                    <span className="dashboard-action-icon action-orders"><ShoppingBag size={18} /></span>
                    <span className="dashboard-action-copy">
                      <strong>Manage orders</strong>
                      <small>{stats.totalOrders.toLocaleString('en-IN')} total orders</small>
                    </span>
                    <ChevronRight size={17} />
                  </Link>
                  <Link to="/admin/products" className="dashboard-action-link">
                    <span className="dashboard-action-icon action-products"><Boxes size={18} /></span>
                    <span className="dashboard-action-copy">
                      <strong>View products</strong>
                      <small>{stats.totalProducts.toLocaleString('en-IN')} products listed</small>
                    </span>
                    <ChevronRight size={17} />
                  </Link>
                </article>
              </section>

              <footer className="dashboard-footer">
                <span><span className="dashboard-footer-dot" /> Your store data is up to date</span>
                <span>Numbers shown are lifetime totals</span>
              </footer>
            </>
          ) : (
            <div className="dashboard-empty-state">
              <span className="dashboard-empty-icon"><ArrowDownRight size={21} /></span>
              <h2>We couldn’t load your overview</h2>
              <p>Check your connection and try loading your store data again.</p>
              <button type="button" onClick={refreshStats}>Retry loading data</button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
