import React, { useEffect, useState } from 'react'
import ProductCard from '../components/ProductCard'
export default function () {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    async function fetchProducts() {
      try {
        const resolve = await fetch('/api/products');
        const data = await resolve.json();
        setProducts(data.slice(0, 4))
      }
      catch (error) {
        console.log(error)
      }
      finally {
        setLoading(false);
      }
    }
  }, [])
  return (
    <div className='homepageContainer'>
      <h1>Featured Products</h1>
      {loading ? (<div>loading</div>) : (<div>
        {products.map((item) => {
          <ProductCard key={item._id} product={item} />
        })}

      </div>)}
    </div>
  )
}
