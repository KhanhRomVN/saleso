import React, { useState, useEffect } from 'react'
import { List, Button, Modal, Form, Input, message } from 'antd'
import axios from 'axios'
import { BACKEND_URI } from '~/API'

const LocationSettings = () => {
  const [addresses, setAddresses] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()
  const currentUser = JSON.parse(localStorage.getItem('currentUser'))

  useEffect(() => {
    fetchAddresses()
  }, [])

  const fetchAddresses = async () => {
    try {
      const response = await axios.post(`${BACKEND_URI}/user/get-addresses`, {
        user_id: currentUser.user_id,
      })
      setAddresses(response.data)
    } catch (error) {
      console.error('Failed to fetch addresses:', error)
      message.error('Failed to load addresses')
    }
  }

  const handleAddAddress = () => {
    setIsModalVisible(true)
  }

  const handleModalOk = () => {
    form.submit()
  }

  const handleModalCancel = () => {
    setIsModalVisible(false)
    form.resetFields()
  }

  const onFinish = async (values) => {
    try {
      await axios.post(`${BACKEND_URI}/user/add-address`, {
        user_id: currentUser.user_id,
        ...values,
      })
      message.success('Address added successfully')
      setIsModalVisible(false)
      form.resetFields()
      fetchAddresses()
    } catch (error) {
      console.error('Failed to add address:', error)
      message.error('Failed to add address')
    }
  }

  return (
    <div>
      <List
        dataSource={addresses}
        renderItem={(item) => (
          <List.Item>
            {item.street}, {item.city}, {item.state} {item.zip}
          </List.Item>
        )}
      />
      <Button onClick={handleAddAddress}>Add New Address</Button>
      <Modal title="Add New Address" visible={isModalVisible} onOk={handleModalOk} onCancel={handleModalCancel}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="street" label="Street" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="city" label="City" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="state" label="State" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="zip" label="ZIP Code" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default LocationSettings
