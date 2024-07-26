import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import MoreHorizIcon from '@mui/icons-material/MoreHoriz'
import { useSnackbar } from 'notistack'
import { BACKEND_URI } from '~/API'

function HomePage() {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const [categories, setCategories] = useState([])
  const [currentCategorySlide, setCurrentCategorySlide] = useState(0)
  const [flashSaleProducts, setFlashSaleProducts] = useState([])
  const [currentFlashSaleSlide, setCurrentFlashSaleSlide] = useState(0)
  const [countdown, setCountdown] = useState(24 * 60 * 60) // 24 hours in seconds

  useEffect(() => {
    const currentUser = localStorage.getItem('currentUser')
    if (!currentUser) {
      navigate('/login')
      enqueueSnackbar('Please log in to access the homepage', { variant: 'info' })
    }
    fetchCategories()
    fetchFlashSaleProducts()

    // Start countdown timer
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => (prevCountdown > 0 ? prevCountdown - 1 : 0))
    }, 1000)

    return () => clearInterval(timer)
  }, [navigate, enqueueSnackbar])

  const fetchCategories = async () => {
    try {
      const response = await axios.post(`${BACKEND_URI}/image/categories`)
      setCategories(response.data)
    } catch (error) {
      console.error('Error fetching categories:', error)
      enqueueSnackbar('Failed to load categories', { variant: 'error' })
    }
  }

  const fetchFlashSaleProducts = async () => {
    try {
      const response = await axios.post(`${BACKEND_URI}/product/discount/flash-sale`)
      console.log(response.data)
      setFlashSaleProducts(response.data)
    } catch (error) {
      console.error('Error fetching flash sale products:', error)
      enqueueSnackbar('Failed to load flash sale products', { variant: 'error' })
    }
  }

  const handleCategoryPrevSlide = () => {
    setCurrentCategorySlide((prev) => (prev > 0 ? prev - 1 : Math.ceil(categories.length / 4) - 1))
  }

  const handleCategoryNextSlide = () => {
    setCurrentCategorySlide((prev) => (prev < Math.ceil(categories.length / 4) - 1 ? prev + 1 : 0))
  }

  const handleFlashSalePrevSlide = () => {
    setCurrentFlashSaleSlide((prev) => (prev > 0 ? prev - 1 : Math.ceil(flashSaleProducts.length / 5) - 1))
  }

  const handleFlashSaleNextSlide = () => {
    setCurrentFlashSaleSlide((prev) => (prev < Math.ceil(flashSaleProducts.length / 5) - 1 ? prev + 1 : 0))
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
    <Box sx={{ width: '90%', boxSizing: 'border-box', padding: '8px', display: 'flex', flexDirection: 'column' }}>
      {/* Categories List */}
      <Box sx={{ marginTop: '20px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <Typography variant="h6">Top Categories</Typography>
          <Box>
            <IconButton onClick={handleCategoryPrevSlide}>
              <ArrowBackIosNewIcon />
            </IconButton>
            <IconButton onClick={handleCategoryNextSlide}>
              <ArrowForwardIosIcon />
            </IconButton>
          </Box>
        </Box>
        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
          <Box
            sx={{
              display: 'flex',
              transition: 'transform 0.5s ease-in-out',
              transform: `translateX(-${currentCategorySlide * 100}%)`,
            }}
          >
            {categories.map((category, index) => (
              <Box
                key={index}
                sx={{
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
              </Box>
            ))}
          </Box>
        </Box>
      </Box>

      {/* Flash Sale */}
      <Box sx={{ marginTop: '40px' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ marginRight: '20px' }}>
              Flash Sale
            </Typography>
            <Typography variant="h6" color="error">
              {formatTime(countdown)}
            </Typography>
          </Box>
          <Box>
            <IconButton onClick={handleFlashSalePrevSlide}>
              <ArrowBackIosNewIcon />
            </IconButton>
            {[...Array(Math.min(5, Math.ceil(flashSaleProducts.length / 5)))].map((_, index) => (
              <IconButton
                key={index}
                onClick={() => setCurrentFlashSaleSlide(index)}
                sx={{ color: currentFlashSaleSlide === index ? 'primary.main' : 'text.secondary' }}
              >
                {index + 1}
              </IconButton>
            ))}
            {Math.ceil(flashSaleProducts.length / 5) > 5 && (
              <IconButton onClick={() => navigate('/flash-sale')}>
                <MoreHorizIcon />
              </IconButton>
            )}
            <IconButton onClick={handleFlashSaleNextSlide}>
              <ArrowForwardIosIcon />
            </IconButton>
          </Box>
        </Box>
        <Box sx={{ position: 'relative', overflow: 'hidden' }}>
          <Box
            sx={{
              display: 'flex',
              transition: 'transform 0.5s ease-in-out',
              transform: `translateX(-${currentFlashSaleSlide * 100}%)`,
            }}
          >
            {flashSaleProducts.map((product, index) => (
              <Box
                key={index}
                sx={{
                  flexShrink: 0,
                  width: '20%', // Changed from 25% to 20% to fit 5 items
                  padding: '0 5px',
                  boxSizing: 'border-box',
                }}
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  style={{
                    width: '100%',
                    height: 'auto',
                    aspectRatio: '1/1',
                    objectFit: 'cover',
                    borderRadius: '8px',
                  }}
                />
                <Typography variant="subtitle2" noWrap>
                  {product.name}
                </Typography>
                <Typography variant="body2">${product.price}</Typography>
                <Typography variant="caption" noWrap>
                  {product.category.join(', ')}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
                  <Button variant="contained" color="primary" size="small">
                    Buy
                  </Button>
                  <Button variant="outlined" color="primary" size="small">
                    Add
                  </Button>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default HomePage
