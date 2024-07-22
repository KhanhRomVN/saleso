import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import IconButton from '@mui/material/IconButton'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import ClearIcon from '@mui/icons-material/Clear'
import { handleFriendAction } from './FriendActions'

export const renderFriendListItem = (friends) => (
  <List>
    {friends.length > 0 ? (
      friends.map((friend) => (
        <ListItem key={friend.user_id} disablePadding>
          <ListItemAvatar>
            <Avatar>{friend.username[0]}</Avatar>
          </ListItemAvatar>
          <ListItemText primary={friend.username} />
          <IconButton onClick={() => handleFriendAction('remove', friend.user_id)} aria-label="remove">
            <ClearIcon />
          </IconButton>
        </ListItem>
      ))
    ) : (
      <Typography>No friends found.</Typography>
    )}
  </List>
)

export const renderBlockedListItem = (blockedUsers) => (
  <List>
    {blockedUsers.length > 0 ? (
      blockedUsers.map((blockedUser) => (
        <ListItem key={blockedUser.user_id} disablePadding>
          <ListItemAvatar>
            <Avatar>{blockedUser.username[0]}</Avatar>
          </ListItemAvatar>
          <ListItemText primary={blockedUser.username} />
          <IconButton onClick={() => handleFriendAction('unblock', blockedUser.user_id)} aria-label="unblock">
            <ClearIcon />
          </IconButton>
        </ListItem>
      ))
    ) : (
      <Typography>No blocked users found.</Typography>
    )}
  </List>
)

export const renderRequestListItem = (friendRequests) => (
  <List>
    {friendRequests.length > 0 ? (
      friendRequests.map((request) => (
        <ListItem key={request.user_id} disablePadding>
          <ListItemAvatar>
            <Avatar>{request.username[0]}</Avatar>
          </ListItemAvatar>
          <ListItemText primary={request.username} />
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleFriendAction('accept', request.user_id)}
            sx={{ backgroundColor: '#e15a15', color: '#fff', '&:hover': { backgroundColor: '#d84315' } }}
          >
            Accept
          </Button>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => handleFriendAction('refuse', request.user_id)}
            sx={{ backgroundColor: '#f50057', color: '#fff', '&:hover': { backgroundColor: '#c51162' } }}
          >
            Refuse
          </Button>
        </ListItem>
      ))
    ) : (
      <Typography>No friend requests found.</Typography>
    )}
  </List>
)
