import React, { useState, useEffect, useCallback } from 'react'
import { Row, Col, Button, Card, Typography, Rate, Space, theme } from 'antd'
import axios from 'axios'
import { BACKEND_URI } from '~/API'

const { Meta } = Card
const { Text, Title } = Typography
const { useToken } = theme

const categories = ['Laptops', 'Home & Living']

const ProductCard = React.memo(({ product }) => {
  const { token } = useToken()

  return (
    <Card
      hoverable
      cover={<img alt={product.name} src={product.images[0]} style={{ height: 200, objectFit: 'cover' }} />}
      style={{ width: '100%', marginBottom: 16 }}
    >
      <Meta
        title={
          <Text ellipsis style={{ fontSize: '14px', fontWeight: 'bold' }}>
            {product.name}
          </Text>
        }
        description={
          <Space direction="vertical" size={4} style={{ width: '100%' }}>
            <Text strong type="danger" style={{ fontSize: '16px' }}>
              ${product.price.toFixed(2)}
            </Text>
            <Space size={4} style={{ width: '100%' }}>
              <Rate disabled defaultValue={product.averageRating} style={{ fontSize: '12px' }} />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                ({product.totalReviews})
              </Text>
            </Space>
          </Space>
        }
      />
    </Card>
  )
})

const CategoriesProduct = () => {
  const [categoryProducts, setCategoryProducts] = useState([])
  const [activeCategory, setActiveCategory] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchCategoryProducts = useCallback(async () => {
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
  }, [])

  useEffect(() => {
    fetchCategoryProducts()
  }, [fetchCategoryProducts])

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  const activeProducts = categoryProducts[activeCategory] || []
  const displayedProducts = activeProducts.slice(0, 8)

  return (
    <div style={{}}>
      <Title level={4}>Categories Product</Title>
      <Space style={{ marginBottom: '20px' }}>
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
      <Row gutter={[16, 16]}>
        {displayedProducts.map((product) => (
          <Col key={product._id} xs={24} sm={12} md={8} lg={6}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
      {activeProducts.length > 8 && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Button>More</Button>
        </div>
      )}
    </div>
  )
}

export default CategoriesProduct
