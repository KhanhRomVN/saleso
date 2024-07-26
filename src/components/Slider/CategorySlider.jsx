import React, { useState } from 'react'
import { Box, IconButton } from '@mui/material'
import { ChevronLeft, ChevronRight } from '@mui/icons-material'

const CategorySlider = ({ listImage, slideWidth, itemsPerSlide }) => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + itemsPerSlide) % listImage.length)
  }

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - itemsPerSlide + listImage.length) % listImage.length)
  }

  return (
    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
      <Box
        sx={{
          display: 'flex',
          transition: 'transform 0.5s ease',
          transform: `translateX(-${currentIndex * (100 / itemsPerSlide)}%)`,
        }}
      >
        {listImage.map((item, index) => (
          <Box
            key={index}
            sx={{
              flexShrink: 0,
              width: slideWidth,
              padding: '0 4px',
              boxSizing: 'border-box',
            }}
          >
            <img
              src={item.imageUri}
              alt={`Slide ${index}`}
              style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
            />
          </Box>
        ))}
      </Box>
      <IconButton onClick={prevSlide} sx={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)' }}>
        <ChevronLeft />
      </IconButton>
      <IconButton
        onClick={nextSlide}
        sx={{ position: 'absolute', right: 0, top: '50%', transform: 'translateY(-50%)' }}
      >
        <ChevronRight />
      </IconButton>
    </Box>
  )
}

export default CategorySlider
