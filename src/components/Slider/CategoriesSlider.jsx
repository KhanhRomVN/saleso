import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Typography, Space, Button, message } from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import { BACKEND_URI } from '~/API'
import axios from 'axios'

const { Title } = Typography

function CategoriesSlider() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [currentCategorySlide, setCurrentCategorySlide] = useState(0)

  useEffect(() => {
    fetchCategories()
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

  const handleCategoryPrevSlide = () => {
    setCurrentCategorySlide((prev) => (prev > 0 ? prev - 1 : Math.ceil(categories.length / 4) - 1))
  }

  const handleCategoryNextSlide = () => {
    setCurrentCategorySlide((prev) => (prev < Math.ceil(categories.length / 4) - 1 ? prev + 1 : 0))
  }

  const handleCategoryClick = (path) => {
    navigate(path)
  }

  return (
    <div>
      <Space style={{ justifyContent: 'space-between', width: '100%', marginBottom: '10px' }}>
        <Title level={4} style={{ margin: 0 }}>
          Top Categories
        </Title>
        <Space>
          <Button icon={<LeftOutlined />} onClick={handleCategoryPrevSlide} />
          <Button icon={<RightOutlined />} onClick={handleCategoryNextSlide} />
        </Space>
      </Space>
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <div
          style={{
            display: 'flex',
            transition: 'transform 0.5s ease-in-out',
            transform: `translateX(-${currentCategorySlide * 100}%)`,
          }}
        >
          {categories.map((category, index) => (
            <div
              key={index}
              style={{
                flexShrink: 0,
                width: '25%',
                padding: '0 5px',
                boxSizing: 'border-box',
                cursor: 'pointer',
              }}
              onClick={() => handleCategoryClick(category.path)}
            >
              <img
                src={category.image_url}
                alt={`Category ${index + 1}`}
                style={{
                  width: '100%',
                  height: 'auto',
                  aspectRatio: '16/9',
                  objectFit: 'cover',
                  borderRadius: '8px',
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CategoriesSlider
