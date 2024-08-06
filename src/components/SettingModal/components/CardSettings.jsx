import React, { useState, useEffect } from 'react'
import { List, Button, Modal, Form, Input, message } from 'antd'
import axios from 'axios'
import { BACKEND_URI } from '~/API'

const CardSettings = () => {
  const [cards, setCards] = useState([])
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [form] = Form.useForm()
  const currentUser = JSON.parse(localStorage.getItem('currentUser'))

  useEffect(() => {
    fetchCards()
  }, [])

  const fetchCards = async () => {
    try {
      const response = await axios.post(`${BACKEND_URI}/user/get-cards`, {
        user_id: currentUser.user_id,
      })
      setCards(response.data)
    } catch (error) {
      console.error('Failed to fetch cards:', error)
      message.error('Failed to load cards')
    }
  }

  const handleAddCard = () => {
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
      await axios.post(`${BACKEND_URI}/user/add-card`, {
        user_id: currentUser.user_id,
        ...values,
      })
      message.success('Card added successfully')
      setIsModalVisible(false)
      form.resetFields()
      fetchCards()
    } catch (error) {
      console.error('Failed to add card:', error)
      message.error('Failed to add card')
    }
  }

  return (
    <div>
      <List
        dataSource={cards}
        renderItem={(item) => (
          <List.Item>
            {item.card_type} ending in {item.last_four}
          </List.Item>
        )}
      />
      <Button onClick={handleAddCard}>Add New Card</Button>
      <Modal title="Add New Card" visible={isModalVisible} onOk={handleModalOk} onCancel={handleModalCancel}>
        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item name="card_number" label="Card Number" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="expiry_date" label="Expiry Date" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="cvv" label="CVV" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="name_on_card" label="Name on Card" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default CardSettings
