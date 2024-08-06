import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Space, message } from 'antd'
import FlashSaleProduct from './components/FlashSaleProduct'
import TopSellingProduct from './components/TopSellingProduct'
import CategoriesProduct from '~/components/ProductLayout/CategoriesProduct'
import CategoriesSlider from '~/components/Slider/CategoriesSlider'

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
      <FlashSaleProduct />
      <CategoriesSlider />
      <TopSellingProduct />
      <CategoriesProduct categories={['Laptops', 'Home & Living']} />
    </Space>
  )
}

export default HomePage
