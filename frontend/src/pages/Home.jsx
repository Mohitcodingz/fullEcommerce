import React, { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard'
import '../styles/home.css'
// comment
export default function Home() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products')
        const data = await response.json().catch(() => null)

        if (!response.ok) {
          throw new Error(data?.message || `Unable to load products (${response.status})`)
        }

        setProducts(Array.isArray(data) ? data.slice(0, 4) : [])
      } catch (error) {
        console.error(error)
        setError(error.message || 'Unable to load products')
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  return (
    <div className="homepageContainer">
      <section className="homeIntro">
        <p className="homeKicker">The YBags edit</p>
        <h1>Carry your story in style.</h1>
        <p>Thoughtful bags for the places you are going and the life you are carrying.</p>
      </section>

      <section className="featuredSection">
        <div className="sectionHeading">
          <p className="homeKicker">Curated for you</p>
          <h2>Featured Products</h2>
        </div>
        {loading ? (
          <div className="loadingState">Loading the latest arrivals...</div>
        ) : error ? (
          <div className="errorState">{error}</div>
        ) : (
          <div className="productGrid">
            {products.map((item) => (
              <ProductCard key={item._id} product={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
