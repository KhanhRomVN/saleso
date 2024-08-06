import React from 'react'
import { Form, Input, Button, Typography, Card, message } from 'antd'
import { UserOutlined } from '@ant-design/icons'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { BACKEND_URI } from '~/API'

const { Title, Text } = Typography

const gradientBackgroundStyle = {
  minHeight: '100vh',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundImage: 'url(https://i.ibb.co/sgjkdwF/download-1.jpg)',
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  padding: '20px',
}

const UsernameGooglePage = () => {
  const { sub } = useParams()
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const handleRegister = async (values) => {
    try {
      const accessToken = localStorage.getItem('accessToken')
      await axios.post(
        `${BACKEND_URI}/user/update-username`,
        { username: values.username },
        {
          headers: {
            'Content-Type': 'application/json',
            accessToken: accessToken,
          },
        },
      )
      message.success('Username updated successfully')
      navigate('/')
    } catch (error) {
      message.error('Error updating username')
    }
  }

  return (
    <div style={gradientBackgroundStyle}>
      <Card style={{ width: 350 }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <img
            src="https://i.ibb.co/CMSJMK3/Brandmark-make-your-logo-in-minutes-removebg-preview.png"
            alt="logo"
            style={{ height: 40, marginBottom: 16 }}
          />
          <Title level={3}>Welcome to Saleso!</Title>
          <Text>Please enter username to access the website</Text>
        </div>
        <Form form={form} onFinish={handleRegister} layout="vertical">
          <Form.Item name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Register
            </Button>
          </Form.Item>
        </Form>
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <Text>Already have an account? </Text>
          <Button type="link" onClick={() => navigate('/login')}>
            Login here
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default UsernameGooglePage
