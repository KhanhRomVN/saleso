import Box from '@mui/material/Box'
import HeaderBar from '~/components/HeaderBar/HeaderBar'
import Sidebar from '~/components/SideBar/SideBar'

const NoFooterLayout = ({ children }) => {
  return (
    <Box
      sx={{
        backgroundColor: (theme) => theme.palette.backgroundColor.primary,
        boxSizing: 'border-box',
        paddingTop: (theme) => theme.other.headerBarHeight,
        paddingLeft: (theme) => theme.other.sideBarWidth,
      }}
    >
      <HeaderBar />
      <Sidebar />
      <Box sx={{ boxSizing: 'border-box', padding: '10px' }}>{children}</Box>
    </Box>
  )
}

export default NoFooterLayout
