import React, { useState, useEffect } from 'react'
import { Space, Typography } from 'antd'
import { ClockCircleOutlined } from '@ant-design/icons'
import axios from 'axios'
import ProductGrid from '~/components/ProductGrid/ProductGrid'
import { BACKEND_URI } from '~/API'

const { Text } = Typography

const FlashSaleProduct = () => {
  const [flashSaleProducts, setFlashSaleProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [countdown, setCountdown] = useState('')
  const [currentTime, setCurrentTime] = useState('')
  const [endTime, setEndTime] = useState('')

  useEffect(() => {
    const fetchFlashSaleProducts = async () => {
      try {
        const response = await axios.post(`${BACKEND_URI}/product/flash-sale`)
        setFlashSaleProducts(response.data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching flash sale products:', error)
        setError('Failed to fetch flash sale products. Please try again later.')
        setLoading(false)
      }
    }

    fetchFlashSaleProducts()
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date()
      const currentHour = now.getHours()
      const nextHour = (currentHour + 1) % 24
      const endTime = new Date(now.setHours(nextHour, 0, 0, 0))
      const timeDiff = endTime - now
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000)

      setCurrentTime(`${currentHour.toString().padStart(2, '0')}:00`)
      setEndTime(`${nextHour.toString().padStart(2, '0')}:00`)
      setCountdown(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  const subtitle = (
    <Space>
      <ClockCircleOutlined style={{ color: 'primary' }} />
      <Text>
        {currentTime} - {endTime}
      </Text>
      <Text strong type="danger">
        [ {countdown} left ]
      </Text>
    </Space>
  )

  return (
    <ProductGrid
      products={flashSaleProducts}
      title="Flash Sale"
      subtitle={subtitle}
      showDiscount={true}
      layout="slider"
    />
  )
}

export default React.memo(FlashSaleProduct)
