import axios from 'axios'
import { BACKEND_URI } from '~/API'

export const fetchFriendsData = async () => {
  const accessToken = localStorage.getItem('accessToken')
  try {
    const [friendsResponse, requestsResponse, blockedResponse] = await Promise.all([
      axios.post(`${BACKEND_URI}/user/get-list-friend`, {}, { headers: { accessToken } }),
      axios.post(`${BACKEND_URI}/user/get-list-friend-request`, {}, { headers: { accessToken } }),
      axios.post(`${BACKEND_URI}/user/get-list-block-friend`, {}, { headers: { accessToken } }),
    ])

    return {
      friends: friendsResponse.data || [],
      friendRequests: requestsResponse.data || [],
      blockedUsers: blockedResponse.data.blockedUsers || [],
    }
  } catch (error) {
    console.error('Error fetching friends data:', error)
    throw error
  }
}

export const fetchUserData = async (username) => {
  try {
    const response = await axios.post(`${BACKEND_URI}/user/get-user-data-by-username`, { username })
    return response.data
  } catch (error) {
    console.error('Error fetching user data:', error)
    throw error
  }
}

export const handleFriendAction = async (action, userId) => {
  try {
    let endpoint = ''

    switch (action) {
      case 'accept':
        endpoint = `${BACKEND_URI}/user/accept-friend`
        break
      case 'refuse':
        endpoint = `${BACKEND_URI}/user/refuse-friend`
        break
      case 'remove':
        endpoint = `${BACKEND_URI}/user/remove-friend`
        break
      case 'unblock':
        endpoint = `${BACKEND_URI}/user/unblock-user`
        break
      default:
        throw new Error('Unknown action')
    }

    await axios.post(endpoint, { userId })
  } catch (error) {
    console.error(`Error handling ${action} friend action:`, error)
    throw error
  }
}
