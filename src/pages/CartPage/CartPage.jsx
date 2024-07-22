import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import axios from 'axios'
import Typography from '@mui/material/Typography'
import { useNavigate } from 'react-router-dom'
import { BACKEND_URI } from '~/API'
import CartInventory from './CartInventory'
import OrderSummary from './OrderSummary'
import { useSnackbar } from 'notistack'

const CartPage = () => {
  const [products, setProducts] = useState([])
  const [selectedProducts, setSelectedProducts] = useState([])
  const [quantities, setQuantities] = useState({}) // State to manage quantities
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    const fetchCartData = async () => {
      const accessToken = localStorage.getItem('accessToken')
      try {
        const response = await axios.post(
          `${BACKEND_URI}/cart/get-carts`,
          {},
          {
            headers: {
              'Content-Type': 'application/json',
              accessToken: accessToken,
            },
          },
        )
        setProducts(response.data.productList)
        // Initialize quantities state based on fetched products
        const initialQuantities = {}
        response.data.productList.forEach((product) => {
          initialQuantities[product._id] = 1 // Initial quantity set to 1
        })
        setQuantities(initialQuantities)
      } catch (error) {
        console.error('Error fetching cart data', error)
        enqueueSnackbar('Error fetching cart data', { variant: 'error' })
      }
    }

    fetchCartData()
  }, [])

  const handleCheckboxChange = (product) => {
    setSelectedProducts((prevSelectedProducts) => {
      if (prevSelectedProducts.some((p) => p._id === product._id)) {
        return prevSelectedProducts.filter((p) => p._id !== product._id)
      } else {
        return [...prevSelectedProducts, product]
      }
    })
  }

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`${BACKEND_URI}/cart/delete-product/${productId}`)
      setProducts((prevProducts) => prevProducts.filter((product) => product._id !== productId))
      setSelectedProducts((prevSelectedProducts) => prevSelectedProducts.filter((product) => product._id !== productId))
      enqueueSnackbar('Product deleted successfully', { variant: 'success' })
    } catch (error) {
      console.error('Error deleting product', error)
      enqueueSnackbar('Error deleting product', { variant: 'error' })
    }
  }

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`)
  }

  const handleQuantityChange = (productId, newQuantity) => {
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: newQuantity,
    }))

    // Update quantity in selectedProducts as well
    setSelectedProducts((prevSelectedProducts) =>
      prevSelectedProducts.map((product) =>
        product._id === productId ? { ...product, quantity: newQuantity } : product,
      ),
    )
  }

  const totalItems = selectedProducts.length
  const totalPrice = selectedProducts.reduce((acc, product) => acc + product.price * quantities[product._id], 0)

  const handleCheckout = async () => {
    enqueueSnackbar('Checkout functionality not implemented yet', { variant: 'info' })
  }

  return (
    <Box
      sx={{
        width: 'auto',
        height: '100%',
        boxSizing: 'border-box',
        padding: '8px',
        display: 'flex',
        gap: '10px',
      }}
    >
      <CartInventory
        products={products}
        selectedProducts={selectedProducts}
        quantities={quantities}
        handleCheckboxChange={handleCheckboxChange}
        handleDeleteProduct={handleDeleteProduct}
        handleProductClick={handleProductClick}
        handleQuantityChange={handleQuantityChange}
      />
      <OrderSummary
        selectedProducts={selectedProducts}
        quantities={quantities}
        totalPrice={totalPrice}
        handleCheckout={handleCheckout}
      />
    </Box>
  )
}

export default CartPage
