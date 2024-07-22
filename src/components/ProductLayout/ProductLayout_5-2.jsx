import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import Grid from '@mui/material/Grid'
import Typography from '@mui/material/Typography'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import { BACKEND_URI } from '~/API'

const ProductLayout_5x2 = ({ type }) => {
  const [products, setProducts] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.post(`${BACKEND_URI}/product/productstype`, {
          type: type,
        })

        if (response.data && response.data.products) {
          const first10Products = response.data.products.slice(0, 8)
          setProducts(first10Products)
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [type])

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`)
  }

  return (
    <Grid container spacing={2}>
      {products.map((product, index) => (
        <Grid key={index} item xs={6} sm={4} md={3}>
          <Card
            sx={{ height: '100%', display: 'flex', flexDirection: 'column', cursor: 'pointer' }}
            onClick={() => handleProductClick(product._id)}
          >
            <CardMedia
              component="img"
              height="280"
              image={product.image || 'https://via.placeholder.com/150'}
              alt={product.name}
            />
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography
                gutterBottom
                variant="h7"
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  fontWeight: '600',
                }}
              >
                {product.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Type: {product.type}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Price: {product.price}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  )
}

export default ProductLayout_5x2
