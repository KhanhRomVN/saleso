import React from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import SendIcon from '@mui/icons-material/Send'
import IconButton from '@mui/material/IconButton'
import AttachFileIcon from '@mui/icons-material/AttachFile'
import InsertPhotoIcon from '@mui/icons-material/InsertPhoto'
import { v4 as uuidv4 } from 'uuid'
import { uploadBytes, ref, getDownloadURL } from 'firebase/storage'
import { imageDB } from '~/firebase/firebaseConfig'

const MessageInput = ({ input, setInput, image, setImage, handleSendMessage }) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const handleSendImage = async () => {
    try {
      const fileInput = document.createElement('input')
      fileInput.type = 'file'
      fileInput.accept = 'image/*'
      fileInput.onchange = async (e) => {
        const file = e.target.files[0]
        if (!file) return

        const storageRef = ref(imageDB, `${uuidv4()}_${file.name}`)
        await uploadBytes(storageRef, file)
        const imageUrl = await getDownloadURL(storageRef)
        setImage(imageUrl)
        console.log('Sending image with URL:', imageUrl)
      }
      fileInput.click()
    } catch (error) {
      console.error('Error uploading image:', error)
    }
  }

  const handleSendFile = () => {
    // Handle sending file logic here
    console.log('Sending file...')
  }

  return (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <IconButton onClick={handleSendImage} sx={{ color: (theme) => theme.palette.textColor.primary }}>
        <InsertPhotoIcon />
      </IconButton>
      <IconButton onClick={handleSendFile} sx={{ color: (theme) => theme.palette.textColor.primary }}>
        <AttachFileIcon />
      </IconButton>
      <TextField
        fullWidth
        variant="outlined"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type a message..."
        onKeyPress={handleKeyPress}
        sx={{
          marginRight: '10px',
          '& .MuiOutlinedInput-root': {
            height: '40px',
            '& input': {
              padding: '8px 14px',
            },
          },
        }}
      />
      <Button
        variant="contained"
        onClick={handleSendMessage}
        sx={{
          backgroundColor: (theme) => theme.other.primaryColor,
          color: (theme) => theme.palette.textColor.primary,
          height: '38px',
        }}
      >
        <SendIcon />
      </Button>
    </Box>
  )
}

export default MessageInput
