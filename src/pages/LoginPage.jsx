import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CustomInput from '~/components/InputBar/CustomInput'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { BACKEND_URI } from '~/API'
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import { useSnackbar } from 'notistack'

const gradientBackgroundUri = 'https://i.ibb.co/HFMBf1q/Orange-And-White-Gradient-Background.jpg'

const LoginPage = () => {
  const navigate = useNavigate()
  const { enqueueSnackbar } = useSnackbar()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async () => {
    try {
      const response = await axios.post(`${BACKEND_URI}/auth/login`, { email, password, role: 'customer' })
      const { currentUser, accessToken, refreshToken } = response.data

      localStorage.setItem('currentUser', JSON.stringify(currentUser))
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)

      enqueueSnackbar('Login successful!', { variant: 'success' })
      navigate('/')
    } catch (error) {
      console.error('Error logging in:', error)
      enqueueSnackbar('Login failed. Please check your credentials.', { variant: 'error' })
    }
  }

  const navigateToRegister = () => {
    navigate('/register')
  }

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      const decoded = jwtDecode(credentialResponse.credential)
      const { email, name, picture, sub } = decoded
      const userData = {
        email,
        name,
        picture,
        sub,
      }
      const response = await axios.post(`${BACKEND_URI}/auth/login/google`, userData)
      const { accessToken, refreshToken, currentUser } = response.data
      localStorage.setItem('accessToken', accessToken)
      localStorage.setItem('refreshToken', refreshToken)
      localStorage.setItem('currentUser', JSON.stringify(currentUser))

      let localStorageCurrentUser = JSON.parse(localStorage.getItem('currentUser'))

      if (!localStorageCurrentUser.username) {
        navigate(`/register/username/${sub}`)
        return
      }

      enqueueSnackbar('Login successful!', { variant: 'success' })
      navigate('/')
    } catch (err) {
      enqueueSnackbar('Google login failed.', { variant: 'error' })
    }
  }

  const handleGoogleLoginError = () => {
    enqueueSnackbar('Google login failed.', { variant: 'error' })
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundImage: `url(${gradientBackgroundUri})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        flexDirection: 'column',
        padding: '20px',
      }}
    >
      <Box
        sx={{
          bgcolor: (theme) => theme.palette.backgroundColor.primary,
          borderRadius: '8px',
          width: '100%',
          maxWidth: '400px',
          padding: '20px',
          marginBottom: '20px',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
          <Box sx={{ width: '100%', height: '40px', textAlign: 'center' }}>
            <img
              src="https://i.postimg.cc/jd0dTYF1/logo.png"
              alt="logo"
              style={{ objectFit: 'cover', height: '100%' }}
            />
          </Box>
          <Typography sx={{ fontSize: '24px', textAlign: 'center' }}>Welcome to Saleso!</Typography>
          <Typography sx={{ fontSize: '14px', textAlign: 'center' }}>
            Please enter your email and password to login
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            bgcolor: (theme) => theme.palette.backgroundColor.secondary,
            padding: '20px',
          }}
        >
          <CustomInput label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <CustomInput
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            variant="contained"
            onClick={handleLogin}
            sx={{
              marginTop: '20px',
              backgroundColor: (theme) => theme.other.primaryColor,
              color: (theme) => theme.palette.textColor.primary,
            }}
          >
            Login
          </Button>
          <Box sx={{ width: '100%', marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
            <GoogleLogin onSuccess={handleGoogleLoginSuccess} onError={handleGoogleLoginError} sx={{ width: '100%' }} />
          </Box>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', marginTop: '10px', gap: '10px', flexDirection: 'column', alignItems: 'center' }}>
        <Typography sx={{ color: (theme) => theme.palette.textColor.secondary }}>Don't have an account?</Typography>
        <Typography sx={{ color: (theme) => theme.other.primaryColor, cursor: 'pointer' }} onClick={navigateToRegister}>
          Register here
        </Typography>
      </Box>
    </Box>
  )
}

export default LoginPage
