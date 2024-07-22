import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ProductLayout from '../ProductLayout/ProductLayout_5-2'

// Function to transform product type names
const transformTypeName = (name) => {
  return name.toLowerCase().replace(/ & /g, '_').replace(/ /g, '_')
}

const transformTypeNameArray = (product_types) => {
  const arrayAfterTransform = []

  for (let i = 0; i < product_types.length; i++) {
    const transformedName = transformTypeName(product_types[i])
    arrayAfterTransform.push(transformedName)
  }

  return arrayAfterTransform
}

const TabUI = ({ product_types }) => {
  const [selectedTab, setSelectedTab] = useState(0)
  const arrayAfterTransform = transformTypeNameArray(product_types)

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue)
  }

  return (
    <Box
      sx={{
        width: '100%',
        backgroundColor: 'white',
        display: 'flex',
        justifyContent: 'center',
        flexDirection: 'column',
        paddingTop: '16px',
      }}
    >
      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
        {product_types.map((type, index) => (
          <Button
            key={index}
            variant={selectedTab === index ? 'contained' : 'outlined'}
            onClick={() => setSelectedTab(index)}
            sx={{
              color: (theme) => theme.palette.backgroundColor.primary,
              backgroundColor: (theme) => theme.other.primaryColor,
              '&:hover': {
                color: (theme) => theme.other.primaryColor,
                backgroundColor: (theme) => theme.palette.backgroundColor.primary,
              },
            }}
          >
            {type}
          </Button>
        ))}
      </Box>
      <Box sx={{ p: 3, width: '100%' }}>
        <ProductLayout type={arrayAfterTransform[selectedTab]} />
      </Box>
    </Box>
  )
}

export default TabUI
