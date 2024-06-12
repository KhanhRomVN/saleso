import React, { useState } from 'react'
import AppBar from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import { alpha, styled } from '@mui/material/styles'
import Avatar from '@mui/material/Avatar'
import SearchIcon from '@mui/icons-material/Search'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import { AddBoxRounded } from '@mui/icons-material'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'

const TabPanel = (props) => {
  const { children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  )
}

const TransparentAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: 'transparent',
  boxShadow: 'none',
  backdropFilter: 'blur(10px)',
}))

const HeaderBar = () => {
  return (
    <TransparentAppBar position="fixed">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', boxSizing: 'border-box', padding: '0 20px' }}>
        <Box
          sx={{ display: 'flex', alignItems: 'center', color: (theme) => theme.palette.textColor.primary, gap: '10px' }}
        >
          <Typography variant="h7" component="div" sx={{ flexGrow: 1 }}>
            Logo
          </Typography>
          <Typography variant="h7" component="div">
            Home
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', color: (theme) => theme.palette.textColor.primary }}>
          <IconButton color="inherit">
            <SearchIcon />
          </IconButton>
          <IconButton color="inherit">
            <ShoppingCartIcon />
          </IconButton>
          <IconButton color="inherit">
            <Avatar />
          </IconButton>
        </Box>
      </Box>
    </TransparentAppBar>
  )
}

const BackgroundAndAvatar = () => {
  const user = JSON.parse(localStorage.getItem('user')) || {}
  return (
    <Box
      sx={{
        width: '100%',
        height: '350px',
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)', // Đổi gradient color ở đây
        position: 'relative',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          bottom: '20px',
          left: '20px',
          display: 'flex',
          alignItems: 'end',
          gap: '10px',
          // width: '120px',
          // height: '120px',
        }}
      >
        <Avatar
          alt="Avatar"
          src="/static/images/avatar/1.jpg"
          sx={{
            // position: 'absolute',
            // bottom: '20px',
            // left: '20px',
            width: '90px',
            height: '90px',
          }}
        />
        <Typography variant="h5" component="div">
          {user.username}
        </Typography>
      </Box>
    </Box>
  )
}

const ProfilePage = () => {
  const user = JSON.parse(localStorage.getItem('user')) || {}
  const [value, setValue] = useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <>
      <HeaderBar />
      <BackgroundAndAvatar />
      <Box sx={{ display: 'flex', width: '100%' }}>
        {/* Thành phần bên trái */}
        <Box sx={{ width: '70%' }}>
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Carts" />
            <Tab label="My Products" />
            <Tab label="Posts" />
          </Tabs>
          <TabPanel value={value} index={0}>
            Item One Content
          </TabPanel>
          <TabPanel value={value} index={1}>
            Item Two Content
          </TabPanel>
          <TabPanel value={value} index={2}>
            Item Three Content
          </TabPanel>
        </Box>

        {/* Thành phần bên phải */}
        <Box sx={{ width: '30%', paddingLeft: '20px' }}>
          <div>
            <h2>User Information</h2>
            <p>Username: {user.username}</p>
            <p>Email: {user.email}</p>
            {/* Thêm các thông tin người dùng khác nếu cần */}
          </div>
        </Box>
      </Box>
    </>
  )
}

export default ProfilePage