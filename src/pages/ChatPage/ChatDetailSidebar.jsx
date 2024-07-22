import React from 'react'
import { Box, Typography, Avatar, IconButton, Divider } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { v4 as uuidv4 } from 'uuid'
import { uploadBytes, ref, getDownloadURL } from 'firebase/storage'
import { imageDB } from '~/firebase/firebaseConfig'
import axios from 'axios'
import { BACKEND_URI } from '~/API'

const ChatDetailSidebar = ({
  friendData,
  groupData,
  handleCloseMediaDialog,
  handleOpenMediaDialog,
  listImage,
  accessToken,
}) => {
  const handleAvatarClick = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    const storageRef = ref(imageDB, `group_avatars/${uuidv4()}_${file.name}`)
    try {
      await uploadBytes(storageRef, file)
      const downloadURL = await getDownloadURL(storageRef)

      await axios.post(
        `${BACKEND_URI}/chat/update-group`,
        { group_id: groupData.group_id, group_avatar: downloadURL },
        { headers: { accessToken } },
      )
      console.log('Group avatar updated successfully')
    } catch (error) {
      console.error('Error uploading image:', error)
    }
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        backgroundColor: (theme) => theme.palette.backgroundColor.primary,
        borderRadius: '10px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '10px 20px 0px 20px',
        gap: '10px',
      }}
    >
      {friendData && (
        <Box sx={{ textAlign: 'center' }}>
          <Avatar src={friendData.avatar} sx={{ width: '100px', height: '100px', marginBottom: '10px' }} />
          <Typography variant="h6">{friendData.username}</Typography>
          <Typography
            sx={{
              padding: '2px',
              backgroundColor: (theme) => theme.other.greenColor,
              borderRadius: '10px',
            }}
          >
            {friendData.role}
          </Typography>
        </Box>
      )}
      {groupData && (
        <Box sx={{ textAlign: 'center' }}>
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="upload-avatar"
            type="file"
            onChange={handleAvatarClick}
          />
          {groupData.group_avatar && (
            <label htmlFor="upload-avatar">
              <Avatar
                src={groupData.group_avatar}
                sx={{ width: '100px', height: '100px', marginBottom: '10px', cursor: 'pointer' }}
              />
            </label>
          )}
          {!groupData.group_avatar && (
            <label htmlFor="upload-avatar">
              <Avatar sx={{ width: '100px', height: '100px', marginBottom: '10px', cursor: 'pointer' }} />
            </label>
          )}
          <Typography variant="h6">{groupData.group_name}</Typography>
          {/* Tạo thêm button là Add Member. */}
        </Box>
      )}
      <Divider />
      <Box sx={{ width: '100%' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography sx={{ fontSize: '18px', fontWeight: '540' }}>Media</Typography>
          <Typography
            onClick={handleOpenMediaDialog}
            sx={{ cursor: 'pointer', fontSize: '14px', color: (theme) => theme.other.primaryColor }}
          >
            View all
          </Typography>
        </Box>
        <Box sx={{ width: '100%' }}>
          {/* Display images in a grid */}
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '10px',
            }}
          >
            {listImage.slice(-4).map((image, index) => (
              <Box
                key={index}
                component="img"
                src={image}
                alt={`Image ${index + 1}`}
                sx={{
                  width: '100%',
                  height: '120px', // Customize image size here
                  objectFit: 'cover',
                  borderRadius: '10px',
                  cursor: 'pointer',
                }}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default ChatDetailSidebar
