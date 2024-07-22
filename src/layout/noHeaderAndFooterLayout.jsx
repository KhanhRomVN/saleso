import Box from '@mui/material/Box'
import SidebarIconsOnly from '~/components/SideBar/SidebarIconsOnly'

const NoHeaderAndFooterLayout = ({ children }) => {
  return (
    <Box
      sx={{
        backgroundColor: (theme) => theme.palette.backgroundColor.primary,
        paddingLeft: '44px',
        boxSizing: 'border-box',
        margin: '0px',
        height: '100%',
      }}
    >
      <SidebarIconsOnly />
      <Box sx={{ boxSizing: 'border-box', paddingLeft: '10px' }}>{children}</Box>
    </Box>
  )
}

export default NoHeaderAndFooterLayout
