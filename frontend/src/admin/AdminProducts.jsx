import { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AuthContext from '../context/authContextValue'
import '../styles/admin.css'

export default function AdminProducts() {
  const { user } = useContext(AuthContext)
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login')
      return
    }

    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products')
        const data = await response.json()
        if (!response.ok) throw new Error(data.message || 'Could not load products.')
        setProducts(Array.isArray(data) ? data : [])
      } catch (requestError) {
        setError(requestError.message)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [user, navigate])

  const deleteProduct = async (productId) => {
    if (!window.confirm('Delete this product? This cannot be undone.')) return

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user.token}` }
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Could not delete product.')
      setProducts((currentProducts) => currentProducts.filter((product) => product._id !== productId))
    } catch (requestError) {
      setError(requestError.message)
    }
  }

  return (
    <main className="admin-page">
      <header className="admin-heading">
        <div>
          <p className="admin-eyebrow">Catalog</p>
          <h1>Manage products</h1>
        </div>
        <Link className="btn" to="/admin/add-product">Add product</Link>
      </header>
      {error && <p className="admin-error" role="alert">{error}</p>}
      {loading ? <p>Loading products...</p> : products.length === 0 ? <p>No products found.</p> : (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td className="admin-product-name"><img src={product.imageUrl} alt="" /><span>{product.name}</span></td>
                  <td>{product.category}</td>
                  <td>₹{Number(product.price).toFixed(2)}</td>
                  <td>{product.stock}</td>
                  <td className="admin-actions">
                    <Link to={`/admin/edit-product/${product._id}`}>Edit</Link>
                    <button type="button" onClick={() => deleteProduct(product._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}