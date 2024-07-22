import { useEffect, useState } from 'react'
import CircularProgress from '@mui/material/CircularProgress'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import ButtonGroup from '@mui/material/ButtonGroup'
import Divider from '@mui/material/Divider'
import { DataGrid } from '@mui/x-data-grid'
import PersonIcon from '@mui/icons-material/Person'
import BlockIcon from '@mui/icons-material/Block'
import PersonAddIcon from '@mui/icons-material/PersonAdd'
import TabPanel from './TabPanel'
import { fetchFriendsData, handleFriendAction, fetchUserData } from './FriendActions'
import { useNavigate } from 'react-router-dom'

const FriendPage = () => {
  const navigate = useNavigate()
  const [value, setValue] = useState(0)
  const [friends, setFriends] = useState([])
  const [friendRequests, setFriendRequests] = useState([])
  const [blockedUsers, setBlockedUsers] = useState([])
  const [userData, setUserData] = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const { friends, friendRequests, blockedUsers } = await fetchFriendsData()
        console.log(friends)
        setFriends(friends)
        setFriendRequests(friendRequests)
        setBlockedUsers(blockedUsers)

        // Fetch additional user data
        const additionalUserData = {}
        for (const user of [...friends, ...friendRequests, ...blockedUsers]) {
          const data = await fetchUserData(user.username)
          additionalUserData[user.username] = data
        }
        setUserData(additionalUserData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleChange = (newValue) => {
    setValue(newValue)
  }

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress />
      </Box>
    )
  }

  const handleFriendActionClick = async (action, userId) => {
    try {
      await handleFriendAction(action, userId)
      // Reload data after action
      const { friends, friendRequests, blockedUsers } = await fetchFriendsData()
      setFriends(friends)
      setFriendRequests(friendRequests)
      setBlockedUsers(blockedUsers)
    } catch (error) {
      console.error(`Error ${action} friend:`, error)
    }
  }

  const handleIdClick = (id) => {
    navigate(`/profile/${id}`)
  }

  const handleUsernameClick = (username) => {
    navigate(`/profile/${username}`)
  }

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 100,
      renderCell: (params) => (
        <Button onClick={() => handleIdClick(params.value)} sx={{ textTransform: 'none', color: 'inherit' }}>
          {params.value}
        </Button>
      ),
    },
    {
      field: 'username',
      headerName: 'Username',
      width: 150,
      renderCell: (params) => (
        <Button onClick={() => handleUsernameClick(params.value)} sx={{ textTransform: 'none', color: 'inherit' }}>
          {params.value}
        </Button>
      ),
    },
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'email', headerName: 'Email', width: 250 },
    { field: 'address', headerName: 'Address', width: 200 },
    { field: 'actions', headerName: 'Actions', width: 150, renderCell: (params) => renderActionsCell(params) },
  ]

  const renderActionsCell = (params) => {
    const { row } = params

    switch (params.row.type) {
      case 'friend':
        return (
          <div>
            <Button
              onClick={() => handleFriendActionClick('remove', row.id)}
              variant="outlined"
              color="error"
              sx={{ borderColor: 'white', color: 'white' }}
            >
              Remove
            </Button>
          </div>
        )
      case 'request':
        return (
          <div>
            <ButtonGroup>
              <Button
                onClick={() => handleFriendActionClick('accept', row.id)}
                variant="outlined"
                color="primary"
                sx={{ borderColor: 'white', color: 'white' }}
              >
                Accept
              </Button>
              <Button
                onClick={() => handleFriendActionClick('refuse', row.id)}
                variant="outlined"
                color="secondary"
                sx={{ borderColor: 'white', color: 'white' }}
              >
                Refuse
              </Button>
            </ButtonGroup>
          </div>
        )
      case 'blocked':
        return (
          <div>
            <Button
              onClick={() => handleFriendActionClick('unblock', row.id)}
              variant="outlined"
              color="primary"
              sx={{ borderColor: 'white', color: 'white' }}
            >
              Unblock
            </Button>
          </div>
        )
      default:
        return null
    }
  }

  const rows = [
    ...friends.map((friend) => ({
      id: friend.user_id,
      username: friend.username,
      type: 'friend',
      name: userData[friend.username]?.name || '',
      email: userData[friend.username]?.email || '',
      address: userData[friend.username]?.address || '',
    })),
    ...friendRequests.map((request) => ({
      id: request.user_id,
      username: request.username,
      type: 'request',
      name: userData[request.username]?.name || '',
      email: userData[request.username]?.email || '',
      address: userData[request.username]?.address || '',
    })),
    ...blockedUsers.map((blockedUser) => ({
      id: blockedUser.user_id,
      username: blockedUser.username,
      type: 'blocked',
      name: userData[blockedUser.username]?.name || '',
      email: userData[blockedUser.username]?.email || '',
      address: userData[blockedUser.username]?.address || '',
    })),
  ]

  return (
    <Box sx={{ width: '100%', height: '100vh', boxSizing: 'border-box', padding: '10px' }}>
      <ButtonGroup variant="outlined" sx={{ marginLeft: '23px', marginBottom: '10px', display: 'flex', gap: '12px' }}>
        <Button
          onClick={() => handleChange(0)}
          startIcon={<PersonIcon />}
          sx={{
            borderRadius: '10px',
            backgroundColor: value === 0 ? '#ed3f15' : 'transparent',
            borderColor: '#ed3f15',
            color: '#fff',
            '&:hover': { backgroundColor: '#ed3f15', color: '#fff' },
          }}
        >
          Friends
        </Button>
        <Button
          onClick={() => handleChange(1)}
          startIcon={<BlockIcon />}
          sx={{
            borderRadius: '10px',
            backgroundColor: value === 1 ? '#fba94b' : 'transparent',
            borderColor: '#fba94b',
            color: '#fff',
            '&:hover': { backgroundColor: '#fba94b', color: '#fff' },
          }}
        >
          Blocked
        </Button>
        <Button
          onClick={() => handleChange(2)}
          startIcon={<PersonAddIcon />}
          sx={{
            borderRadius: '10px',
            backgroundColor: value === 2 ? '#31ae60' : 'transparent',
            borderColor: '#31ae60',
            color: '#fff',
            '&:hover': { backgroundColor: '#31ae60', color: '#fff' },
          }}
        >
          Request
        </Button>
      </ButtonGroup>
      <Divider />
      <TabPanel value={value} index={0}>
        <DataGrid
          rows={rows.filter((row) => row.type === 'friend')}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <DataGrid
          rows={rows.filter((row) => row.type === 'blocked')}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
        />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <DataGrid
          rows={rows.filter((row) => row.type === 'request')}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
        />
      </TabPanel>
    </Box>
  )
}

export default FriendPage
