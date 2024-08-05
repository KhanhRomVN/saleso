import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Typography, Space, message } from 'antd'
import FlashSaleSlider from '~/components/Slider/FlashSaleSlider'
import CategoriesSlider from '~/components/CategoriesSlider'
import { BACKEND_URI } from '~/API'

const { Title, Text } = Typography

function HomePage() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [currentCategorySlide, setCurrentCategorySlide] = useState(0)
  const [flashSaleProducts, setFlashSaleProducts] = useState([])
  const [currentFlashSaleSlide, setCurrentFlashSaleSlide] = useState(0)
  const [countdown, setCountdown] = useState(24 * 60 * 60) // 24 hours in seconds

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser')
    if (!currentUser) {
      navigate('/login')
      message.info('Please log in to access the homepage')
    }
    fetchCategories()
    fetchFlashSaleProducts()

    // Start countdown timer
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => (prevCountdown > 0 ? prevCountdown - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [navigate])

  const fetchCategories = async () => {
    try {
      const response = await axios.post(`${BACKEND_URI}/image/categories`)
      setCategories(response.data)
    } catch (error) {
      console.error('Error fetching categories:', error)
      message.error('Failed to load categories')
    }
  }

  const fetchFlashSaleProducts = async () => {
    try {
      const response = await axios.post(`${BACKEND_URI}/product/discount/flash-sale`)
      console.log(response.data)
      setFlashSaleProducts(response.data)
    } catch (error) {
      console.error('Error fetching flash sale products:', error)
      message.error('Failed to load flash sale products')
    }
  }

  const handleCategoryPrevSlide = () => {
    setCurrentCategorySlide((prev) => (prev > 0 ? prev - 1 : Math.ceil(categories.length / 4) - 1))
  }

  const handleCategoryNextSlide = () => {
    setCurrentCategorySlide((prev) => (prev < Math.ceil(categories.length / 4) - 1 ? prev + 1 : 0))
  }

  const handleCategoryClick = (path) => {
    navigate(path)
  }

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600)
    const minutes = Math.floor((time % 3600) / 60)
    const seconds = time % 60
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`
  }

  return (
    <Space direction="vertical" style={{ width: '90%', padding: '8px' }} size={20}>
      <FlashSaleSlider />
      <CategoriesSlider
        categories={categories}
        currentSlide={currentCategorySlide}
        onPrevSlide={handleCategoryPrevSlide}
        onNextSlide={handleCategoryNextSlide}
        onCategoryClick={handleCategoryClick}
      />
    </Space>
  )
}

export default HomePage
