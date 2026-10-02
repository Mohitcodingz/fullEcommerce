// import { useContext, useState } from 'react';
// import { Link, Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom';
// import {
//   ChartNoAxesCombined,
//   ChevronLeft,
//   LayoutDashboard,
//   LogOut,
//   Menu,
//   PackagePlus,
//   PackageSearch,
//   ShoppingBag,
//   UsersRound,
//   X,
// } from 'lucide-react';
// import AuthContext from '../context/authContextValue';
// import '../styles/admin.css';

// const navigation = [
//   { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
//   { to: '/admin/products', label: 'Products', icon: PackageSearch },
//   { to: '/admin/add-product', label: 'Add product', icon: PackagePlus },
//   { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
//   { to: '/admin/users', label: 'Customers', icon: UsersRound },
// ];

// export default function AdminLayout() {
//   const { user, logout } = useContext(AuthContext);
//   const navigate = useNavigate();
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const closeMenu = () => setIsMenuOpen(false);

//   const handleLogout = () => {
//     closeMenu();
//     logout();
//     navigate('/login');
//   };

//   if (!user || user.role !== 'admin') {
//     return <Navigate to="/login" replace />;
//   }

//   return (
//     <div className="admin-shell">
//       <button
//         className={`admin-backdrop ${isMenuOpen ? 'is-visible' : ''}`}
//         aria-label="Close menu"
//         onClick={closeMenu}
//       />

//       <aside className={`admin-sidebar ${isMenuOpen ? 'is-open' : ''}`}>
//         <div className="admin-brand-row">
//           <Link to="/admin" className="admin-brand" onClick={closeMenu}>
//             <span className="admin-brand-mark"><ChartNoAxesCombined size={19} /></span>
//             <span>ShopNest</span>
//           </Link>
//           <button className="admin-close-menu" onClick={closeMenu} aria-label="Close menu">
//             <X size={20} />
//           </button>
//         </div>

//         <p className="admin-sidebar-label">Store management</p>
//         <nav className="admin-navigation" aria-label="Admin navigation">
//           {navigation.map(({ to, label, icon: Icon, end }) => (
//             <NavLink
//               key={to}
//               to={to}
//               end={end}
//               onClick={closeMenu}
//               className={({ isActive }) => `admin-nav-link${isActive ? ' is-active' : ''}`}
//             >
//               <Icon size={18} />
//               <span>{label}</span>
//             </NavLink>
//           ))}
//         </nav>

//         <div className="admin-sidebar-bottom">
//           <Link to="/" className="admin-store-link" onClick={closeMenu}>
//             <ChevronLeft size={16} />
//             View storefront
//           </Link>
//           <div className="admin-user-card">
//             <span className="admin-user-avatar">{user.name?.charAt(0)?.toUpperCase() || 'A'}</span>
//             <div>
//               <strong>{user.name || 'Store admin'}</strong>
//               <span>{user.email || 'Administrator'}</span>
//             </div>
//             <button onClick={handleLogout} title="Sign out" aria-label="Sign out">
//               <LogOut size={16} />
//             </button>
//           </div>
//         </div>
//       </aside>

//       <div className="admin-workspace">
//         <header className="admin-mobile-header">
//           <button className="admin-menu-button" onClick={() => setIsMenuOpen(true)} aria-label="Open admin menu">
//             <Menu size={21} />
//           </button>
//           <Link to="/admin" className="admin-brand"><span className="admin-brand-mark"><ChartNoAxesCombined size={17} /></span>ShopNest</Link>
//           <Link to="/" className="admin-mobile-store-link">Store</Link>
//         </header>
//         <main className="admin-main-content">
//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }
import { useContext, useState } from 'react';
import { Link, Navigate, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  ChartNoAxesCombined,
  ChevronLeft,
  LayoutDashboard,
  LogOut,
  Menu,
  PackagePlus,
  PackageSearch,
  ShoppingBag,
  UsersRound,
  X,
} from 'lucide-react';
import AuthContext from '../context/authContextValue';
import '../styles/admin.css';

const navigation = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: PackageSearch },
  { to: '/admin/add-product', label: 'Add product', icon: PackagePlus },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/users', label: 'Customers', icon: UsersRound },
];

export default function AdminLayout() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  const handleLogout = () => {
    closeMenu();
    logout();
    navigate('/login');
  };

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="admin-shell">
      <button
        className={`admin-backdrop ${isMenuOpen ? 'is-visible' : ''}`}
        aria-label="Close menu"
        onClick={closeMenu}
      />

      <aside className={`admin-sidebar ${isMenuOpen ? 'is-open' : ''}`}>
        <div className="admin-brand-row">
          <Link to="/admin" className="admin-brand" onClick={closeMenu}>
            <span className="admin-brand-mark"><ChartNoAxesCombined size={19} /></span>
            <span>ShopNest</span>
          </Link>
          <button className="admin-close-menu" onClick={closeMenu} aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <p className="admin-sidebar-label">Store management</p>
        <nav className="admin-navigation" aria-label="Admin navigation">
          {navigation.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={closeMenu}
              className={({ isActive }) => `admin-nav-link${isActive ? ' is-active' : ''}`}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar-bottom">
          <Link to="/" className="admin-store-link" onClick={closeMenu}>
            <ChevronLeft size={16} />
            View storefront
          </Link>
          <div className="admin-user-card">
            <span className="admin-user-avatar">{user.name?.charAt(0)?.toUpperCase() || 'A'}</span>
            <div>
              <strong>{user.name || 'Store admin'}</strong>
              <span>{user.email || 'Administrator'}</span>
            </div>
            <button onClick={handleLogout} title="Sign out" aria-label="Sign out">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      <div className="admin-workspace">
        <header className="admin-mobile-header">
          <button className="admin-menu-button" onClick={() => setIsMenuOpen(true)} aria-label="Open admin menu">
            <Menu size={21} />
          </button>
          <Link to="/admin" className="admin-brand"><span className="admin-brand-mark"><ChartNoAxesCombined size={17} /></span>ShopNest</Link>
          <Link to="/" className="admin-mobile-store-link">Store</Link>
        </header>
        <main className="admin-main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
