import React from 'react'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import { useNavigate, useLocation } from 'react-router-dom'
import { Tooltip } from 'react-tippy'
import 'react-tippy/dist/tippy.css'
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import DynamicFeedOutlinedIcon from '@mui/icons-material/DynamicFeedOutlined'
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined'
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined'
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined'
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined'

const menuItems = [
  {
    items: [
      { text: 'Dashboard', icon: <SpaceDashboardOutlinedIcon fontSize="small" />, path: '/' },
      { text: 'Cart', icon: <ShoppingCartOutlinedIcon fontSize="small" />, path: '/cart' },
      { text: 'Post', icon: <DynamicFeedOutlinedIcon fontSize="small" />, path: '/post' },
      { text: 'Friend', icon: <GroupAddOutlinedIcon fontSize="small" />, path: '/friend' },
      { text: 'Chat', icon: <ChatOutlinedIcon fontSize="small" />, path: '/chat' },
      { text: 'Product', icon: <CategoryOutlinedIcon fontSize="small" />, path: '/my-product' },
      { text: 'Order', icon: <ListAltOutlinedIcon fontSize="small" />, path: '/order' },
      { text: 'Settings', icon: <SettingsOutlinedIcon fontSize="small" />, path: '/setting/user-profile' },
    ],
  },
]

const SidebarIconsOnly = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const handleClick = (path) => {
    navigate(path)
  }

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    navigate('/login')
  }

  return (
    <Drawer
      variant="permanent"
      sx={{
        ['& .MuiDrawer-paper']: {
          boxSizing: 'border-box',
          backgroundColor: (theme) => theme.palette.backgroundColor.secondary,
        },
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          width: '100%',
          height: '50px',
          display: 'flex',
          boxSizing: 'border-box',
          padding: '10px 0',
          justifyContent: 'center',
        }}
      >
        <img src="https://i.ibb.co/WPxtV73/logo.png" alt="logo" style={{ objectFit: 'cover', height: '80%' }} />
      </Box>
      <Divider />
      <List
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
          boxSizing: 'border-box',
          padding: '10px 0',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {menuItems[0].items.map((item, index) => (
            <ListItem
              button
              onClick={() => handleClick(item.path)}
              sx={{
                padding: '4px 16px',
                '&:hover': {
                  backgroundColor: (theme) => theme.other.primaryColor,
                },
                backgroundColor:
                  location.pathname === item.path ? (theme) => theme.palette.hoverColor.primary : 'inherit',
                borderRadius: '10px',
                justifyContent: 'center',
              }}
              key={index}
            >
              <ListItemIcon
                sx={{
                  minWidth: 'auto',
                  color: location.pathname === item.path ? (theme) => theme.palette.textColor.primary : 'inherit',
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Tooltip title={item.text} position="right" animation="none" duration={0}>
                    {item.icon}
                  </Tooltip>
                </Box>
              </ListItemIcon>
            </ListItem>
          ))}
        </Box>
        <Box>
          <Divider />
          <ListItem
            button
            onClick={handleLogout}
            sx={{
              padding: '4px 16px',
              borderRadius: '10px',
              '&:hover': {
                backgroundColor: (theme) => theme.other.primaryColor,
              },
              justifyContent: 'center',
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 'auto',
                color: 'inherit',
              }}
            >
              <Tooltip title="Logout" position="right" animation="none" duration={0}>
                <ExitToAppOutlinedIcon fontSize="small" />
              </Tooltip>
            </ListItemIcon>
          </ListItem>
        </Box>
      </List>
    </Drawer>
  )
}

export default SidebarIconsOnly
