import React, { useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Carousel, Card, Typography, Button, Rate, Space, theme, Modal, Row, Col, message } from 'antd'
import { HeartOutlined, EyeOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import { BACKEND_URI } from '~/API'

const { Meta } = Card
const { Text, Title } = Typography
const { useToken } = theme

const SLIDES_TO_SHOW = 4
const SLIDES_TO_SCROLL = 4

const ProductImage = React.memo(({ images, discount, onImageClick, onWishlistClick, onAddToCartClick }) => {
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
      {discount && (
        <div
          style={{
            position: 'absolute',
            top: '10px',
            left: '10px',
            background: token.colorError,
            color: token.colorWhite,
            padding: '2px 8px',
            borderRadius: '12px',
            fontSize: '12px',
            fontWeight: 'bold',
          }}
        >
          -{discount}%
        </div>
      )}
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
          onClick={onWishlistClick}
        />
        <Button
          type="text"
          icon={<EyeOutlined />}
          style={{ color: token.colorWhite, background: 'rgba(0, 0, 0, 0.5)' }}
          onClick={onImageClick}
        />
      </div>
      {isHovered && (
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
          onClick={onAddToCartClick}
        >
          Add to Cart
        </Button>
      )}
    </div>
  )
})

const ProductCard = React.memo(({ product, onImageClick, showDiscount }) => {
  const navigate = useNavigate()
  const discountedPrice = showDiscount ? product.price * (1 - product.flashSaleDiscount / 100) : product.price
  const { token } = useToken()

  const handleWishlist = async (e) => {
    e.stopPropagation()
    try {
      const accessToken = localStorage.getItem('accessToken')
      await axios.post(
        `${BACKEND_URI}/wishlist/add`,
        { productId: product._id },
        {
          headers: { accessToken },
        },
      )
      message.success('Added to wishlist')
    } catch (error) {
      message.error('Failed to add to wishlist')
    }
  }

  const handleAddToCart = async (e) => {
    e.stopPropagation()
    try {
      const accessToken = localStorage.getItem('accessToken')
      await axios.post(
        `${BACKEND_URI}/cart/add`,
        { productId: product._id },
        {
          headers: { accessToken },
        },
      )
      message.success('Added to cart')
    } catch (error) {
      message.error('Failed to add to cart')
    }
  }

  const handleMetaClick = (e) => {
    e.stopPropagation()
    navigate(`/product/${product._id}`)
  }

  return (
    <Card
      style={{ width: '96%' }}
      hoverable
      cover={
        <ProductImage
          images={product.images}
          discount={showDiscount ? product.flashSaleDiscount : null}
          onImageClick={() => onImageClick(product)}
          onWishlistClick={handleWishlist}
          onAddToCartClick={handleAddToCart}
        />
      }
      bodyStyle={{ padding: '12px' }}
    >
      <div onClick={handleMetaClick}>
        <Meta
          title={
            <Text ellipsis style={{ fontSize: '14px', fontWeight: 'bold' }}>
              {product.name}
            </Text>
          }
          description={
            <Space direction="vertical" size={4} style={{ width: '100%' }}>
              <Space size={0}>
                {showDiscount && (
                  <Text delete style={{ fontSize: '12px', marginRight: '6px' }}>
                    ${product.price.toFixed(2)}
                  </Text>
                )}
                <Text strong type="danger" style={{ fontSize: '16px' }}>
                  ${discountedPrice.toFixed(2)}
                </Text>
              </Space>
              <Space size={4} style={{ width: '100%' }}>
                <Rate disabled defaultValue={product.averageRating} style={{ fontSize: '12px' }} />
                <Text type="secondary" style={{ fontSize: '12px' }}>
                  ({product.totalReviews})
                </Text>
              </Space>
            </Space>
          }
        />
      </div>
    </Card>
  )
})

const ProductGrid = ({
  products,
  title,
  subtitle,
  showDiscount = false,
  layout = 'slider',
  slidesToShow = SLIDES_TO_SHOW,
  slidesToScroll = SLIDES_TO_SCROLL,
}) => {
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const carouselRef = React.useRef()

  const handleImageClick = useCallback((product) => {
    setSelectedProduct(product)
    setModalVisible(true)
  }, [])

  const carouselSettings = useMemo(
    () => ({
      slidesToShow,
      slidesToScroll,
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
    [slidesToShow, slidesToScroll],
  )

  const renderProducts = () => {
    if (layout === 'slider') {
      return (
        <Carousel ref={carouselRef} {...carouselSettings}>
          {products.map((product) => (
            <div
              key={product._id}
              style={{
                padding: '0 10px',
                display: 'flex',
                width: '100%',
                justifyContent: 'space-between',
              }}
            >
              <ProductCard product={product} onImageClick={handleImageClick} showDiscount={showDiscount} />
            </div>
          ))}
        </Carousel>
      )
    } else if (layout === 'grid') {
      return (
        <Row gutter={[16, 16]}>
          {products.map((product) => (
            <Col key={product._id} xs={24} sm={12} md={8} lg={6}>
              <ProductCard product={product} onImageClick={handleImageClick} showDiscount={showDiscount} />
            </Col>
          ))}
        </Row>
      )
    }
  }

  return (
    <div style={{ width: '100%' }}>
      <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: '20px' }}>
        <Space direction="vertical" align="baseline">
          <Title level={3} style={{ margin: 0 }}>
            {title}
          </Title>
          {subtitle && <Space>{subtitle}</Space>}
        </Space>
      </Space>
      {renderProducts()}
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

export default React.memo(ProductGrid)
