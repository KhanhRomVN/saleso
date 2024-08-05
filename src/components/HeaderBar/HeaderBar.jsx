import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import { Layout, Input, Avatar, Dropdown, Button, ConfigProvider, theme } from 'antd'
import { HeartOutlined, ShoppingCartOutlined, UserOutlined, SearchOutlined, LogoutOutlined } from '@ant-design/icons'
import { BACKEND_URI } from '~/API'

const { Header } = Layout
const { Search } = Input

const HeaderBar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [avatarUrl, setAvatarUrl] = useState('/static/images/avatar/1.jpg')
  const currentUser = JSON.parse(localStorage.getItem('currentUser'))
  const [themeMode, setThemeMode] = useState(localStorage.getItem('mui-mode') || 'light')

  useEffect(() => {
    const fetchAvatar = async () => {
      try {
        if (currentUser) {
          const response = await axios.post(`${BACKEND_URI}/user/get-user-data-by-user-id`, {
            user_id: currentUser.user_id,
          })
          const avatar = response.data.avatar
          setAvatarUrl(avatar)
        }
      } catch (error) {
        console.error('Failed to fetch user data:', error)
      }
    }

    fetchAvatar()
  }, [currentUser])

  useEffect(() => {
    const history = JSON.parse(sessionStorage.getItem('navigationHistory')) || []
    history.push(location.pathname)
    sessionStorage.setItem('navigationHistory', JSON.stringify(history))
  }, [location.pathname])

  useEffect(() => {
    const handleThemeChange = () => {
      setThemeMode(localStorage.getItem('mui-mode') || 'light')
    }

    window.addEventListener('storage', handleThemeChange)

    return () => {
      window.removeEventListener('storage', handleThemeChange)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    navigate('/login')
  }

  const handleLogin = () => {
    navigate('/login')
  }

  const handleProfileClick = () => {
    const username = currentUser.username
    navigate(`/profile/${username}`)
  }

  const handleCartClick = () => {
    navigate('/cart')
  }

  const dropdownItems = [
    {
      key: '1',
      label: 'Profile',
      icon: <UserOutlined />,
      onClick: handleProfileClick,
    },
    {
      key: '2',
      label: 'Logout',
      icon: <LogoutOutlined />,
      onClick: handleLogout,
    },
  ]

  const { defaultAlgorithm, darkAlgorithm } = theme

  return (
    <ConfigProvider
      theme={{
        algorithm: themeMode === 'dark' ? darkAlgorithm : defaultAlgorithm,
      }}
    >
      <Header
        style={{
          position: 'fixed',
          top: 0,
          zIndex: 1000,
          width: '100%',
          padding: '0 50px',
          background: themeMode === 'dark' ? '#141414' : '#fff',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '100%' }}>
          <div className="logo" style={{ display: 'flex', alignContent: 'content' }}>
            <img
              src="https://i.ibb.co/CMSJMK3/Brandmark-make-your-logo-in-minutes-removebg-preview.png"
              alt="logo"
              style={{ height: '40px' }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Search placeholder="Search..." style={{ width: 200, marginRight: 16 }} />
            <HeartOutlined style={{ fontSize: 20, marginRight: 16 }} />
            <ShoppingCartOutlined style={{ fontSize: 20, marginRight: 16 }} onClick={handleCartClick} />
            {currentUser ? (
              <Dropdown menu={{ items: dropdownItems }} placement="bottomRight">
                <Avatar src={avatarUrl} style={{ cursor: 'pointer' }} />
              </Dropdown>
            ) : (
              <Button onClick={handleLogin}>Login</Button>
            )}
          </div>
        </div>
      </Header>
    </ConfigProvider>
  )
}

export default HeaderBar
