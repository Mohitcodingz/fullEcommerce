import { Link } from 'react-router-dom'
import '../styles/productCard.css'
export default function ProductCard({ product }) {
  return (
    <div className='productCard'>
      <img src={product.imageUrl} alt={product.name} className='productImage' />
      {/* Name, price, viewdetails */}
      <div className="productInfo">
      <h3>{product.name}</h3>
      <p>{product.price}</p>
      <Link to={`/product/${product._id}`} className='productDetails'>
      View details
      </Link>
      </div>
    </div>
  )
}
