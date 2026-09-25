import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import About from './pages/About'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout.jsx'
import Disclaimer from './pages/Disclaimer'
import Home from './pages/Home'
import Login from './pages/Login'
import OrderSuccess from './pages/OrderSuccess'
import ProductDetail from './pages/ProductDetails'
import Profile from './pages/Profile'
import Register from './pages/Register'
import ReturnPolicy from './pages/ReturnPolicy'
import Shop from './pages/Shop'
import AddProduct from './admin/AddProduct.jsx'
import AdminDashboard from './admin/AdminDashboard'
import AdminOrders from './admin/AdminOrders'
import AdminProducts from './admin/AdminProducts'
import AdminUsers from './admin/AdminUsers'
import EditProduct from './admin/EditProduct'
import Footer from './components/Footer'
import Navbar from './components/Navbar'

export default function App() {
  return (
    <div className="app-shell">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/ordersuccess" element={<OrderSuccess />} />
          <Route path="/about" element={<About />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/returns" element={<ReturnPolicy />} />
          <Route path="/return" element={<Navigate to="/returns" replace />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/add-product" element={<AddProduct />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/edit-product/:id" element={<EditProduct />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </BrowserRouter>
    </div>
  )
}