import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import {
  Carousel,
  Button,
  Rate,
  Space,
  Row,
  Col,
  message,
  Descriptions,
  Tag,
  Typography,
  Breadcrumb,
  Image,
  InputNumber,
  Card,
} from 'antd'
import { ShoppingCartOutlined, HeartOutlined, HeartFilled } from '@ant-design/icons'
import { BACKEND_URI } from '~/API'
import CategoriesProduct from '~/components/ProductLayout/CategoriesProduct'

const { Text, Title } = Typography

const ProductPage = () => {
  const { productId } = useParams()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedAttributes, setSelectedAttributes] = useState({})
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${BACKEND_URI}/product/${productId}`)
        setProduct(response.data)
        if (response.data.attributes) {
          const initialAttributes = {}
          Object.keys(response.data.attributes).forEach((key) => {
            initialAttributes[key] = response.data.attributes[key][0].value
          })
          setSelectedAttributes(initialAttributes)
        }
      } catch (error) {
        message.error('Failed to fetch product details')
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  if (loading) {
    return <div>Loading...</div>
  }

  if (!product) {
    return <div>Product not found</div>
  }

  const handleAddToCart = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken')
      await axios.post(
        `${BACKEND_URI}/cart/add`,
        {
          productId: product._id,
        },
        {
          headers: { accessToken },
        },
      )
      message.success('Added to cart')
    } catch (error) {
      message.error('Failed to add to cart')
    }
  }

  const handleBuyNow = () => {
    // Implement buy now functionality
    message.info('Buy Now functionality to be implemented')
  }

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite)
    // Implement favorite functionality
    message.info(`${isFavorite ? 'Removed from' : 'Added to'} favorites`)
  }

  const getPrice = () => {
    if (product.attributes) {
      const prices = Object.values(product.attributes).flatMap((attr) => attr.map((item) => parseFloat(item.price)))
      const minPrice = Math.min(...prices)
      const maxPrice = Math.max(...prices)
      return minPrice === maxPrice ? `$${minPrice}` : `$${minPrice} - $${maxPrice}`
    }
    return `$${product.price}`
  }

  const renderAttributes = () => {
    if (!product.attributes) return null

    return Object.entries(product.attributes).map(([key, values]) => (
      <Card key={key} size="medium" title={key} style={{ marginBottom: 16, marginTop: '16px' }}>
        <Space wrap>
          {values.map((item) => (
            <Button
              key={item.value}
              type={selectedAttributes[key] === item.value ? 'primary' : 'default'}
              onClick={() => setSelectedAttributes({ ...selectedAttributes, [key]: item.value })}
            >
              {item.value} (${item.price})
            </Button>
          ))}
        </Space>
      </Card>
    ))
  }

  return (
    <div style={{ width: '90%', margin: '0 auto', padding: '16px' }}>
      <Breadcrumb style={{ marginBottom: '16px' }}>
        <Breadcrumb.Item>Categories</Breadcrumb.Item>
        {product.categories.map((category, index) => (
          <Breadcrumb.Item key={index}>{category}</Breadcrumb.Item>
        ))}
      </Breadcrumb>
      <Row gutter={[32, 32]} style={{ marginBottom: '40px' }}>
        <Col xs={24} md={12}>
          <Image.PreviewGroup>
            <Image
              src={product.images[selectedImage]}
              alt={product.name}
              style={{ width: '100%', marginBottom: '16px' }}
            />
            <Row gutter={[8, 8]}>
              {product.images.map((image, index) => (
                <Col span={6} key={index}>
                  <Image
                    src={image}
                    alt={`${product.name} - ${index + 1}`}
                    style={{ width: '100%', cursor: 'pointer' }}
                    onClick={() => setSelectedImage(index)}
                    preview={false}
                  />
                </Col>
              ))}
            </Row>
          </Image.PreviewGroup>
        </Col>
        <Col xs={24} md={12}>
          <Space direction="vertical" size="medium" style={{ width: '100%' }}>
            <div>
              <Title level={2}>
                {product.name} <Text>({product.units_sold} sold)</Text>
              </Title>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <Rate disabled defaultValue={product.averageRating || 0} />
              <Text>({product.reviews.totalReviews} reviews)</Text>
            </div>
            <Title level={3}>{getPrice()}</Title>
            {product.ongoing_discounts?.length > 0 && <Tag color="red">On Sale</Tag>}
            <Descriptions column={1} bordered style={{ marginBottom: '16px' }}>
              <Descriptions.Item label="Brand">{product.brand}</Descriptions.Item>
              <Descriptions.Item label="Country of Origin">{product.countryOfOrigin}</Descriptions.Item>
              {product.commonAttributes?.map((attr) => (
                <Descriptions.Item key={attr.name} label={attr.name}>
                  {attr.info}
                </Descriptions.Item>
              ))}
            </Descriptions>
            {renderAttributes()}
            <Space>
              <Text strong>Quantity:</Text>
              <InputNumber min={1} value={quantity} onChange={setQuantity} />
              <Button type="primary" icon={<ShoppingCartOutlined />} size="medium" onClick={handleAddToCart}>
                Add to Cart
              </Button>
              <Button type="primary" size="medium" onClick={handleBuyNow}>
                Buy Now
              </Button>
              <Button
                icon={isFavorite ? <HeartFilled /> : <HeartOutlined />}
                onClick={toggleFavorite}
                type={isFavorite ? 'primary' : 'default'}
              />
            </Space>
          </Space>
        </Col>
      </Row>
      <CategoriesProduct categories={product.categories} />
      {/* tạo khu vực viết các bình luận đánh giá cho sản phẩm */}
    </div>
  )
}

export default ProductPage
