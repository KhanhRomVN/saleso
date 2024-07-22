// AdminSidebar.js
import React from 'react'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Divider from '@mui/material/Divider'

import { useNavigate } from 'react-router-dom'
import { Tooltip } from 'react-tippy'

import 'react-tippy/dist/tippy.css'
import PeopleOutlineIcon from '@mui/icons-material/PeopleOutline'
import PostAddOutlinedIcon from '@mui/icons-material/PostAddOutlined'
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined'
import GroupOutlinedIcon from '@mui/icons-material/GroupOutlined'
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined'

const adminMenuItems = [
  {
    items: [
      { text: 'User Management', icon: <PeopleOutlineIcon fontSize="small" />, path: '/admin/user-management' },
      { text: 'Post Management', icon: <PostAddOutlinedIcon fontSize="small" />, path: '/admin/post-management' },
      {
        text: 'Product Management',
        icon: <CategoryOutlinedIcon fontSize="small" />,
        path: '/admin/product-management',
      },
      { text: 'Member Management', icon: <GroupOutlinedIcon fontSize="small" />, path: '/admin/member-management' },
      {
        text: 'Database Management',
        icon: <StorageOutlinedIcon fontSize="small" />,
        path: '/admin/database-management',
      },
    ],
  },
]

const AdminSidebar = ({ collapsed, handleToggleSidebar }) => {
  const navigate = useNavigate()

  return (
    <Drawer
      variant="permanent"
      sx={{
        ['& .MuiDrawer-paper']: {
          boxSizing: 'border-box',
          width: collapsed ? (theme) => theme.other.minSideBarWidth : (theme) => theme.other.maxSideBarWidth,
        },
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '60px',
          display: 'flex',
          boxSizing: 'border-box',
          padding: '10px 10px 10px 12px',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <img src="https://i.postimg.cc/jd0dTYF1/logo.png" alt="logo" style={{ objectFit: 'cover', height: '78%' }} />
          <Typography sx={{ fontSize: '20px', fontWeight: '600', marginTop: '6px' }}>Saleso</Typography>
        </Box>
      </Box>
      <Divider />
      <List
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          gap: '30px',
          position: 'relative',
        }}
      >
        {adminMenuItems.map((section, index) => (
          <div key={index}>
            {section.items.map((item, itemIndex) => (
              <>
                <Tooltip title={collapsed ? item.text : ''} position="right" key={itemIndex} arrow={true} theme="light">
                  <ListItem
                    button
                    onClick={() => navigate(item.path)}
                    sx={{
                      padding: collapsed ? '4px 16px' : '4px 84px 4px 16px',
                      '&:hover': {
                        backgroundColor: (theme) => theme.other.primaryColor,
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 'auto',
                        marginRight: collapsed ? '0' : '8px',
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {item.icon}
                      </Box>
                    </ListItemIcon>
                    {!collapsed && (
                      <ListItemText primary={item.text} primaryTypographyProps={{ fontSize: '0.85rem' }} />
                    )}
                  </ListItem>
                </Tooltip>
              </>
            ))}
          </div>
        ))}
      </List>
    </Drawer>
  )
}

export default AdminSidebar
