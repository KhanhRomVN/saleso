import { DataGrid } from '@mui/x-data-grid/'
import TextField from '@mui/material/TextField'
import Checkbox from '@mui/material/Checkbox'
import { useNavigate } from 'react-router-dom'
import Button from '@mui/material/Button'

const ProductTable = ({ products, loading, handleProcessRowUpdate, handleInventoryUpdate }) => {
  const navigate = useNavigate()

  const handleProdIdClick = (id) => {
    navigate(`/product/${id}`)
  }

  const columns = [
    {
      field: 'prod_id',
      headerName: 'Product ID',
      width: 150,
      renderCell: (params) => (
        <Button variant="text" onClick={() => handleProdIdClick(params.value)}>
          {params.value}
        </Button>
      ),
      sortable: false,
      filterable: false,
    },
    { field: 'name', headerName: 'Name', width: 150, editable: true },
    {
      field: 'image',
      headerName: 'Image',
      width: 100,
      renderCell: (params) => (
        <img src={params.value} alt={params.row.name} style={{ width: '50px', height: '50px' }} />
      ),
      editable: true,
    },
    { field: 'description', headerName: 'Description', width: 200, editable: true },
    { field: 'price', headerName: 'Price', width: 100, editable: true },
    { field: 'category', headerName: 'Category', width: 150, editable: true },
    {
      field: 'inventory',
      headerName: 'Inventory',
      width: 100,
      editable: true,
      renderCell: (params) => (
        <TextField
          type="number"
          defaultValue={params.value}
          onBlur={(event) => handleInventoryUpdate(params.id, event.target.value)}
        />
      ),
    },
    { field: 'units_sold', headerName: 'Units Sold', width: 100 },
    {
      field: 'is_active',
      headerName: 'Active',
      width: 100,
      editable: true,
      renderCell: (params) => (
        <Checkbox
          checked={params.value === 'yes'}
          onChange={(event) => {
            const newStatus = event.target.checked ? 'yes' : 'no'
            handleProcessRowUpdate({ ...params.row, is_active: newStatus }, params.row)
          }}
        />
      ),
    },
  ]

  return (
    <DataGrid
      rows={products}
      columns={columns}
      pageSize={10}
      rowsPerPageOptions={[10]}
      loading={loading}
      getRowId={(row) => row._id}
      processRowUpdate={handleProcessRowUpdate}
    />
  )
}

export default ProductTable
