import React from 'react'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'
import Collapse from '@mui/material/Collapse'
import { useNavigate, useLocation } from 'react-router-dom'
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'
import DynamicFeedOutlinedIcon from '@mui/icons-material/DynamicFeedOutlined'
import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined'
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined'
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined'
import GroupAddOutlinedIcon from '@mui/icons-material/GroupAddOutlined'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import ExitToAppOutlinedIcon from '@mui/icons-material/ExitToAppOutlined'
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined'
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'

const drawerWidth = 240 // Define the drawerWidth constant

const menuItems = [
  {
    items: [
      { text: 'Dashboard', icon: <SpaceDashboardOutlinedIcon fontSize="small" />, path: '/' },
      { text: 'Cart', icon: <ShoppingCartOutlinedIcon fontSize="small" />, path: '/cart' },
      { text: 'Post', icon: <DynamicFeedOutlinedIcon fontSize="small" />, path: '/post' },
      { text: 'Friend', icon: <GroupAddOutlinedIcon fontSize="small" />, path: '/friend' },
      { text: 'Message', icon: <ChatOutlinedIcon fontSize="small" />, path: '/chat' },
      { text: 'Product', icon: <CategoryOutlinedIcon fontSize="small" />, path: '/my-product' },
      { text: 'Order', icon: <ListAltOutlinedIcon fontSize="small" />, path: '/order' },
      {
        text: 'Settings',
        icon: <SettingsOutlinedIcon fontSize="small" />,
        subItems: [
          { text: 'User Profile', path: '/setting/user-profile' },
          { text: 'Social Media', path: '/setting/social-media' },
          { text: 'Notifications', path: '/setting/notifications' },
          { text: 'Others', path: '/setting/others' },
        ],
      },
    ],
  },
]

const Sidebar = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [openSettings, setOpenSettings] = React.useState(false)

  const handleSettingsClick = () => {
    setOpenSettings(!openSettings)
  }

  const handleClick = (path) => {
    navigate(path)
  }

  const handleLogout = () => {
    localStorage.removeItem('currentUser')
    navigate('/login')
  }

  return (
    <Box
      sx={{
        boxSizing: 'border-box',
        backgroundColor: (theme) => theme.palette.backgroundColor.secondary,
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        top: (theme) => theme.other.headerBarHeight,
        bottom: '0',
        left: '0',
        zIndex: '999',
      }}
    >
      <List
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          height: '100%',
          position: 'relative',
          boxSizing: 'border-box',
          padding: '10px',
        }}
      >
        {/* //* Dashboard, Cart, Post, Friend, Message, Product, Order, Setting */}
        <Box>
          {menuItems[0].items.map((item, index) => (
            <div key={index}>
              {item.subItems ? (
                <>
                  <ListItem
                    button
                    onClick={handleSettingsClick}
                    sx={{
                      padding: '4px 16px',
                      borderRadius: '10px',
                      '&:hover': {
                        backgroundColor: (theme) => theme.other.primaryColor,
                      },
                      backgroundColor: location.pathname.startsWith('/setting')
                        ? (theme) => theme.palette.hoverColor.primary
                        : 'inherit',
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 'auto',
                        marginRight: '8px',
                        color: location.pathname.startsWith('/setting')
                          ? (theme) => theme.palette.textColor.primary
                          : 'inherit',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary="Settings"
                      primaryTypographyProps={{
                        paddingRight: '5rem',
                        fontSize: '0.85rem',
                        color: location.pathname.startsWith('/setting')
                          ? (theme) => theme.palette.textColor.primary
                          : 'inherit',
                      }}
                    />
                    {openSettings ? <ExpandLess /> : <ExpandMore />}
                  </ListItem>
                  <Collapse in={openSettings} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {item.subItems.map((subItem, subIndex) => (
                        <ListItem
                          button
                          onClick={() => handleClick(subItem.path)}
                          sx={{
                            padding: '4px 36px',
                            '&:hover': {
                              backgroundColor: (theme) => theme.other.primaryColor,
                            },
                            backgroundColor:
                              location.pathname === subItem.path
                                ? (theme) => theme.palette.hoverColor.primary
                                : 'inherit',
                            borderRadius: '10px',
                          }}
                          key={subIndex}
                        >
                          <ListItemText
                            primary={subItem.text}
                            primaryTypographyProps={{
                              fontSize: '0.85rem',
                              color:
                                location.pathname === subItem.path
                                  ? (theme) => theme.palette.textColor.primary
                                  : 'inherit',
                            }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                </>
              ) : (
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
                  }}
                  key={index}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 'auto',
                      marginRight: '8px',
                      color: location.pathname === item.path ? (theme) => theme.palette.textColor.primary : 'inherit',
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontSize: '0.85rem',
                      color: location.pathname === item.path ? (theme) => theme.palette.textColor.primary : 'inherit',
                    }}
                  />
                  {item.text === 'Dashboard' && (
                    <ListItemSecondaryAction>
                      <IconButton edge="end" aria-label="forward">
                        <ArrowForwardIcon sx={{ backgroundColor: 'red' }} />
                      </IconButton>
                    </ListItemSecondaryAction>
                  )}
                </ListItem>
              )}
            </div>
          ))}
        </Box>
        {/* //* Logout */}
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
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 'auto',
                marginRight: '8px',
                color: 'inherit',
              }}
            >
              <ExitToAppOutlinedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{
                fontSize: '0.85rem',
                color: 'inherit',
              }}
            />
          </ListItem>
        </Box>
      </List>
    </Box>
  )
}

export default Sidebar
