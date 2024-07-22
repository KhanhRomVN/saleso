import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import axios from 'axios'
import { BACKEND_URI } from '~/API'
import { useNavigate } from 'react-router-dom'
import AddProductForm from './AddProductForm'
import AddProductButton from './AddProductButton'
import SearchBar from './SearchBar'
import ProductTable from './ProductTable'

const MyProductPage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAddProductForm, setShowAddProductForm] = useState(false)
  const navigate = useNavigate()
  const accessToken = localStorage.getItem('accessToken')
  const currentUser = JSON.parse(localStorage.getItem('currentUser'))
  const isSeller = currentUser?.role === 'seller'

  useEffect(() => {
    fetchProducts()
  }, [accessToken])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const response = await axios.post(
        `${BACKEND_URI}/product/get-list-product-by-user-id`,
        {},
        {
          headers: {
            accessToken: accessToken,
          },
        },
      )
      const productsWithId = response.data.products.map((product) => ({
        ...product,
        prod_id: product._id,
      }))
      setProducts(productsWithId)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value)
  }

  const handleBecomeSeller = async () => {
    try {
      await axios.post(
        `${BACKEND_URI}/user/update-user-field`,
        { field: 'role', value: 'seller' },
        { headers: { accessToken: accessToken } },
      )
      currentUser.role = 'seller'
      localStorage.setItem('currentUser', JSON.stringify(currentUser))
      window.location.reload()
    } catch (error) {
      console.error('Error updating user role:', error)
    }
  }

  const handleAddProduct = () => {
    setShowAddProductForm(true)
  }

  const handleCancelAddProduct = () => {
    setShowAddProductForm(false)
  }

  const handleProductAdded = () => {
    setShowAddProductForm(false)
    fetchProducts()
  }

  const handleProcessRowUpdate = async (newRow, oldRow) => {
    try {
      const { _id: prod_id, name, image, description, price, category } = newRow
      await axios.post(
        `${BACKEND_URI}/product/update-product`,
        { prod_id, name, image, description, price, category },
        { headers: { accessToken: accessToken } },
      )

      if (newRow.is_active !== oldRow.is_active) {
        const status = oldRow.is_active === 'yes' ? 'no' : 'yes'
        await axios.post(
          `${BACKEND_URI}/product/update-status`,
          { prod_id, status },
          { headers: { accessToken: accessToken } },
        )
      }
      return newRow
    } catch (error) {
      console.error('Error updating product:', error)
      return oldRow
    }
  }

  const handleInventoryUpdate = async (id, inventoryAdd) => {
    try {
      await axios.post(
        `${BACKEND_URI}/product/add-inventory`,
        {
          prod_id: id,
          inventoryAdd: parseInt(inventoryAdd, 10),
        },
        {
          headers: {
            accessToken: accessToken,
          },
        },
      )
      fetchProducts()
    } catch (error) {
      console.error('Error updating inventory:', error)
    }
  }

  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <Box sx={{ height: '100vh', width: '100%', padding: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <SearchBar searchQuery={searchQuery} handleSearchChange={handleSearchChange} />
        <AddProductButton
          isSeller={isSeller}
          handleAddProduct={handleAddProduct}
          handleBecomeSeller={handleBecomeSeller}
        />
      </Box>
      {showAddProductForm && isSeller && (
        <Box
          sx={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            zIndex: 999,
          }}
        >
          <AddProductForm
            accessToken={accessToken}
            onProductAdded={handleProductAdded}
            onCancel={handleCancelAddProduct}
          />
        </Box>
      )}
      <ProductTable
        products={filteredProducts}
        loading={loading}
        handleProcessRowUpdate={handleProcessRowUpdate}
        handleInventoryUpdate={handleInventoryUpdate}
      />
    </Box>
  )
}

export default MyProductPage
