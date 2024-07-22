import React, { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import axios from 'axios'
import { BACKEND_URI } from '~/API'

const RefusedOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.post(
          `${BACKEND_URI}/order/get-list-refuse-order-seller`,
          {},
          {
            headers: { accessToken: localStorage.getItem('accessToken') },
          },
        )
        setOrders(response.data)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching refused orders:', error)
      }
    }

    fetchOrders()
  }, [])

  const columns = [
    { field: 'customer_id', headerName: 'Customer ID', width: 150 },
    { field: 'seller_id', headerName: 'Seller ID', width: 150 },
    { field: 'product_id', headerName: 'Product ID', width: 150 },
    { field: 'price', headerName: 'Price', width: 120 },
    { field: 'quantity', headerName: 'Quantity', width: 120 },
    { field: 'address', headerName: 'Address', width: 200 },
    { field: 'paymentMethod', headerName: 'Payment Method', width: 150 },
    { field: 'deliveryMethod', headerName: 'Delivery Method', width: 150 },
    { field: 'deliveryCost', headerName: 'Delivery Cost', width: 150 },
    { field: 'status', headerName: 'Status', width: 120 },
  ]

  return (
    <div style={{ height: 500, width: '100%' }}>
      <DataGrid
        rows={orders}
        columns={columns}
        pageSize={10}
        rowsPerPageOptions={[10]}
        loading={loading}
        getRowId={(row) => row._id}
      />
    </div>
  )
}

export default RefusedOrders
