import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Grid, Card, CardMedia, CardContent, Typography, CardActionArea, Button, Box } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { BACKEND_URI } from '~/API'

const ProductLayout51 = ({ category }) => {
  const [products, setProducts] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.post(`${BACKEND_URI}/product/get-list-product-by-category`, {
          category,
        })
        const data = response.data.products

        if (data.length > 5) {
          const shuffled = data.sort(() => 0.5 - Math.random())
          setProducts(shuffled.slice(0, 5))
        } else {
          setProducts(data)
        }
      } catch (error) {
        console.error('Error fetching products:', error)
      }
    }

    fetchProducts()
  }, [category])

  const handleProductClick = (id) => {
    navigate(`/product/${id}`)
  }

  const handleMoreClick = () => {
    navigate(`/search/product/${category}`)
  }

  return (
    <Box>
      <Grid container spacing={2}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={2.4} xl={2} key={product._id}>
            <Card sx={{ height: '340px' }}>
              <CardActionArea onClick={() => handleProductClick(product._id)}>
                <CardMedia
                  component="img"
                  style={{ height: 200, width: '100%', objectFit: 'cover' }}
                  image={product.image}
                  alt={product.name}
                />
                <CardContent>
                  <Typography
                    sx={{
                      fontSize: '16px',
                      display: '-webkit-box',
                      WebkitBoxOrient: 'vertical',
                      WebkitLineClamp: 2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {product.category}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {product.units_sold} Sold
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {product.price} VND
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'end', marginTop: '10px' }}>
        <Button
          sx={{
            width: '10%',
            color: 'white',
            backgroundColor: (theme) => theme.other.primaryColor,
            '&:hover': {
              backgroundColor: 'transparent',
              border: (theme) => `${theme.other.primaryColor} 1px solid`,
            },
          }}
          onClick={handleMoreClick}
        >
          More
        </Button>
      </Box>
    </Box>
  )
}

export default ProductLayout51
