import { Link } from 'react-router-dom'

export default function OrderSuccess() {
  return (
    <main className="order-success">
      <p className="homeKicker">Order confirmed</p>
      <h1>Thank you for your purchase.</h1>
      <p>Your order has been placed. You can continue browsing the collection.</p>
      <Link className="btn" to="/shop">Continue shopping</Link>
    </main>
  )
}