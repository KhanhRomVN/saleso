import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Button,
  Avatar,
  InputBase,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material'
import axios from 'axios'
import { BACKEND_URI } from '~/API'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { imageDB } from '~/firebase/firebaseConfig' // Adjust the path as per your Firebase config
import { v4 as uuidv4 } from 'uuid'

const UserProfile = () => {
  const [userData, setUserData] = useState({
    avatar: '',
    name: '',
    username: '',
    email: '',
    about: '',
    password: '', // New field for password
    address: '', // New field for address
  })

  const [isEditing, setIsEditing] = useState({})
  const [otp, setOtp] = useState('')
  const [showOtpInput, setShowOtpInput] = useState(false)
  const [openChangePasswordDialog, setOpenChangePasswordDialog] = useState(false)
  const [openForgetPasswordDialog, setOpenForgetPasswordDialog] = useState(false)
  const [changePasswordData, setChangePasswordData] = useState({ currentPassword: '', newPassword: '' })
  const [forgetPasswordData, setForgetPasswordData] = useState({ email: '', otp: '', newPassword: '' })
  const [showForgetPasswordInputs, setShowForgetPasswordInputs] = useState(false)

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'))
        const username = currentUser.username
        const response = await axios.post(`${BACKEND_URI}/user/get-user-data-by-username`, { username })
        const userDataFromAPI = response.data

        setUserData((prevUserData) => ({
          ...prevUserData,
          avatar: userDataFromAPI.avatar || prevUserData.avatar,
          name: userDataFromAPI.name || prevUserData.name,
          username: userDataFromAPI.username || prevUserData.username,
          email: userDataFromAPI.email || prevUserData.email,
          about: userDataFromAPI.about || prevUserData.about,
          address: userDataFromAPI.address || prevUserData.address,
        }))
      } catch (error) {
        console.error('Error fetching user data:', error)
      }
    }

    fetchUserData()
  }, [])

  const handleInputChange = (field) => (event) => {
    setUserData({ ...userData, [field]: event.target.value })
    setIsEditing({ ...isEditing, [field]: true })
  }

  const handleSaveChanges = async (field) => {
    try {
      const accessToken = localStorage.getItem('accessToken')
      if (!accessToken) {
        console.error('Access token not found.')
        return
      }

      const endpoint =
        field === 'username' ? `${BACKEND_URI}/user/update-user-field` : `${BACKEND_URI}/user/update-user-detail-field`

      const response = await axios.post(
        endpoint,
        {
          field,
          value: userData[field],
        },
        {
          headers: {
            accessToken,
          },
        },
      )

      if (response.status === 200 || response.status === 201) {
        console.log(`${field} updated successfully.`)
        setIsEditing({ ...isEditing, [field]: false })
      } else {
        console.error(`Failed to update ${field}:`, response.data.message)
        // Handle error (e.g., display error message)
      }
    } catch (error) {
      console.error(`Error updating ${field}:`, error)
    }
  }

  const handleUpdateEmail = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken')
      if (!accessToken) {
        console.error('Access token not found.')
        return
      }

      console.log(accessToken)

      // Request to verify email
      const responseVerify = await axios.post(
        `${BACKEND_URI}/user/verify-email`,
        { newEmail: userData.email },
        {
          headers: {
            accessToken,
          },
        },
      )

      console.log(responseVerify)
      if (responseVerify.status === 200 || responseVerify.status === 201) {
        // Show OTP input
        setShowOtpInput(true)
      } else {
        console.error('Failed to verify email:', responseVerify.data.message)
        // Handle error (e.g., display error message)
      }
    } catch (error) {
      console.error('Error verifying email:', error)
    }
  }

  const handleVerifyAndUpdateEmail = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken')
      if (!accessToken) {
        console.error('Access token not found.')
        return
      }

      // Request to update email with OTP
      const responseUpdate = await axios.post(
        `${BACKEND_URI}/user/update-email`,
        { newEmail: userData.email, otp },
        {
          headers: {
            accessToken,
          },
        },
      )

      if (responseUpdate.status === 200 || responseUpdate.status === 201) {
        // Hide OTP input and reset OTP state
        setShowOtpInput(false)
        setOtp('')
        console.log('Email updated successfully.')
      } else {
        console.error('Failed to update email:', responseUpdate.data.message)
        // Handle error (e.g., display error message)
      }
    } catch (error) {
      console.error('Error updating email:', error)
    }
  }

  const handleChangePassword = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken')
      if (!accessToken) {
        console.error('Access token not found.')
        return
      }

      const response = await axios.post(
        `${BACKEND_URI}/user/update-password`,
        {
          currentPassword: changePasswordData.currentPassword,
          newPassword: changePasswordData.newPassword,
        },
        {
          headers: {
            accessToken,
          },
        },
      )

      if (response.status === 200 || response.status === 201) {
        console.log('Password updated successfully.')
        setOpenChangePasswordDialog(false)
        setChangePasswordData({ currentPassword: '', newPassword: '' })
      } else {
        console.error('Failed to update password:', response.data.message)
        // Handle error (e.g., display error message)
      }
    } catch (error) {
      console.error('Error updating password:', error)
    }
  }

  const handleForgetPassword = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken')
      if (!accessToken) {
        console.error('Access token not found.')
        return
      }

      const response = await axios.post(
        `${BACKEND_URI}/user/forget-password`,
        { email: forgetPasswordData.email },
        {
          headers: {
            accessToken,
          },
        },
      )

      if (response.status === 200 || response.status === 201) {
        setShowForgetPasswordInputs(true)
      } else {
        console.error('Failed to send OTP:', response.data.message)
        // Handle error (e.g., display error message)
      }
    } catch (error) {
      console.error('Error sending OTP:', error)
    }
  }

  const handleUpdateForgetPassword = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken')
      if (!accessToken) {
        console.error('Access token not found.')
        return
      }

      const response = await axios.post(
        `${BACKEND_URI}/user/update-forget-password`,
        {
          email: forgetPasswordData.email,
          otp: forgetPasswordData.otp,
          newPassword: forgetPasswordData.newPassword,
        },
        {
          headers: {
            accessToken,
          },
        },
      )

      if (response.status === 200 || response.status === 201) {
        console.log('Password updated successfully.')
        setOpenForgetPasswordDialog(false)
        setForgetPasswordData({ email: '', otp: '', newPassword: '' })
        setShowForgetPasswordInputs(false)
        window.location.reload()
      } else {
        console.error('Failed to update password:', response.data.message)
        // Handle error (e.g., display error message)
      }
    } catch (error) {
      console.error('Error updating password:', error)
    }
  }

  const handleImageUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    const storageRef = ref(imageDB, `avatars/${uuidv4()}`)
    try {
      await uploadBytes(storageRef, file)
      const imageUrl = await getDownloadURL(storageRef)

      // Update avatar URL in UI
      setUserData({ ...userData, avatarUrl: imageUrl })

      // Update avatar URL in backend
      await axios.post(
        `${BACKEND_URI}/user/update-user-detail-field`,
        {
          field: 'avatar',
          value: imageUrl,
        },
        {
          headers: {
            accessToken: localStorage.getItem('accessToken'),
          },
        },
      )
    } catch (error) {
      console.error('Error uploading image:', error)
    }
  }

  return (
    <Box sx={{ boxSizing: 'border-box', padding: '10px' }}>
      {/* Username Section */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <Typography variant="h6" sx={{ flex: 1 }}>
          Username:
        </Typography>
        {isEditing.username ? (
          <>
            <InputBase
              value={userData.username}
              onChange={handleInputChange('username')}
              sx={{
                flex: 2,
                padding: '5px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                '&:hover': {
                  borderColor: '#0c68e9',
                },
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleSaveChanges('username')}
              sx={{ marginLeft: '10px' }}
            >
              Save
            </Button>
          </>
        ) : (
          <>
            <Typography variant="body1" sx={{ flex: 2 }}>
              {userData.username}
            </Typography>
            <Button
              variant="outlined"
              onClick={() => setIsEditing({ ...isEditing, username: true })}
              sx={{ marginLeft: '10px' }}
            >
              Edit
            </Button>
          </>
        )}
      </Box>

      {/* Email Section */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <Typography variant="h6" sx={{ flex: 1 }}>
          Email:
        </Typography>
        {isEditing.email ? (
          <>
            <InputBase
              value={userData.email}
              onChange={handleInputChange('email')}
              sx={{
                flex: 2,
                padding: '5px',
                border: '1px solid #ccc',
                borderRadius: '4px',
                '&:hover': {
                  borderColor: '#0c68e9',
                },
              }}
            />
            <Button variant="contained" color="primary" onClick={handleUpdateEmail} sx={{ marginLeft: '10px' }}>
              Verify
            </Button>
            {showOtpInput && (
              <Box sx={{ marginTop: '10px', display: 'flex', alignItems: 'center' }}>
                <InputBase
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  sx={{
                    flex: 1,
                    padding: '5px',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    '&:hover': {
                      borderColor: '#0c68e9',
                    },
                  }}
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleVerifyAndUpdateEmail}
                  sx={{ marginLeft: '10px' }}
                >
                  Verify OTP
                </Button>
              </Box>
            )}
          </>
        ) : (
          <>
            <Typography variant="body1" sx={{ flex: 2 }}>
              {userData.email}
            </Typography>
            <Button
              variant="outlined"
              onClick={() => setIsEditing({ ...isEditing, email: true })}
              sx={{ marginLeft: '10px' }}
            >
              Edit
            </Button>
          </>
        )}
      </Box>

      {/* Change Password Section */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <Typography variant="h6" sx={{ flex: 1 }}>
          Password:
        </Typography>
        <Button
          variant="outlined"
          onClick={() => setOpenChangePasswordDialog(true)}
          sx={{ flex: 2, marginLeft: '10px', color: '#fba94b' }}
        >
          Change Password
        </Button>
      </Box>

      {/* Forget Password Section */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '20px',
        }}
      >
        <Typography variant="h6" sx={{ flex: 1 }}>
          Forget Password:
        </Typography>
        <Button
          variant="outlined"
          onClick={() => setOpenForgetPasswordDialog(true)}
          sx={{ flex: 2, marginLeft: '10px', color: '#31ae60' }}
        >
          Forget Password
        </Button>
      </Box>

      {/* Change Password Dialog */}
      <Dialog open={openChangePasswordDialog} onClose={() => setOpenChangePasswordDialog(false)}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <InputBase
            type="password"
            placeholder="Current Password"
            value={changePasswordData.currentPassword}
            onChange={(e) => setChangePasswordData({ ...changePasswordData, currentPassword: e.target.value })}
            sx={{
              width: '100%',
              marginBottom: '10px',
              padding: '5px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              '&:hover': {
                borderColor: '#0c68e9',
              },
            }}
          />
          <InputBase
            type="password"
            placeholder="New Password"
            value={changePasswordData.newPassword}
            onChange={(e) => setChangePasswordData({ ...changePasswordData, newPassword: e.target.value })}
            sx={{
              width: '100%',
              marginBottom: '10px',
              padding: '5px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              '&:hover': {
                borderColor: '#0c68e9',
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenChangePasswordDialog(false)}>Cancel</Button>
          <Button onClick={handleChangePassword} sx={{ color: '#fba94b' }}>
            Change Password
          </Button>
        </DialogActions>
      </Dialog>

      {/* Forget Password Dialog */}
      <Dialog open={openForgetPasswordDialog} onClose={() => setOpenForgetPasswordDialog(false)}>
        <DialogTitle>Forget Password</DialogTitle>
        <DialogContent>
          <InputBase
            type="email"
            placeholder="Email"
            value={forgetPasswordData.email}
            onChange={(e) => setForgetPasswordData({ ...forgetPasswordData, email: e.target.value })}
            sx={{
              width: '100%',
              marginBottom: '10px',
              padding: '5px',
              border: '1px solid #ccc',
              borderRadius: '4px',
              '&:hover': {
                borderColor: '#0c68e9',
              },
            }}
          />
          {showForgetPasswordInputs && (
            <>
              <InputBase
                type="text"
                placeholder="OTP"
                value={forgetPasswordData.otp}
                onChange={(e) => setForgetPasswordData({ ...forgetPasswordData, otp: e.target.value })}
                sx={{
                  width: '100%',
                  marginBottom: '10px',
                  padding: '5px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  '&:hover': {
                    borderColor: '#0c68e9',
                  },
                }}
              />
              <InputBase
                type="password"
                placeholder="New Password"
                value={forgetPasswordData.newPassword}
                onChange={(e) => setForgetPasswordData({ ...forgetPasswordData, newPassword: e.target.value })}
                sx={{
                  width: '100%',
                  marginBottom: '10px',
                  padding: '5px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  '&:hover': {
                    borderColor: '#0c68e9',
                  },
                }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForgetPasswordDialog(false)}>Cancel</Button>
          {showForgetPasswordInputs ? (
            <Button onClick={handleUpdateForgetPassword} sx={{ color: '#31ae60' }}>
              Update Password
            </Button>
          ) : (
            <Button onClick={handleForgetPassword} sx={{ color: '#31ae60' }}>
              Verify Email
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  )
}

export default UserProfile
