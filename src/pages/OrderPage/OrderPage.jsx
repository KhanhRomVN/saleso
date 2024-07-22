import React from 'react'
import { Box, Tabs, Tab, Typography } from '@mui/material'
import PendingOrders from './PendingOrders'
import AcceptedOrders from './AcceptedOrders'
import RefusedOrders from './RefusedOrders'

const OrderPage = () => {
  const [value, setValue] = React.useState(0)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Order Management
      </Typography>
      <Tabs value={value} onChange={handleChange} centered>
        <Tab label="Pending Orders" />
        <Tab label="Accepted Orders" />
        <Tab label="Refused Orders" />
      </Tabs>
      <TabPanel value={value} index={0}>
        <PendingOrders />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <AcceptedOrders />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <RefusedOrders />
      </TabPanel>
    </Box>
  )
}

const TabPanel = (props) => {
  const { children, value, index, ...other } = props

  return (
    <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  )
}

export default OrderPage
