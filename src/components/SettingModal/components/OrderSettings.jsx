import React, { useState, useEffect } from 'react'
import { List, Tag, message } from 'antd'
import axios from 'axios'
import { BACKEND_URI } from '~/API'

const OrderSettings = () => {
  const [orders, setOrders] = useState([])
  const currentUser = JSON.parse(localStorage.getItem('currentUser'))

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const response = await axios.post(`${BACKEND_URI}/user/get-orders`, {
        user_id: currentUser.user_id,
      })
      setOrders(response.data)
    } catch (error) {
      console.error('Failed to fetch orders:', error)
      message.error('Failed to load orders')
    }
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'orange'
      case 'shipped':
        return 'blue'
      case 'delivered':
        return 'green'
      case 'cancelled':
        return 'red'
      default:
        return 'default'
    }
  }

  return (
    <div>
      <h2>Your Orders</h2>
      <List
        dataSource={orders}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={`Order #${item.order_id}`}
              description={`Placed on ${new Date(item.order_date).toLocaleDateString()}`}
            />
            <div>
              Total: ${item.total_amount}
              <Tag color={getStatusColor(item.status)} style={{ marginLeft: 8 }}>
                {item.status}
              </Tag>
            </div>
          </List.Item>
        )}
      />
    </div>
  )
}

export default OrderSettings
