import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Checkbox from '@mui/material/Checkbox'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import RemoveIcon from '@mui/icons-material/Remove'

const CartProduct = ({
  product,
  selectedProducts,
  quantity,
  handleCheckboxChange,
  handleProductClick,
  handleDeleteProduct,
  handleQuantityChange,
}) => {
  const increaseQuantity = () => {
    handleQuantityChange(product._id, quantity + 1)
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      handleQuantityChange(product._id, quantity - 1)
    }
  }

  const handleQuantityInputChange = (event) => {
    const newQuantity = parseInt(event.target.value)
    if (!isNaN(newQuantity) && newQuantity >= 1) {
      handleQuantityChange(product._id, newQuantity)
    }
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '160px',
        backgroundColor: (theme) => theme.palette.backgroundColor.secondary,
        display: 'flex',
        boxSizing: 'border-box',
        padding: '12px',
        justifyContent: 'space-between',
        cursor: 'pointer',
        borderRadius: '10px',
        alignItems: 'center',
      }}
    >
      <Box sx={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        {/* Product Image and Details */}
        <Box
          sx={{ width: '100px', height: '100px', display: 'flex', alignItems: 'center' }}
          onClick={() => handleProductClick(product._id)}
        >
          <img src={product.image} alt={product.name} style={{ height: '100%', objectFit: 'cover' }} />
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            flexGrow: 1,
            gap: '4px',
          }}
        >
          <Typography sx={{ fontWeight: '600', fontSize: '16px' }}>{product.name}</Typography>
          <Typography variant="body2">{product.category}</Typography>
          <Typography variant="body1" sx={{ fontWeight: '600' }}>
            {product.price} VND
          </Typography>
          {/* Quantity Selector */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <IconButton size="small" onClick={decreaseQuantity}>
              <RemoveIcon />
            </IconButton>
            <input
              type="number"
              value={quantity}
              onChange={handleQuantityInputChange}
              style={{
                width: '40px',
                height: '26px',
                textAlign: 'center',
                border: '1px solid #ccc',
                borderRadius: '4px',
                outline: 'none',
                fontSize: '16px',
              }}
            />
            <IconButton size="small" onClick={increaseQuantity}>
              <AddIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
      {/* Checkbox and Delete Button */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <Checkbox
          checked={selectedProducts.some((p) => p._id === product._id)}
          onChange={() => handleCheckboxChange(product)}
        />
        <IconButton
          aria-label="delete"
          onClick={(e) => {
            handleDeleteProduct(product._id)
            e.stopPropagation()
          }}
        >
          <DeleteIcon />
        </IconButton>
      </Box>
    </Box>
  )
}

export default CartProduct
