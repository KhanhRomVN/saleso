import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import axios from 'axios'
import { BACKEND_URI } from '~/API'
import { useSnackbar } from 'notistack'

const ProductSellerPage = ({ product }) => {
  const { enqueueSnackbar } = useSnackbar()

  const [updatedProduct, setUpdatedProduct] = useState({
    name: product.name,
    price: product.price,
    category: product.category,
    inventory: product.inventory,
    description: product.description,
    image: product.image,
  })

  const handleChange = (e) => {
    setUpdatedProduct({
      ...updatedProduct,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post(`${BACKEND_URI}/product/update-product`, updatedProduct)
      enqueueSnackbar('Product updated successfully!', { variant: 'success' })
    } catch (error) {
      console.error('Error updating product:', error)
      enqueueSnackbar('Failed to update product.', { variant: 'error' })
    }
  }

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        gap: '10px',
        padding: '16px',
        backgroundColor: (theme) => theme.palette.backgroundColor.primary,
      }}
    >
      <Box sx={{ display: 'flex', width: '550px', height: '505px' }}>
        <img src={product.image} alt={product.name} style={{ width: '90%', objectFit: 'cover' }} />
      </Box>
      <Box sx={{ display: 'flex', width: '590px', flexDirection: 'column' }}>
        <TextField
          label="Name"
          name="name"
          value={updatedProduct.name}
          onChange={handleChange}
          fullWidth
          variant="outlined"
        />
        <TextField
          label="Price"
          name="price"
          value={updatedProduct.price}
          onChange={handleChange}
          fullWidth
          variant="outlined"
        />
        <TextField
          label="Category"
          name="category"
          value={updatedProduct.category}
          onChange={handleChange}
          fullWidth
          variant="outlined"
        />
        <TextField
          label="Inventory"
          name="inventory"
          value={updatedProduct.inventory}
          onChange={handleChange}
          fullWidth
          variant="outlined"
        />
        <TextField
          label="Description"
          name="description"
          value={updatedProduct.description}
          onChange={handleChange}
          fullWidth
          variant="outlined"
          multiline
          rows={4}
        />
        <TextField
          label="Image URL"
          name="image"
          value={updatedProduct.image}
          onChange={handleChange}
          fullWidth
          variant="outlined"
        />
        <Button type="submit" variant="contained" sx={{ backgroundColor: '#e15a15' }}>
          Save Changes
        </Button>
      </Box>
    </Box>
  )
}

export default ProductSellerPage
