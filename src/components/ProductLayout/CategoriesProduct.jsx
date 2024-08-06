import React, { useState, useEffect } from 'react'
import { Space, Button } from 'antd'
import axios from 'axios'
import ProductGrid from '~/components/ProductGrid/ProductGrid'
import { BACKEND_URI } from '~/API'

const CategoriesProduct = ({ categories }) => {
  const [activeCategory, setActiveCategory] = useState(0)
  const [categoryProducts, setCategoryProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true)
        const response = await axios.post(`${BACKEND_URI}/product/by-categories`, {
          categories: categories,
        })
        setCategoryProducts(response.data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching category products:', error)
        setError('Failed to fetch category products. Please try again later.')
        setLoading(false)
      }
    }

    fetchCategoryProducts()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  const activeProducts = categoryProducts[activeCategory] || []
  const displayedProducts = activeProducts.slice(0, 8)

  const subtitle = (
    <Space>
      {categories.map((category, index) => (
        <Button
          key={category}
          type={activeCategory === index ? 'primary' : 'default'}
          onClick={() => setActiveCategory(index)}
        >
          {category}
        </Button>
      ))}
    </Space>
  )

  return <ProductGrid products={displayedProducts} title="Categories Product" subtitle={subtitle} layout="grid" />
}

export default CategoriesProduct
