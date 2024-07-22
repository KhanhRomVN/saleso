import Button from '@mui/material/Button'
import Box from '@mui/material/Box'

const AddProductButton = ({ isSeller, handleAddProduct, handleBecomeSeller }) => {
  return (
    <Box>
      {!isSeller && (
        <Button variant="contained" color="primary" onClick={handleBecomeSeller} sx={{ mr: 2 }}>
          Become Seller
        </Button>
      )}
      {isSeller && (
        <Button variant="contained" color="secondary" onClick={handleAddProduct}>
          Add Product
        </Button>
      )}
    </Box>
  )
}

export default AddProductButton
