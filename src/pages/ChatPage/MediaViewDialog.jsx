import React, { useState } from 'react'
import {
  Box,
  Typography,
  Avatar,
  IconButton,
  Divider,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Slide,
  Button,
} from '@mui/material'
import { ArrowBack, ArrowForward, Close } from '@mui/icons-material'

const MediaViewDialog = ({ isOpen, onClose, images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1))
  }

  const handlePrevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1))
  }

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth="xl" // Set max-width to extra large (xl) to ensure it can be up to 1200px wide
      TransitionComponent={Slide}
      TransitionProps={{ direction: 'up' }}
      PaperProps={{
        style: {
          width: '100vw',
          height: '100vh',
          margin: 40,
          padding: 0,
          backgroundColor: 'transparent',
        },
      }}
      BackdropProps={{
        style: {
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
        },
      }}
    >
      <DialogTitle>
        Image Viewer
        <IconButton onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8 }}>
          <Close />
        </IconButton>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <IconButton onClick={handlePrevImage}>
            <ArrowBack />
          </IconButton>
          <Box
            sx={{
              width: '100%',
              height: '100%',
              maxWidth: '1200px', // Set max-width to 1200px
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <img
              src={images[currentImageIndex]}
              alt={`Image ${currentImageIndex + 1}`}
              style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
            />
          </Box>
          <IconButton onClick={handleNextImage}>
            <ArrowForward />
          </IconButton>
        </Box>
      </DialogContent>
    </Dialog>
  )
}

export default MediaViewDialog
