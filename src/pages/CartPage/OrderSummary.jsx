import React, { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { Divider } from '@mui/material'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import { BACKEND_URI } from '~/API'

const OrderSummary = ({ selectedProducts, totalPrice }) => {
  const [openDialog, setOpenDialog] = useState(false)
  const navigate = useNavigate()
  const currentUser = JSON.parse(localStorage.getItem('currentUser'))
  const username = currentUser.username

  const handleCheckout = async () => {
    try {
      const response = await axios.post(`${BACKEND_URI}/user/get-user-data`, { username: username })
      const userData = response.data
      if (!userData.address) {
        setOpenDialog(true)
      } else {
        const checkoutData = selectedProducts.map((product) => ({
          seller_id: product.user_id,
          product_id: product._id,
          price: product.price,
          quantity: product.quantity,
        }))
        navigate('/checkout', { state: { checkoutData, totalPrice } })
      }
    } catch (error) {
      console.error('Error fetching user data:', error)
    }
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    navigate('/setting/user-profile')
  }

  return (
    <Box
      sx={{
        width: '400px',
        backgroundColor: (theme) => theme.palette.backgroundColor.primary,
        boxSizing: 'border-box',
        padding: '18px',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography sx={{ fontWeight: '600' }}>Order Summary</Typography>
      <Divider sx={{ my: '10px' }} />
      {/* List of selected products with quantity */}
      {selectedProducts.map((product) => (
        <Box key={product._id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {product.name} x{product.quantity} {/* Display product name with quantity */}
          </Typography>
          <Typography>
            {product.price} VND {/* Display price with "VND" */}
          </Typography>
        </Box>
      ))}
      <Divider sx={{ my: '10px' }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography>Total</Typography>
        <Typography>{totalPrice} VND</Typography> {/* Display total price with "VND" */}
      </Box>
      <Divider sx={{ my: '10px' }} />
      <Button
        variant="contained"
        color="primary"
        onClick={handleCheckout}
        disabled={selectedProducts.length === 0}
        sx={{ backgroundColor: (theme) => theme.other.primaryColor, color: (theme) => theme.palette.textColor.primary }}
      >
        Checkout
      </Button>

      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle
          sx={{
            backgroundColor: '#1a1d1f',
          }}
        >
          Address Required
        </DialogTitle>
        <DialogContent
          sx={{
            backgroundColor: '#1a1d1f',
            color: '#fff',
          }}
        >
          <DialogContentText>
            You need to provide an address to proceed with the checkout. Please update your address in your profile
            settings.
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{
            backgroundColor: '#1a1d1f',
          }}
        >
          <Button onClick={handleCloseDialog} color="primary">
            Go to Profile
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default OrderSummary
