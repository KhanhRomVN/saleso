import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Carousel, Card, Typography, Button, Rate, Space, theme, Modal } from 'antd'
import { LeftOutlined, RightOutlined, HeartOutlined, EyeOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import axios from 'axios'
import { BACKEND_URI } from '~/API'

const { Meta } = Card
const { Text, Title } = Typography
const { useToken } = theme

const SLIDES_TO_SHOW = 4
const SLIDES_TO_SCROLL = 4

const useTopSellingData = () => {
  const [topSellingProducts, setTopSellingProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTopSellingProducts = async () => {
      try {
        const response = await axios.post(`${BACKEND_URI}/product/top-sell`)
        setTopSellingProducts(response.data)
      } catch (error) {
        console.error('Error fetching top selling products:', error)
        setError('Failed to fetch top selling products. Please try again later.')
      } finally {
        setLoading(false)
      }
    }

    fetchTopSellingProducts()
  }, [])

  return { topSellingProducts, loading, error }
}

const ProductImage = React.memo(({ images, onImageClick }) => {
  const { token } = useToken()
  const [isHovered, setIsHovered] = useState(false)
  const carouselRef = React.useRef()

  const nextSlide = useCallback((e) => {
    e.stopPropagation()
    carouselRef.current.next()
  }, [])

  const prevSlide = useCallback((e) => {
    e.stopPropagation()
    carouselRef.current.prev()
  }, [])

  return (
    <div
      style={{ position: 'relative', overflow: 'hidden' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Carousel autoplay effect="fade" ref={carouselRef}>
        {images.map((image, index) => (
          <img
            key={index}
            alt={`Product - ${index + 1}`}
            src={image}
            style={{ width: '100%', height: '160px', objectFit: 'cover' }}
          />
        ))}
      </Carousel>
      <div
        style={{
          position: 'absolute',
          top: '10px',
          right: '10px',
          display: 'flex',
          gap: '5px',
        }}
      >
        <Button
          type="text"
          icon={<HeartOutlined />}
          style={{ color: token.colorWhite, background: 'rgba(0, 0, 0, 0.5)' }}
        />
        <Button
          type="text"
          icon={<EyeOutlined />}
          style={{ color: token.colorWhite, background: 'rgba(0, 0, 0, 0.5)' }}
          onClick={onImageClick}
        />
      </div>
      {isHovered && (
        <>
          <Button
            type="text"
            icon={<LeftOutlined />}
            style={{
              position: 'absolute',
              top: '50%',
              left: '10px',
              transform: 'translateY(-50%)',
              color: token.colorWhite,
              background: 'rgba(0, 0, 0, 0.5)',
            }}
            onClick={prevSlide}
          />
          <Button
            type="text"
            icon={<RightOutlined />}
            style={{
              position: 'absolute',
              top: '50%',
              right: '10px',
              transform: 'translateY(-50%)',
              color: token.colorWhite,
              background: 'rgba(0, 0, 0, 0.5)',
            }}
            onClick={nextSlide}
          />
          <Button
            type="primary"
            icon={<ShoppingCartOutlined />}
            style={{
              position: 'absolute',
              bottom: '0',
              left: '0',
              width: '100%',
              borderRadius: '0',
            }}
          >
            Add to Cart
          </Button>
        </>
      )}
    </div>
  )
})

const ProductCard = React.memo(({ product, onImageClick }) => {
  return (
    <Card
      style={{ width: '96%' }}
      hoverable
      cover={<ProductImage images={product.images} onImageClick={onImageClick} />}
      bodyStyle={{ padding: '12px' }}
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

const TopSellingSlider = () => {
  const { topSellingProducts, loading, error } = useTopSellingData()
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const carouselRef = React.useRef()
  const { token } = useToken()

  const handleImageClick = useCallback((product) => {
    setSelectedProduct(product)
    setModalVisible(true)
  }, [])

  const carouselSettings = useMemo(
    () => ({
      slidesToShow: SLIDES_TO_SHOW,
      slidesToScroll: SLIDES_TO_SCROLL,
      dots: false,
      infinite: false,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 3,
          },
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2,
          },
        },
        {
          breakpoint: 480,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1,
          },
        },
      ],
    }),
    [],
  )

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return (
    <div style={{ width: '100%' }}>
      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: '20px' }}>
        <Title level={4} style={{ margin: 0 }}>
          Top Selling Products
        </Title>
        <Space>
          <Button icon={<LeftOutlined />} onClick={() => carouselRef.current.prev()} />
          <Button icon={<RightOutlined />} onClick={() => carouselRef.current.next()} />
        </Space>
      </Space>
      <Carousel ref={carouselRef} {...carouselSettings}>
        {topSellingProducts.map((product) => (
          <div
            key={product._id}
            style={{
              padding: '0 10px',
              display: 'flex',
              width: '100%',
              justifyContent: 'space-between',
            }}
          >
            <ProductCard product={product} onImageClick={() => handleImageClick(product)} />
          </div>
        ))}
      </Carousel>
      <Modal visible={modalVisible} onCancel={() => setModalVisible(false)} footer={null} width={600}>
        {selectedProduct && (
          <Carousel>
            {selectedProduct.images.map((image, index) => (
              <div key={index}>
                <img
                  src={image}
                  alt={`${selectedProduct.name} - ${index + 1}`}
                  style={{ width: '100%', height: 'auto' }}
                />
              </div>
            ))}
          </Carousel>
        )}
      </Modal>
    </div>
  )
}

export default React.memo(TopSellingSlider)
