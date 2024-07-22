import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid'
import axios from 'axios'
import { BACKEND_URI } from '~/API'
import LabeledInputBase from './LabeledInputBase'
import Typography from '@mui/material/Typography'
import { imageDB } from '~/firebase/firebaseConfig'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { v4 } from 'uuid'

const AddProductForm = ({ accessToken, onProductAdded, onCancel }) => {
  const [productData, setProductData] = useState({
    name: '',
    description: '',
    image: '',
    price: '',
    category: '',
    inventory: '',
  })
  const [imageFile, setImageFile] = useState(null)
  const [showUploadButton, setShowUploadButton] = useState(true) // State to control upload button visibility

  const handleChange = (event) => {
    const { name, value } = event.target
    setProductData({ ...productData, [name]: value })
  }

  const handleImageChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      setImageFile(file)
      setShowUploadButton(false) // Hide the upload button after selecting an image
    }
  }

  const handleImageUpload = async () => {
    if (imageFile) {
      const imageRef = ref(imageDB, `images/${v4()}.${imageFile.type.split('/').pop()}`)
      await uploadBytes(imageRef, imageFile)
      const url = await getDownloadURL(imageRef)
      setProductData({ ...productData, image: url })
    }
  }

  const handlePreviewClick = () => {
    if (!imageFile) {
      const inputElement = document.getElementById('image-upload')
      inputElement.click()
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    await handleImageUpload()
    try {
      const formData = {
        name: productData.name,
        description: productData.description,
        image: productData.image,
        price: productData.price,
        category: productData.category,
        inventory: productData.inventory,
      }
      await axios.post(`${BACKEND_URI}/product/add-product`, formData, {
        headers: {
          accessToken: accessToken,
        },
      })
      onProductAdded()
    } catch (error) {
      console.error('Error adding product:', error)
    }
  }

  return (
    <Box sx={{ width: 800, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Grid container spacing={2}>
        {/* Left Section for Image Upload */}
        <Grid item xs={6}>
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              borderRight: '1px solid #ccc',
            }}
          >
            <input
              accept="image/*"
              id="image-upload"
              type="file"
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
            {showUploadButton && (
              <label htmlFor="image-upload">
                <Button variant="contained" component="span">
                  Select product photo
                </Button>
              </label>
            )}
            {imageFile && (
              <div onClick={handlePreviewClick}>
                <label htmlFor="image-upload" style={{ cursor: 'pointer' }}>
                  <img
                    alt="Preview"
                    src={URL.createObjectURL(imageFile)}
                    style={{ width: '300px', cursor: 'pointer' }}
                  />
                </label>
              </div>
            )}
          </Box>
        </Grid>
        {/* Right Section for Product Information */}
        <Grid item xs={6}>
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <LabeledInputBase
                  label="Name:"
                  type="text"
                  value={productData.name}
                  onChange={handleChange}
                  name="name"
                  placeholder="Enter the product name"
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <LabeledInputBase
                  label="Price:"
                  type="number"
                  value={productData.price}
                  onChange={handleChange}
                  name="price"
                  placeholder="Enter product price"
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <LabeledInputBase
                  label="Description:"
                  type="text"
                  value={productData.description}
                  onChange={handleChange}
                  name="description"
                  placeholder="Enter product description"
                  fullWidth
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <Typography>Category: </Typography>
                <Box sx={{ display: 'flex', width: '100%', gap: '10px' }}>
                  <Button
                    variant={productData.category === 'A' ? 'contained' : 'outlined'}
                    onClick={() => handleChange({ target: { name: 'category', value: 'fashion' } })}
                  >
                    Fashion
                  </Button>
                  <Button
                    variant={productData.category === 'B' ? 'contained' : 'outlined'}
                    onClick={() => handleChange({ target: { name: 'category', value: 'electronic' } })}
                  >
                    Electronic
                  </Button>
                  <Button
                    variant={productData.category === 'C' ? 'contained' : 'outlined'}
                    onClick={() => handleChange({ target: { name: 'category', value: 'food' } })}
                  >
                    Food
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12}>
                <LabeledInputBase
                  label="Inventory:"
                  type="number"
                  value={productData.inventory}
                  onChange={handleChange}
                  name="inventory"
                  placeholder="Enter inventory quantity"
                  fullWidth
                  variant="outlined"
                />
              </Grid>
            </Grid>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                Add Product
              </Button>
              <Button variant="outlined" color="primary" onClick={onCancel}>
                Cancel
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Box>
  )
}

export default AddProductForm
