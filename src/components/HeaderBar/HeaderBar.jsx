import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import axios from 'axios'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import InputBase from '@mui/material/InputBase'
import Avatar from '@mui/material/Avatar'
import Button from '@mui/material/Button'
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined'
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined'
import PersonIcon from '@mui/icons-material/Person'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import AssignmentIcon from '@mui/icons-material/Assignment'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import { BACKEND_URI } from '~/API'

const HeaderBar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [showSearch, setShowSearch] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [avatarUrl, setAvatarUrl] = useState('/static/images/avatar/1.jpg')
  const currentUser = JSON.parse(localStorage.getItem('currentUser'))

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

  const goBack = () => {
    const history = JSON.parse(sessionStorage.getItem('navigationHistory')) || []
    if (history.length > 1) {
      history.pop() // Remove current page
      const previousPage = history.pop()
      sessionStorage.setItem('navigationHistory', JSON.stringify(history))
      navigate(previousPage)
    } else {
      navigate('/') // If no history or at the start, navigate to home
    }
  }

  const toggleSearch = () => {
    setShowSearch(!showSearch)
  }

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    navigate('/login')
  }

  const handleLogin = () => {
    navigate('/login')
  }

  const handleAvatarClick = () => {
    setShowDropdown(!showDropdown)
  }

  const handleDropdownClose = () => {
    setShowDropdown(false)
  }

  const handleProfileClick = () => {
    const username = currentUser.username
    navigate(`/profile/${username}`)
    handleDropdownClose()
  }

  const handleCartClick = () => {
    navigate('/cart')
    handleDropdownClose()
  }

  const handleOrderClick = () => {
    navigate('/order')
    handleDropdownClose()
  }

  const handleHelpClick = () => {
    navigate('/help')
    handleDropdownClose()
  }

  return (
    <Box
      sx={{
        backgroundColor: (theme) => theme.palette.backgroundColor.secondary,
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 5,
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{ height: '61px', width: '90%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', height: '80%' }}>
          <img
            src="https://i.ibb.co/BrWdqfq/Brandmark-make-your-logo-in-minutes.png"
            alt="logo"
            style={{ objectFit: 'cover', height: '78%' }}
          />
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Search Bar */}
          {!showSearch && (
            <IconButton color="inherit" onClick={toggleSearch}>
              <SearchOutlinedIcon />
            </IconButton>
          )}
          {showSearch && (
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                maxWidth: '400px',
                marginRight: '16px',
                display: 'flex',
                alignItems: 'center',
                height: '40px',
              }}
            >
              <InputBase
                placeholder="Search…"
                sx={{
                  color: 'inherit',
                  width: '100%',
                  padding: '4px 4px 4px 16px', // Adjust padding to reduce height
                  backgroundColor: '#18171c',
                  borderRadius: 1,
                }}
              />
            </Box>
          )}
          {/* Notification & Avatar */}
          <IconButton color="inherit">
            <NotificationsOutlinedIcon />
          </IconButton>
          <IconButton color="inherit" onClick={handleAvatarClick}>
            <Avatar alt="User Avatar" src={avatarUrl} sx={{ width: '30px', height: '30px', borderRadius: '10px' }} />
          </IconButton>
          {showDropdown && (
            <Box
              sx={{
                position: 'absolute',
                top: '60px',
                right: '10px',
                backgroundColor: (theme) => theme.palette.backgroundColor.primary,
                borderRadius: '4px',
                zIndex: 10,
                padding: '10px',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 20px 8px 10px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: '#0c68e9',
                    color: '#fff',
                  },
                }}
                onClick={handleProfileClick}
              >
                <PersonIcon sx={{ marginRight: '10px' }} />
                Profile
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 20px 8px 10px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: '#0c68e9',
                    color: '#fff',
                  },
                }}
                onClick={handleCartClick}
              >
                <ShoppingCartIcon sx={{ marginRight: '10px' }} />
                Cart
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 20px 8px 10px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: '#0c68e9',
                    color: '#fff',
                  },
                }}
                onClick={handleOrderClick}
              >
                <AssignmentIcon sx={{ marginRight: '10px' }} />
                Order
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '8px 20px 8px 10px',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  '&:hover': {
                    backgroundColor: '#0c68e9',
                    color: '#fff',
                  },
                }}
                onClick={handleHelpClick}
              >
                <HelpOutlineIcon sx={{ marginRight: '10px' }} />
                Help
              </Box>
              {currentUser && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '8px 20px 8px 10px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: '#0c68e9',
                      color: '#fff',
                    },
                  }}
                  onClick={handleLogout}
                >
                  <ExitToAppIcon sx={{ marginRight: '10px' }} />
                  Logout
                </Box>
              )}
            </Box>
          )}
          {!currentUser && (
            <Button color="inherit" onClick={handleLogin}>
              Login
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default HeaderBar
