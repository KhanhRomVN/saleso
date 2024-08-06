import React, { useState } from 'react'
import { Form, Input, Button, Typography, Card, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { BACKEND_URI } from '~/API'
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'

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

const LoginPage = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()

  const handleLogin = async (values) => {
    try {
      const response = await axios.post(`${BACKEND_URI}/auth/login`, { ...values, role: 'customer' })
      const { currentUser, accessToken, refreshToken } = response.data

      localStorage.setItem('currentUser', JSON.stringify(currentUser))
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)

      message.success('Login successful!')
      navigate('/')
    } catch (error) {
      console.error('Error logging in:', error)
      message.error('Login failed. Please check your credentials.')
    }
  }

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential)
      const { email, name, picture, sub } = decoded
      const response = await axios.post(`${BACKEND_URI}/auth/login/google`, { email, name, picture, sub })
      const { accessToken, refreshToken, currentUser } = response.data

      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      localStorage.setItem('currentUser', JSON.stringify(currentUser))

      if (!currentUser.username) {
        navigate(`/register/username/${sub}`)
        return
      }

      message.success('Login successful!')
      navigate('/')
    } catch (err) {
      message.error('Google login failed.')
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
          <Text>Please enter your email and password to login</Text>
        </div>
        <Form form={form} onFinish={handleLogin} layout="vertical">
          <Form.Item name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Login
            </Button>
          </Form.Item>
        </Form>
        <div style={{ textAlign: 'center' }}>
          <GoogleLogin onSuccess={handleGoogleLoginSuccess} onError={() => message.error('Google login failed.')} />
        </div>
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <Text>Do not have an account? </Text>
          <Button type="link" onClick={() => navigate('/register')}>
            Register here
          </Button>
        </div>
      </Card>
    </div>
  )
}

export default LoginPage
