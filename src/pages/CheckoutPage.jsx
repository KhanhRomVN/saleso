import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import InputBase from '@mui/material/InputBase'
import { Divider } from '@mui/material'
import axios from 'axios'
import { BACKEND_URI } from '~/API'

const CheckoutPage = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const { checkoutData } = location.state
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [discountCode, setDiscountCode] = useState('')
  const [products, setProducts] = useState([])
  const [deliveryMethod, setDeliveryMethod] = useState('basic')
  const [deliveryCost, setDeliveryCost] = useState(50000)
  const [totalCost, setTotalCost] = useState(0)
  const [address, setAddress] = useState('Viet Nam')

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method)
  }

  const handleDiscountCodeChange = (event) => {
    setDiscountCode(event.target.value)
  }

  const handleNext = () => {
    const updatedCheckoutData = checkoutData.map((item) => ({
      ...item,
      quantity: item.quantity || 1,
      address,
      paymentMethod,
      deliveryMethod,
      deliveryCost,
    }))

    const checkoutDetails = {
      checkoutData: updatedCheckoutData,
      totalCost,
    }
    if (paymentMethod === 'cash') {
      navigate('/checkout/basic-order', { state: checkoutDetails })
    } else if (paymentMethod === 'momo') {
      navigate('/checkout/momo-order', { state: checkoutDetails })
    }
  }

  const handleDeliveryMethodChange = (method) => {
    setDeliveryMethod(method)
    if (method === 'basic') {
      setDeliveryCost(50000)
    } else if (method === 'saveMoney') {
      setDeliveryCost(20000)
    } else if (method === 'fast') {
      setDeliveryCost(80000)
    }
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productRequests = checkoutData.map((item) =>
          axios.post(`${BACKEND_URI}/product/get-product-by-prod-id`, { prod_id: item.product_id }),
        )
        const responses = await Promise.all(productRequests)
        const productsData = responses.map((response, index) => {
          const product = response.data.product
          const quantity = checkoutData[index].quantity || 1
          return {
            ...product,
            price: checkoutData[index].price,
            quantity: quantity,
            total: checkoutData[index].price * quantity,
          }
        })
        setProducts(productsData)
      } catch (error) {
        console.error('Error fetching products:', error)
        // Handle error fetching data
      }
    }

    fetchProducts()
  }, [checkoutData])

  useEffect(() => {
    // Calculate the total cost
    const productTotal = products.reduce((acc, item) => acc + item.total, 0)
    setTotalCost(productTotal + deliveryCost)
  }, [products, deliveryCost])

  const truncateText = (text, length) => {
    return text.length > length ? `${text.substring(0, length)}...` : text
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        boxSizing: 'border-box',
        padding: '10px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
      }}
    >
      <Typography>Payment Method: </Typography>
      {/* Payment Method Buttons */}
      <Box sx={{ display: 'flex', gap: '10px' }}>
        <Button
          variant={paymentMethod === 'cash' ? 'contained' : 'outlined'}
          onClick={() => handlePaymentMethodChange('cash')}
          sx={{
            backgroundColor: (theme) => (paymentMethod === 'cash' ? theme.other.primaryColor : 'transparent'),
            color: (theme) => (paymentMethod === 'cash' ? '#fff' : theme.other.primaryColor),
            border: (theme) => `1px solid ${theme.other.primaryColor}`,
            '&:hover': {
              backgroundColor: 'transparent',
              border: (theme) => `1px solid ${theme.other.primaryColor}`,
              color: (theme) => theme.other.primaryColor,
            },
          }}
        >
          Basic Payment
        </Button>
        <Button
          variant={paymentMethod === 'momo' ? 'contained' : 'outlined'}
          onClick={() => handlePaymentMethodChange('momo')}
          sx={{
            backgroundColor: (theme) => (paymentMethod === 'momo' ? theme.other.pinkColor : 'transparent'),
            color: (theme) => (paymentMethod === 'momo' ? '#fff' : theme.other.pinkColor),
            border: (theme) => `1px solid ${theme.other.pinkColor}`,
            '&:hover': {
              backgroundColor: 'transparent',
              border: (theme) => `1px solid ${theme.other.pinkColor}`,
              color: (theme) => theme.other.pinkColor,
            },
          }}
        >
          Momo Payment
        </Button>
      </Box>
      <Divider />

      {/* Product List */}
      <Typography>Product Information & Review: </Typography>
      <Box sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap', gap: '20px' }}>
        {products.map((product) => (
          <Box
            key={product.product_id}
            sx={{
              width: 'calc(50% - 10px)',
              height: '130px',
              backgroundColor: (theme) => theme.palette.backgroundColor.secondary,
              display: 'flex',
              padding: '10px',
            }}
          >
            <Box sx={{ marginRight: '10px' }}>
              <img src={product.image} alt={product.name} style={{ height: '100%', objectFit: 'cover' }} />
            </Box>
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <Typography
                sx={{
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {truncateText(product.name, 50)}
              </Typography>
              <Typography>Price: {product.price}</Typography>
              <Typography>Quantity: {product.quantity}</Typography>
              <Typography>Total: {product.total}</Typography>
            </Box>
          </Box>
        ))}
      </Box>

      <Divider />

      {/* Delivery Address */}
      <Box>
        <Typography>Delivery address:</Typography>
        <InputBase
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="Enter your address"
          fullWidth
        />
      </Box>

      <Divider />

      {/* Delivery Method */}
      <Box>
        <Typography>Delivery method:</Typography>
        <Box sx={{ display: 'flex', gap: '10px' }}>
          <Button
            variant={deliveryMethod === 'basic' ? 'contained' : 'outlined'}
            onClick={() => handleDeliveryMethodChange('basic')}
            sx={{
              backgroundColor: deliveryMethod === 'basic' ? '#0c68e9' : 'transparent',
              color: '#fff',
              border: `1px solid ${deliveryMethod === 'basic' ? '#0c68e9' : 'transparent'}`,
              '&:hover': {
                backgroundColor: 'transparent',
                border: '1px solid #0c68e9',
                color: '#0c68e9',
              },
            }}
          >
            Basic
          </Button>
          <Button
            variant={deliveryMethod === 'saveMoney' ? 'contained' : 'outlined'}
            onClick={() => handleDeliveryMethodChange('saveMoney')}
            sx={{
              backgroundColor: deliveryMethod === 'saveMoney' ? '#fba94b' : 'transparent',
              color: '#fff',
              border: `1px solid ${deliveryMethod === 'saveMoney' ? '#fba94b' : 'transparent'}`,
              '&:hover': {
                backgroundColor: 'transparent',
                border: '1px solid #fba94b',
                color: '#fba94b',
              },
            }}
          >
            Save Money
          </Button>
          <Button
            variant={deliveryMethod === 'fast' ? 'contained' : 'outlined'}
            onClick={() => handleDeliveryMethodChange('fast')}
            sx={{
              backgroundColor: deliveryMethod === 'fast' ? '#31ae60' : 'transparent',
              color: '#fff',
              border: `1px solid ${deliveryMethod === 'fast' ? '#31ae60' : 'transparent'}`,
              '&:hover': {
                backgroundColor: 'transparent',
                border: '1px solid #31ae60',
                color: '#31ae60',
              },
            }}
          >
            Fast
          </Button>
        </Box>
      </Box>

      <Divider />

      {/* Shipping Cost */}
      <Box>
        <Typography>Delivery cost: {deliveryCost}</Typography>
      </Box>

      <Divider />

      {/* Discount Code */}
      <Box>
        <Typography>Discount code:</Typography>
        <InputBase
          value={discountCode}
          onChange={handleDiscountCodeChange}
          placeholder="Enter discount code"
          fullWidth
        />
      </Box>

      <Divider />

      {/* Total Cost */}
      <Box>
        <Typography>Total: {totalCost}</Typography>
      </Box>

      <Divider />

      {/* Next Button */}
      <Button
        variant="contained"
        onClick={handleNext}
        sx={{
          backgroundColor: '#0c68e9',
          color: '#fff',
          '&:hover': {
            backgroundColor: '#055bb5',
          },
          '&:active': {
            backgroundColor: '#043f7e',
          },
        }}
      >
        Continue
      </Button>
    </Box>
  )
}

export default CheckoutPage
