import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CartProduct from './CartProduct'

const CartInventory = ({
  products,
  selectedProducts,
  quantities,
  handleCheckboxChange,
  handleDeleteProduct,
  handleProductClick,
  handleQuantityChange,
}) => {
  return (
    <Box
      sx={{
        width: '900px',
        height: '540px',
        boxSizing: 'border-box',
        padding: '8px',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        overflowY: 'auto',
      }}
    >
      {products.length > 0 ? (
        products.map((product) => (
          <CartProduct
            key={product._id}
            product={product}
            selectedProducts={selectedProducts}
            quantity={quantities[product._id]}
            handleCheckboxChange={handleCheckboxChange}
            handleDeleteProduct={handleDeleteProduct}
            handleProductClick={handleProductClick}
            handleQuantityChange={handleQuantityChange}
          />
        ))
      ) : (
        <Typography variant="body1">No items in cart.</Typography>
      )}
    </Box>
  )
}

export default CartInventory
