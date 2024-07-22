import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Button from '@mui/material/Button'
import { BACKEND_URI } from '~/API'

const ProductLayout_5x10 = ({ type }) => {
  const [products, setProducts] = useState([])
  const [visibleProducts, setVisibleProducts] = useState(10)
  const navigate = useNavigate()

  useEffect(() => {
    fetchData()
  }, [type])

  const fetchData = async () => {
    try {
      const response = await axios.get(`${BACKEND_URI}/product/get-all-products`)
      const data = response.data
      if (data.length > 50) {
        const shuffled = data.sort(() => 0.5 - Math.random())
        setProducts(shuffled.slice(0, 50))
      } else {
        setProducts(data)
      }
    } catch (error) {
      console.error('Error fetching data:', error)
    }
  }

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`)
  }

  const loadMore = () => {
    if (visibleProducts < products.length) {
      setVisibleProducts((prevVisibleProducts) => prevVisibleProducts + 5)
    }
  }

  return (
    <div>
      <Grid container spacing={2}>
        {products.slice(0, visibleProducts).map((product) => (
          <Grid
            item
            xs={11.5}
            sm={5.5}
            md={3.5}
            lg={2.4}
            xl={2}
            key={product._id}
            onClick={() => handleProductClick(product._id)}
          >
            <Card sx={{ cursor: 'pointer', height: '100%' }}>
              <CardMedia component="img" height="180" image={product.image} alt={product.name} />
              <CardContent>
                <Typography component="div" sx={{ fontSize: '18px' }}>
                  {product.name}
                </Typography>
                <Typography color="text.secondary" sx={{ fontSize: '14px' }}>
                  {product.category}
                </Typography>
                <Typography color="text.primary" sx={{ fontSize: '16px' }}>
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {visibleProducts < products.length && ( // Hiển thị nút "Load more" nếu chưa hiển thị hết sản phẩm
        <Grid container justifyContent="center" style={{ marginTop: '20px' }}>
          <Button variant="contained" onClick={loadMore}>
            Load more
          </Button>
        </Grid>
      )}
    </div>
  )
}

export default ProductLayout_5x10
