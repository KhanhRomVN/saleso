import React, { useState, useEffect } from 'react'
import { ConfigProvider, theme } from 'antd'
import Box from '@mui/material/Box'
import HeaderBar from '~/components/HeaderBar/HeaderBar'
import Footer from '~/components/Footer/Footer'
import { Divider } from '@mui/material'

const DefaultLayout = ({ children }) => {
  const [themeMode, setThemeMode] = useState('light')

  useEffect(() => {
    const muiMode = localStorage.getItem('mui-mode')
    setThemeMode(muiMode === 'dark' ? 'dark' : 'light')
  }, [])

  return (
    <ConfigProvider
      theme={{
        algorithm: themeMode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
        token: {
          colorPrimary: '#0c68e9',
          colorError: '#ff4d4f',
          borderRadius: 8,
        },
      }}
    >
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
    </ConfigProvider>
  )
}

export default DefaultLayout
