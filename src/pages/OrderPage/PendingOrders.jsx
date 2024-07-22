import React, { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import axios from 'axios'
import { Button } from '@mui/material'
import { BACKEND_URI } from '~/API'

const PendingOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.post(
          `${BACKEND_URI}/order/get-list-order-seller`,
          {},
          {
            headers: { accessToken: localStorage.getItem('accessToken') },
          },
        )

        const ordersWithUsernames = await Promise.all(
          response.data.map(async (order) => {
            const userResponse = await axios.post(`${BACKEND_URI}/user/get-user-by-id`, { user_id: order.customer_id })
            return { ...order, customer_username: userResponse.data.username }
          }),
        )

        setOrders(ordersWithUsernames)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching pending orders:', error)
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  const handleAccept = async (orderId) => {
    try {
      await axios.post(
        `${BACKEND_URI}/order/accept-order`,
        { order_id: orderId },
        {
          headers: { accessToken: localStorage.getItem('accessToken') },
        },
      )
      setOrders(orders.filter((order) => order._id !== orderId))
    } catch (error) {
      console.error('Error accepting order:', error)
    }
  }

  const handleRefuse = async (orderId) => {
    try {
      await axios.post(
        `${BACKEND_URI}/order/refuse-order`,
        { order_id: orderId },
        {
          headers: { accessToken: localStorage.getItem('accessToken') },
        },
      )
      setOrders(orders.filter((order) => order._id !== orderId))
    } catch (error) {
      console.error('Error refusing order:', error)
    }
  }

  const columns = [
    { field: 'customer_username', headerName: 'Customer', width: 100 },
    { field: 'product_id', headerName: 'Product', width: 100 },
    { field: 'price', headerName: 'Price', width: 80 },
    { field: 'quantity', headerName: 'Quantity', width: 80 },
    { field: 'address', headerName: 'Address', width: 100 },
    { field: 'paymentMethod', headerName: 'Payment Method', width: 120 },
    { field: 'deliveryMethod', headerName: 'Delivery Method', width: 120 },
    { field: 'deliveryCost', headerName: 'Delivery Cost', width: 120 },
    { field: 'status', headerName: 'Status', width: 80 },
    {
      field: 'accept',
      headerName: 'Accept',
      width: 100,
      renderCell: (params) => (
        <Button variant="contained" color="primary" onClick={() => handleAccept(params.row._id)}>
          Accept
        </Button>
      ),
    },
    {
      field: 'refuse',
      headerName: 'Refuse',
      width: 100,
      renderCell: (params) => (
        <Button variant="contained" color="secondary" onClick={() => handleRefuse(params.row._id)}>
          Refuse
        </Button>
      ),
    },
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

export default PendingOrders
