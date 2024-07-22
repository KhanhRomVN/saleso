import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import ShareIcon from '@mui/icons-material/Share'
import FavoriteIcon from '@mui/icons-material/Favorite'
import Typography from '@mui/material/Typography'

const FixedBar = ({ productPrice, addToCart }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        left: '45%',
        bottom: '20px',
        backgroundColor: (theme) => theme.palette.backgroundColor.secondary,
        border: (theme) => `${theme.palette.textColor.primary} solid 1px`,
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px',
        boxSizing: 'border-box',
        zIndex: '200',
      }}
    >
      {/* Share Button */}
      <IconButton
        aria-label="share"
        sx={{
          backgroundColor: (theme) => theme.other.primaryColor,
          borderRadius: '10px',
          '&:hover': {
            backgroundColor: (theme) => theme.other.redColor,
          },
        }}
      >
        <ShareIcon sx={{ height: '14px', width: '14px', color: 'white' }} />
      </IconButton>
      {/* Favorite Button */}
      <IconButton
        aria-label="favorite"
        sx={{
          backgroundColor: (theme) => theme.other.primaryColor,
          borderRadius: '10px',
          '&:hover': {
            backgroundColor: (theme) => theme.other.yellowColor,
          },
        }}
      >
        <FavoriteIcon sx={{ height: '14px', width: '14px', color: 'white' }} />
      </IconButton>
      {/* Add To Cart Button */}
      <Button
        variant="contained"
        sx={{
          backgroundColor: (theme) => theme.other.primaryColor,
          display: 'flex',
          gap: '50px',
          borderRadius: '10px',
          padding: '4px 8px',
          '&:hover': {
            backgroundColor: (theme) => theme.other.greenColor,
          },
        }}
        onClick={addToCart}
      >
        <Typography variant="button" sx={{ color: 'white' }}>
          Add to Cart
        </Typography>
      </Button>
      {/* Buy Now Button */}
      <Button
        variant="contained"
        color="primary"
        sx={{
          backgroundColor: '#0c68e9',
          borderRadius: '10px',
          padding: '4px 6px',
          '&:hover': {
            backgroundColor: (theme) => theme.other.pinkColor,
          },
        }}
        onClick={() => {
          // Handle Buy Now action
        }}
      >
        <Typography variant="button" sx={{ color: 'white' }}>
          Buy Now
        </Typography>
      </Button>
    </Box>
  )
}

export default FixedBar
