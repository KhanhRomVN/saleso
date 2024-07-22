import React, { useState } from 'react'
import Box from '@mui/material/Box'
import HeaderBar from '~/components/HeaderBar/HeaderBar'
import Sidebar from '~/components/SideBar/SideBar'
import Footer from '~/components/Footer/Footer'
import { Divider } from '@mui/material'

const DefaultLayout = ({ children }) => {
  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: (theme) => theme.palette.backgroundColor.primary,
        boxSizing: 'border-box',
        paddingTop: (theme) => theme.other.headerBarHeight,
      }}
    >
      <HeaderBar />
      <Box
        sx={{ boxSizing: 'border-box', paddingTop: '10px', width: '100%', display: 'flex', justifyContent: 'center' }}
      >
        {children}
      </Box>
      <Footer />
    </Box>
  )
}

export default DefaultLayout
