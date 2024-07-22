import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Typography from '@mui/material/Typography'
import axios from 'axios'
import Box from '@mui/material/Box'
import { BACKEND_URI } from '~/API'
import FixedBar from './ProductComponent/FixedBar'
import ProductSellerPage from './ProductSellerPage'
import { useSnackbar } from 'notistack'
import InputBase from '@mui/material/InputBase'
import Button from '@mui/material/Button'
import Rating from '@mui/material/Rating'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import IconButton from '@mui/material/IconButton'
import StarIcon from '@mui/icons-material/Star'
import StarHalfIcon from '@mui/icons-material/StarHalf'
import CloseIcon from '@mui/icons-material/Close'
import FeedbackIcon from '@mui/icons-material/Feedback'
import { Avatar, Divider } from '@mui/material'
import ProductLayout51 from '~/components/ProductLayout/ProductLayout_5-1'

const ProductPage = () => {
  const { prod_id } = useParams()
  const [product, setProduct] = useState(null)
  const [reviews, setReviews] = useState([])
  const [staticReview, setStaticReview] = useState(null)
  const [productUserId, setProductUserId] = useState('')
  const [comment, setComment] = useState('')
  const [rating, setRating] = useState(0)
  const [openDialog, setOpenDialog] = useState(false)
  const currentUser = JSON.parse(localStorage.getItem('currentUser'))
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.post(`${BACKEND_URI}/product/get-product-by-prod-id`, { prod_id })
        const productUserId = response.data.product.user_id
        setProductUserId(productUserId)
        if (response.data && response.data.product) {
          setProduct(response.data.product)
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        enqueueSnackbar('Error fetching product data', { variant: 'error' })
      }
    }

    const fetchReviews = async () => {
      try {
        const response = await axios.post(`${BACKEND_URI}/review/get-list-product-review`, { prod_id })
        setReviews(response.data)
      } catch (error) {
        console.error('Error fetching product reviews:', error)
        enqueueSnackbar('Error fetching product reviews', { variant: 'error' })
      }
    }

    const fetchStaticReview = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken')
        const response = await axios.post(
          `${BACKEND_URI}/review/get-static-review`,
          { prod_id },
          {
            headers: {
              accessToken,
            },
          },
        )
        setStaticReview(response.data)
      } catch (error) {
        console.error('Error fetching static review data:', error)
        enqueueSnackbar('Error fetching static review data', { variant: 'error' })
      }
    }

    fetchProduct()
    fetchReviews()
    fetchStaticReview()
  }, [prod_id])

  const addToCart = async () => {
    const token = localStorage.getItem('accessToken')
    try {
      await axios.post(
        `${BACKEND_URI}/cart/add-cart`,
        { prod_id },
        {
          headers: {
            'Content-Type': 'application/json',
            accessToken: token,
          },
        },
      )
      enqueueSnackbar('Product added to cart successfully!', { variant: 'success' })
    } catch (error) {
      console.error('Error adding product to cart:', error)
      enqueueSnackbar('Failed to add product to cart', { variant: 'error' })
    }
  }

  const handleCommentChange = (event) => {
    setComment(event.target.value)
  }

  const handleRatingChange = (event, newValue) => {
    setRating(newValue)
  }

  const handleSubmitReview = async () => {
    const accessToken = localStorage.getItem('accessToken')
    try {
      await axios.post(
        `${BACKEND_URI}/review/add-review`,
        {
          prod_id,
          comment,
          rate: rating,
        },
        {
          headers: {
            accessToken,
          },
        },
      )
      enqueueSnackbar('Review added successfully!', { variant: 'success' })
      fetchReviews()
      setComment('')
      setRating(0)
      setOpenDialog(false) // Close the dialog after submission
    } catch (error) {
      console.error('Error adding review:', error)
      enqueueSnackbar('Failed to add review', { variant: 'error' })
    }
  }

  if (!product) {
    return <div>Loading...</div>
  }

  return (
    <Box
      sx={{
        width: 'auto',
        boxSizing: 'border-box',
        padding: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
    >
      {productUserId === currentUser.user_id ? (
        <ProductSellerPage product={product} />
      ) : (
        <Box>
          <Box sx={{ display: 'flex', gap: '10px' }}>
            <Box
              sx={{
                width: '550px',
                height: '535px',
                display: 'flex',
                flexDirection: 'column',
                boxSizing: 'border-box',
                gap: '20px',
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  height: '500px',
                  backgroundColor: (theme) => theme.palette.backgroundColor.secondary,
                  borderRadius: '8px',
                  overflow: 'hidden',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <img src={product.image} alt={product.name} style={{ width: '90%', objectFit: 'cover' }} />
              </Box>
            </Box>
            <Box
              sx={{
                width: '590px',
                height: '535px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
              }}
            >
              <Box
                sx={{
                  width: '100%',
                  backgroundColor: (theme) => theme.palette.backgroundColor.secondary,
                  borderRadius: '8px',
                  padding: '12px 10px',
                }}
              >
                <Typography
                  sx={{
                    color: (theme) => theme.palette.text.primary,
                    fontSize: '22px',
                  }}
                >
                  {product.name}
                </Typography>
                <Typography
                  sx={{
                    fontSize: '14px',
                    color: (theme) => theme.palette.text.secondary,
                  }}
                >
                  {product.category}
                </Typography>
                <Typography
                  sx={{
                    color: (theme) => theme.other.primaryColor,
                    fontSize: '20px',
                    textAlign: 'end',
                  }}
                >
                  {product.price} VND
                </Typography>
              </Box>
              <Box
                sx={{
                  padding: '10px',
                  backgroundColor: (theme) => theme.palette.backgroundColor.secondary,
                  height: '382px',
                  borderRadius: '10px',
                }}
              >
                <Typography>{product.description}</Typography>
              </Box>
            </Box>
            <FixedBar productPrice={product.price} addToCart={addToCart} />
          </Box>
          <Typography sx={{ fontSize: '22px', marginBottom: '14px' }}>Rating&Review</Typography>
          <Box sx={{ display: 'flex', width: '100%', alignItems: 'flexStart', gap: '20px' }}>
            {/* Static Review Data */}
            <Box sx={{ width: '30%', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {staticReview && (
                <Box
                  sx={{
                    display: 'flex',
                    padding: '10px',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '40px',
                    backgroundColor: (theme) => theme.palette.backgroundColor.secondary,
                    borderRadius: '10px',
                  }}
                >
                  <Box sx={{}}>
                    <Typography sx={{ fontSize: '40px' }}>{staticReview.overallRating}</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {[...Array(Math.floor(staticReview.overallRating))].map((_, index) => (
                        <StarIcon key={index} sx={{ color: '#fbc02d' }} />
                      ))}
                      {staticReview.overallRating % 1 !== 0 && <StarHalfIcon sx={{ color: '#fbc02d' }} />}
                    </Box>
                  </Box>
                  <Box sx={{}}>
                    {Object.keys(staticReview.ratingCounts).map((star, index) => (
                      <Box key={index} sx={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                        <Typography sx={{ marginRight: '8px' }}>{5 - index}</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', marginRight: '8px' }}>
                          {[...Array(5 - index)].map((_, idx) => (
                            <StarIcon key={idx} sx={{ color: '#fbc02d', width: '18px', height: '18px' }} />
                          ))}
                        </Box>
                        <Typography>{staticReview.ratingCounts[star]}</Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              )}
              {/* Feedback Button */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
                <Button
                  onClick={() => setOpenDialog(true)}
                  sx={{
                    border: '1px solid #0c68e9',
                    color: '#fff',
                    backgroundColor: 'transparent',
                    '&:hover': {
                      backgroundColor: '#0c68e9',
                    },
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <FeedbackIcon /> Feedback Now
                </Button>
              </Box>
            </Box>
            {/* List Review */}
            <Box
              sx={{
                width: '70%',
                height: '800px',
                overflowY: 'auto',
                '::-webkit-scrollbar': { width: '2px' },
                '::-webkit-scrollbar-thumb': { backgroundColor: '#888', borderRadius: '4px' },
                '::-webkit-scrollbar-thumb:hover': { backgroundColor: '#555' },
                backgroundColor: (theme) => theme.palette.backgroundColor.secondary,
                padding: '10px',
              }}
            >
              {reviews.map((review) => (
                <Box
                  key={review._id}
                  sx={{
                    display: 'flex',
                    gap: '15px',
                    alignItems: 'center',
                    padding: '14px 0',
                  }}
                >
                  <Avatar src={review.avatar} sx={{ borderRadius: '10px' }} />
                  <Box>
                    <Box sx={{ display: 'flex', gap: '10px' }}>
                      <Typography variant="body2" sx={{ fontSize: '16px' }}>
                        {review.username}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                        {[...Array(5)].map((_, index) => (
                          <StarIcon
                            key={index}
                            sx={{ color: index < review.rate ? '#fbc02d' : '#e0e0e0', width: '18px', height: '18px' }}
                          />
                        ))}
                      </Box>
                    </Box>
                    <Typography
                      sx={{
                        width: '700px',
                        fontSize: '14px',
                        wordWrap: 'break-word',
                        whiteSpace: 'pre-wrap',
                        overflowWrap: 'break-word',
                      }}
                    >
                      {review.comment}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
            <Box
              sx={{
                padding: '10px',
                backgroundColor: (theme) => theme.palette.backgroundColor.secondary,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography sx={{ fontSize: '16px' }}>Feedback</Typography>
                <IconButton onClick={() => setOpenDialog(false)}>
                  <CloseIcon sx={{ width: '18px', height: '18px' }} />
                </IconButton>
              </Box>
              <Divider />
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: '20px',
                }}
              >
                <Typography sx={{ fontSize: '20px', fontWeight: '600' }}>Please give us your thoughts?</Typography>
                <Typography sx={{ fontSize: '14px' }}>
                  Your reviews are a great motivation for us to develop further
                </Typography>
                <Rating
                  name="product-rating"
                  value={rating}
                  onChange={handleRatingChange}
                  size="medium"
                  precision={1}
                  sx={{ color: '#fbc02d', my: 2 }}
                />
              </Box>
              <Divider />
              <InputBase
                placeholder="Write your review..."
                value={comment}
                onChange={handleCommentChange}
                multiline
                fullWidth
                rows={4}
                sx={{
                  backgroundColor: (theme) => theme.palette.backgroundColor.primary,
                  padding: '8px',
                  borderRadius: '4px',
                  my: 2,
                }}
              />
              <Divider />
              <DialogActions>
                <Button
                  variant="contained"
                  onClick={handleSubmitReview}
                  sx={{ backgroundColor: (theme) => theme.other.primaryColor, color: '#ffffff', width: '100%' }}
                >
                  Submit Review
                </Button>
              </DialogActions>
            </Box>
          </Dialog>
          <Typography sx={{ fontSize: '22px', margin: '16px 0' }}>Recommend For You</Typography>
          <ProductLayout51 category={product.category} />
        </Box>
      )}
    </Box>
  )
}

export default ProductPage
