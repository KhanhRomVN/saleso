import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Space, message } from 'antd'
import FlashSaleSlider from '~/components/Slider/FlashSaleSlider'
import CategoriesSlider from '~/components/Slider/CategoriesSlider'
import TopSellingSlider from '~/components/Slider/TopSellingSlider'
import CategoriesProduct from '~/components/Slider/CategoriesProduct'

function HomePage() {
  const navigate = useNavigate()

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser')
    if (!currentUser) {
      navigate('/login')
      message.info('Please log in to access the homepage')
    }
  }, [navigate])
  return (
    <Space direction="vertical" style={{ width: '90%', padding: '8px' }} size={20}>
      <FlashSaleSlider />
      <CategoriesSlider />
      <TopSellingSlider />
      <CategoriesProduct />
    </Space>
  )
}

export default HomePage
