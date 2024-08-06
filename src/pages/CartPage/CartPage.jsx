import React, { useState, useEffect } from 'react'
import { List, Card, Button, InputNumber, Typography, Space, message } from 'antd'
import { DeleteOutlined, ShoppingCartOutlined } from '@ant-design/icons'
import axios from 'axios'
import CartTable from './components/CartTable'

const { Text, Title } = Typography

const CartPage = () => {
  const [cartData, setCartData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCartData()
  }, [])

  const fetchCartData = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken')
      const response = await axios.get('http://localhost:8080/cart', {
        headers: { accessToken },
      })
      setCartData(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching cart data:', error)
      message.error('Failed to load cart data')
      setLoading(false)
    }
  }

  const handleQuantityChange = (productId, newQuantity) => {
    // Implement quantity change logic here
    console.log(`Changing quantity for product ${productId} to ${newQuantity}`)
    // You would typically update the state and make an API call here
  }

  const handleRemoveItem = (productId) => {
    // Implement remove item logic here
    console.log(`Removing product ${productId} from cart`)
    // You would typically update the state and make an API call here
  }

  const calculateTotal = () => {
    if (!cartData || !cartData.items) return 0
    return cartData.items.reduce((total, item) => {
      const price = item.product.price ? item.product.price.min : 0
      return total + price * item.quantity
    }, 0)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Title level={2}>
          <ShoppingCartOutlined /> Your Cart
        </Title>
        {cartData && <CartTable cartData={cartData} onQuantityChange={handleQuantityChange} />}
        <Card>
          <Space direction="vertical" style={{ width: '100%' }}>
            <Title level={4}>Order Summary</Title>
            <Text strong>Total: ${calculateTotal().toFixed(2)}</Text>
            <Button type="primary" size="large" block>
              Proceed to Checkout
            </Button>
          </Space>
        </Card>
      </Space>
    </div>
  )
}

export default CartPage
