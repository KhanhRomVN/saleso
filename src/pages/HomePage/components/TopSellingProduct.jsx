import React, { useState, useEffect } from 'react'
import axios from 'axios'
import ProductGrid from '~/components/ProductGrid/ProductGrid'
import { BACKEND_URI } from '~/API'

const TopSellingProduct = () => {
  const [topSellingProducts, setTopSellingProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTopSellingProducts = async () => {
      try {
        const response = await axios.post(`${BACKEND_URI}/product/top-sell`)
        setTopSellingProducts(response.data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching top selling products:', error)
        setError('Failed to fetch top selling products. Please try again later.')
        setLoading(false)
      }
    }

    fetchTopSellingProducts()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return <ProductGrid products={topSellingProducts} title="Top Selling Products" layout="slider" />
}

export default React.memo(TopSellingProduct)
