import React, { useState } from 'react'
import { Form, Input, Button, Typography, Card, message } from 'antd'
import { MailOutlined, LockOutlined, UserOutlined } from '@ant-design/icons'
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

const EmailPage = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [showOTPInput, setShowOTPInput] = useState(false)

  const handleEmailSubmit = async (values) => {
    try {
      await axios.post(`${BACKEND_URI}/auth/email-verify`, { email: values.email })
      setShowOTPInput(true)
      message.success('OTP sent to your email')
    } catch (error) {
      if (error.response && error.response.status === 400) {
        message.error('Email already registered')
        setTimeout(() => navigate('/login'), 3000)
      } else {
        message.error('Error sending email verification')
      }
    }
  }

  const handleOTPSubmit = async (values) => {
    try {
      const response = await axios.post(`${BACKEND_URI}/auth/register-otp`, values)
      message.success('Registration successful')
      navigate('/login')
    } catch (error) {
      message.error('Error verifying OTP')
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
          <Text>Create an account to experience many new things</Text>
        </div>
        <Form form={form} onFinish={showOTPInput ? handleOTPSubmit : handleEmailSubmit} layout="vertical">
          <Form.Item name="email" rules={[{ required: true, type: 'email', message: 'Please input a valid email!' }]}>
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>
          {showOTPInput && (
            <>
              <Form.Item name="otp" rules={[{ required: true, message: 'Please input the OTP!' }]}>
                <Input prefix={<LockOutlined />} placeholder="OTP" />
              </Form.Item>
              <Form.Item name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
                <Input prefix={<UserOutlined />} placeholder="Username" />
              </Form.Item>
              <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
                <Input.Password prefix={<LockOutlined />} placeholder="Password" />
              </Form.Item>
            </>
          )}
          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {showOTPInput ? 'Verify OTP' : 'Register'}
            </Button>
          </Form.Item>
        </Form>
        <div style={{ textAlign: 'center' }}>
          <GoogleLogin onSuccess={handleGoogleLoginSuccess} onError={() => message.error('Google login failed.')} />
        </div>
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

export default EmailPage
