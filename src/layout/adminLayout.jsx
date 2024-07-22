import Box from '@mui/material/Box'
import AdminSidebar from '~/pages/AdminPage/AdminSidebar'

const AdminLayout = ({ children }) => {
  return (
    <Box
      sx={{
        backgroundColor: (theme) => theme.palette.backgroundColor.secondary,
        boxSizing: 'border-box',
        paddingLeft: (theme) => theme.other.maxSideBarWidth,
        transition: 'padding-left 0.3s ease',
      }}
    >
      <AdminSidebar />
      {children}
    </Box>
  )
}

export default AdminLayout
