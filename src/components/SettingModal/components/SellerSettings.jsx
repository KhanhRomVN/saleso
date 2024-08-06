import React, { useState, useEffect } from 'react'
import { Button, Form, Input, message } from 'antd'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { BACKEND_URI } from '~/API'

const SellerSettings = () => {
  const [isSeller, setIsSeller] = useState(false)
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const currentUser = JSON.parse(localStorage.getItem('currentUser'))

  useEffect(() => {
    checkSellerStatus()
  }, [])

  const checkSellerStatus = async () => {
    try {
      const response = await axios.post(`${BACKEND_URI}/user/check-seller-status`, {
        user_id: currentUser.user_id,
      })
      setIsSeller(response.data.is_seller)
    } catch (error) {
      console.error('Failed to check seller status:', error)
      message.error('Failed to check seller status')
    }
  }

  const onFinish = async (values) => {
    try {
      await axios.post(`${BACKEND_URI}/user/register-seller`, {
        user_id: currentUser.user_id,
        ...values,
      })
      message.success('Seller registration successful')
      setIsSeller(true)
    } catch (error) {
      console.error('Failed to register as seller:', error)
      message.error('Failed to register as seller')
    }
  }

  const handleGoToSellerDashboard = () => {
    navigate('/seller')
  }

  if (isSeller) {
    return (
      <div>
        <h2>You are registered as a seller</h2>
        <Button onClick={handleGoToSellerDashboard}>Go to Seller Dashboard</Button>
      </div>
    )
  }

  return (
    <div>
      <h2>Register as a Seller</h2>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item name="business_name" label="Business Name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="business_address" label="Business Address" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="tax_id" label="Tax ID" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Register as Seller
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default SellerSettings
