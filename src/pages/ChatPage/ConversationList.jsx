import React, { useState, useEffect } from 'react'
import {
  TextField,
  Box,
  Typography,
  Avatar,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  InputBase,
  Checkbox,
  FormControlLabel,
} from '@mui/material'
import axios from 'axios'
import { BACKEND_URI } from '~/API'

const ConversationList = ({
  friendList,
  groupList,
  handlerClickFriend,
  handlerClickGroup,
  searchTerm,
  setSearchTerm,
  accessToken,
}) => {
  const [selectedTab, setSelectedTab] = useState(0)
  const [openDialog, setOpenDialog] = useState(false)
  const [dialogFriendList, setDialogFriendList] = useState([])
  const [groupName, setGroupName] = useState('')
  const [selectedFriends, setSelectedFriends] = useState([])

  const handleTabChange = (newValue) => {
    setSelectedTab(newValue)
  }

  //! Get List Friend For Create Group
  const fetchFriendList = async () => {
    try {
      const response = await axios.post(`${BACKEND_URI}/user/get-list-friend`, {}, { headers: { accessToken } })
      setDialogFriendList(response.data)
    } catch (error) {
      console.error('Error fetching friend list:', error)
    }
  }

  const handleOpenDialog = () => {
    fetchFriendList()
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
  }

  const handleCheckboxChange = (friendId) => {
    setSelectedFriends((prevSelectedFriends) => {
      if (prevSelectedFriends.includes(friendId)) {
        return prevSelectedFriends.filter((id) => id !== friendId)
      } else {
        return [...prevSelectedFriends, friendId]
      }
    })
  }

  const handleCreateGroup = async () => {
    try {
      await axios.post(
        `${BACKEND_URI}/chat/create-group`,
        {
          groupName,
          listUserId: selectedFriends,
        },
        { headers: { accessToken } },
      )
      setOpenDialog(false)
      setGroupName('')
      setSelectedFriends([])
    } catch (error) {
      console.error('Error creating group:', error)
    }
  }

  return (
    <Box
      sx={{
        display: 'flex',
        height: '100%',
        flexDirection: 'column',
        boxSizing: 'border-box',
        padding: '10px 0 10px 10px',
        backgroundColor: (theme) => theme.palette.backgroundColor.secondary,
        gap: '10px',
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          boxSizing: 'border-box',
          backgroundColor: (theme) => theme.palette.backgroundColor.primary,
          borderRadius: '10px',
        }}
      >
        <TextField
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search friends..."
          sx={{
            flexGrow: 1,
            '& .MuiOutlinedInput-root': {
              height: '44px',
              '& input': {
                padding: '10px 14px',
              },
              '& fieldset': {
                borderColor: 'transparent',
              },
              '&:hover fieldset': {
                borderColor: 'transparent',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'transparent',
              },
            },
          }}
        />
      </Box>
      <Box sx={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <Button
          variant={selectedTab === 0 ? 'contained' : 'outlined'}
          onClick={() => handleTabChange(0)}
          sx={{
            flexGrow: 1,
            color: selectedTab === 0 ? '#fff' : '#fba94b',
            borderColor: selectedTab === 0 ? '#fba94b' : '#fff',
            backgroundColor: selectedTab === 0 ? '#fba94b' : 'transparent',
            '&:hover': {
              border: '1px solid #fff',
              backgroundColor: selectedTab === 0 ? '#fba94b' : '#fba94b26',
            },
          }}
        >
          Friend
        </Button>
        <Button
          variant={selectedTab === 1 ? 'contained' : 'outlined'}
          onClick={() => handleTabChange(1)}
          sx={{
            flexGrow: 1,
            color: selectedTab === 1 ? '#fff' : '#31ae60',
            borderColor: selectedTab === 1 ? '#31ae60' : '#fff',
            backgroundColor: selectedTab === 1 ? '#31ae60' : 'transparent',
            '&:hover': {
              border: '1px solid #fff',
              backgroundColor: selectedTab === 1 ? '#31ae60' : '#31ae6026',
            },
          }}
        >
          Group
        </Button>
      </Box>
      {/* //! List Friend */}
      {selectedTab === 0 && (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            boxSizing: 'border-box',
            borderRadius: '10px',
            backgroundColor: (theme) => theme.palette.backgroundColor.primary,
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', boxSizing: 'border-box', padding: '10px' }}>
            {friendList.map((friend) => (
              <React.Fragment key={friend.user_id}>
                <Box
                  onClick={() => handlerClickFriend(friend.user_id, friend.username, friend.avatar)}
                  sx={{
                    boxSizing: 'border-box',
                    padding: '4px',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    gap: '10px',
                    alignItems: 'center',
                    '&:hover': {
                      backgroundColor: (theme) => theme.other.primaryColor,
                      color: '#fff',
                      '& .MuiTypography-root': {
                        color: '#fff',
                      },
                    },
                  }}
                >
                  <Avatar src={friend.avatar} sx={{ width: '34px', height: '34px', borderRadius: '10px' }} />
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography sx={{ fontSize: '16px' }}>{friend.username}</Typography>
                    <Typography sx={{ fontSize: '14px' }}>{friend.lastMessage}</Typography>
                  </Box>
                </Box>
                <Divider />
              </React.Fragment>
            ))}
          </Box>
        </Box>
      )}
      {/* //! List Group */}
      {selectedTab === 1 && (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            backgroundColor: (theme) => theme.palette.backgroundColor.primary,
            boxSizing: 'border-box',
          }}
        >
          {groupList.length === 0 ? (
            <Box sx={{ textAlign: 'center', marginTop: '20px' }}>
              <Button variant="contained" color="primary" sx={{ marginRight: '10px' }} onClick={handleOpenDialog}>
                Create New Group
              </Button>
              <Button variant="outlined" color="primary">
                Join Group
              </Button>
            </Box>
          ) : (
            <Box
              sx={{ display: 'flex', flexDirection: 'column', gap: '10px', boxSizing: 'border-box', padding: '10px' }}
            >
              {groupList.map((group) => (
                <React.Fragment key={group._id}>
                  <Box
                    onClick={() => handlerClickGroup(group._id, group.group_name, group.group_avatar)}
                    sx={{
                      boxSizing: 'border-box',
                      padding: '4px',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      display: 'flex',
                      gap: '10px',
                      alignItems: 'center',
                      '&:hover': {
                        backgroundColor: (theme) => theme.other.primaryColor,
                        color: '#fff',
                        '& .MuiTypography-root': {
                          color: '#fff',
                        },
                      },
                    }}
                  >
                    <Avatar src={group.group_avatar} sx={{ width: '34px', height: '34px', borderRadius: '10px' }} />
                    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                      <Typography sx={{ fontSize: '16px' }}>{group.group_name}</Typography>
                      <Typography sx={{ fontSize: '16px' }}>{group.last_message}</Typography>
                    </Box>
                  </Box>
                  <Divider />
                </React.Fragment>
              ))}
            </Box>
          )}
        </Box>
      )}
      {/* //* Create Group */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Create New Group</DialogTitle>
        <DialogContent>
          <TextField
            label="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            fullWidth
            margin="normal"
          />
          <Box>
            {dialogFriendList.map((friend) => (
              <FormControlLabel
                key={friend.user_id}
                control={
                  <Checkbox
                    checked={selectedFriends.includes(friend.user_id)}
                    onChange={() => handleCheckboxChange(friend.user_id)}
                  />
                }
                label={friend.username}
              />
            ))}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleCreateGroup} color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default ConversationList
