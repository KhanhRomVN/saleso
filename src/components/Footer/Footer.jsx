import React from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Link from '@mui/material/Link'
import useTheme from '@mui/material/styles/useTheme'
import useMediaQuery from '@mui/material/useMediaQuery'

const Footer = () => {
  const theme = useTheme()
  const isSmallDevice = useMediaQuery(theme.breakpoints.down('sm'))
  const textAlign = isSmallDevice ? 'left' : 'center' // Align left on small devices, center on others

  return (
    <Box
      sx={{
        padding: '60px 0',
        backgroundColor: (theme) => theme.palette.background.secondary,
        textAlign: textAlign,
        marginTop: 'auto',
      }}
    >
      <Typography variant="body2" sx={{ marginBottom: '6px' }}>
        Contact for work, copyright and more:
      </Typography>
      <Typography variant="body2" sx={{ marginBottom: '30px' }}>
        <Link href="mailto:khanhromvn@gmail.com">khanhromvn@gmail.com</Link>
      </Typography>
      <Typography variant="body2" sx={{ marginBottom: '8px' }}>
        <Link href="/terms-of-service" sx={{ marginRight: '16px' }}>
          Terms of service
        </Link>
      </Typography>
      <Typography variant="body2" sx={{ marginBottom: '34px' }}>
        <Link href="/privacy-policy">Privacy Policy</Link>
      </Typography>
      <Typography variant="body2">
        © 2024 - <Link href="https://saleso.vercel.app">saleso.vercel.app</Link>
      </Typography>
    </Box>
  )
}

export default Footer
