import { useState, useEffect, useRef } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Avatar, Modal } from '@mui/material'

const ChatWindow = ({ userFriendName, messages, user_id, userAvatar, groupName, groupAvatar }) => {
  console.log(groupAvatar)
  const [open, setOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState('')
  const endOfMessagesRef = useRef(null)

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const formatTime = (isoString) => {
    const date = new Date(isoString)
    const hours = date.getHours().toString().padStart(2, '0')
    const minutes = date.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  }

  const handleOpen = (image) => {
    setSelectedImage(image)
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setSelectedImage('')
  }

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100%',
        flexDirection: 'column',
        boxSizing: 'border-box',
        gap: '10px',
      }}
    >
      {/* Header ChatWindow */}
      <Box
        sx={{
          width: '100%',
          height: '58px',
          boxSizing: 'border-box',
          padding: '0 16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: (theme) => theme.palette.backgroundColor.primary,
          borderRadius: '10px',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {userAvatar && <Avatar src={userAvatar} sx={{ width: '34px', height: '34px', borderRadius: '10px' }} />}
          {groupAvatar && <Avatar src={groupAvatar} sx={{ width: '34px', height: '34px', borderRadius: '10px' }} />}
          {!userAvatar && !groupAvatar && <Avatar sx={{ width: '34px', height: '34px', borderRadius: '10px' }} />}
          <Typography>{userFriendName}</Typography>
          <Typography>{groupName}</Typography>
        </Box>
      </Box>
      {/* Content ChatWindow */}
      <Box
        sx={{
          width: '100%',
          height: '480px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          boxSizing: 'border-box',
          padding: '10px',
          overflowY: 'auto',
          backgroundColor: (theme) => theme.palette.backgroundColor.primary,
          borderRadius: '10px',
        }}
      >
        {messages.map((message, idx) => (
          <Box
            key={idx}
            sx={{
              display: 'flex',
              justifyContent: message.sender_id === user_id ? 'flex-end' : 'flex-start',
            }}
          >
            {message.sender_id !== user_id && <Avatar />}
            <Box>
              {/* Both Message And Image */}
              {message.message && message.image && (
                <Box>
                  {/* Message */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    <Typography
                      sx={{
                        backgroundColor: (theme) => theme.palette.backgroundColor.secondary,
                        color: '#fff',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        alignSelf: message.sender_id === user_id ? 'flex-end' : 'flex-start',
                        marginBottom: message.image ? '4px' : '0', // Add margin only if there is an image
                      }}
                    >
                      {message.message}
                    </Typography>
                  </Box>
                  {/* Image */}
                  <Box sx={{ maxWidth: '300px' }}>
                    <img
                      src={message.image}
                      onClick={() => handleOpen(message.image)}
                      style={{
                        objectFit: 'cover',
                        width: '100%',
                        height: '80%',
                        alignSelf: message.sender_id === user_id ? 'flex-end' : 'flex-start',
                        backgroundColor: (theme) => theme.palette.backgroundColor.secondary,
                        color: '#fff',
                        padding: '4px 8px',
                        borderRadius: '10px',
                        cursor: 'pointer',
                      }}
                    />
                    <Typography sx={{ fontSize: '9px', marginLeft: '4px', color: (theme) => theme.other.grayColor }}>
                      {formatTime(message.create_at)}
                    </Typography>
                  </Box>
                </Box>
              )}
              {/* Only Message */}
              {message.message && !message.image && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                  <Typography
                    sx={{
                      backgroundColor: (theme) => theme.palette.backgroundColor.secondary,
                      color: '#fff',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      alignSelf: message.sender_id === user_id ? 'flex-end' : 'flex-start',
                      marginBottom: message.image ? '4px' : '0', // Add margin only if there is an image
                    }}
                  >
                    {message.message}
                  </Typography>
                  <Typography sx={{ fontSize: '9px', marginLeft: '4px', color: (theme) => theme.other.grayColor }}>
                    {formatTime(message.create_at)}
                  </Typography>
                </Box>
              )}
              {/* Only Image */}
              {!message.message && message.image && (
                <Box sx={{ maxWidth: '300px' }}>
                  <img
                    src={message.image}
                    onClick={() => handleOpen(message.image)}
                    style={{
                      objectFit: 'cover',
                      width: '100%',
                      height: '80%',
                      alignSelf: message.sender_id === user_id ? 'flex-end' : 'flex-start',
                      backgroundColor: (theme) => theme.palette.backgroundColor.secondary,
                      color: '#fff',
                      padding: '4px 8px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                    }}
                  />
                  <Typography sx={{ fontSize: '9px', marginLeft: '4px', color: (theme) => theme.other.grayColor }}>
                    {formatTime(message.create_at)}
                  </Typography>
                </Box>
              )}
            </Box>
          </Box>
        ))}

        <div ref={endOfMessagesRef} />
      </Box>

      {/* Modal for enlarged image */}
      <Modal
        open={open}
        onClose={handleClose}
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            outline: 'none',
            maxWidth: '90%',
            maxHeight: '90%',
          }}
        >
          <img
            src={selectedImage}
            alt="Enlarged"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </Box>
      </Modal>
    </Box>
  )
}

export default ChatWindow
