import { useState, useEffect } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import Avatar from '@mui/material/Avatar'
import InputBase from '@mui/material/InputBase'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
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
    password: '',
    address: '',
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

  //* Update Username, Name, About, Address
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

  //* Update Email
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

  //* Update Password
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

  //* Linked account with google
  const handleLinkWithGoogle = () => {
    // Implement link with Google logic here
    console.log('Link with Google clicked')
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
    <Box sx={{ boxSizing: 'border-box', padding: '10px 0 0 20px' }}>
      {/* Username Section */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          borderBottom: (theme) => `${theme.palette.textColor.secondary} 1px solid`,
          paddingBottom: '16px',
        }}
      >
        <Typography sx={{ fontSize: '16px', width: '136px' }}>Username</Typography>
        <InputBase
          value={userData.username}
          onChange={handleInputChange('username')}
          placeholder="Enter your username"
          inputProps={{ 'aria-label': 'username' }}
          sx={{
            border: (theme) => `1px solid ${theme.palette.textColor.secondary}`,
            padding: '8px',
            height: '36px',
            width: '800px',
            '&:hover': {
              border: (theme) => `${theme.other.primaryColor} 1px solid`, // Border color on hover
            },
          }}
        />
        {isEditing.username && (
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={() => handleSaveChanges('username')}
            sx={{ marginTop: '8px' }}
          >
            Update
          </Button>
        )}
      </Box>

      {/* Avatar Section */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginTop: '10px',
          borderBottom: (theme) => `${theme.palette.textColor.secondary} 1px solid`,
          paddingBottom: '16px',
        }}
      >
        <Typography sx={{ fontSize: '16px', width: '140px' }}>Avatar</Typography>
        <Avatar alt="Avatar" src={userData.avatar} sx={{ width: 60, height: 60 }} />
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          style={{ display: 'none' }}
          id="upload-avatar"
        />
        <label htmlFor="upload-avatar">
          <Button variant="outlined" component="span" color="primary" size="small">
            Upload Image
          </Button>
        </label>
      </Box>

      {/* Name Section */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginTop: '10px',
          borderBottom: (theme) => `${theme.palette.textColor.secondary} 1px solid`,
          paddingBottom: '16px',
        }}
      >
        <Typography sx={{ fontSize: '16px', width: '140px' }}>Name</Typography>
        <InputBase
          value={userData.name}
          onChange={handleInputChange('name')}
          placeholder="Enter your name"
          inputProps={{ 'aria-label': 'name' }}
          sx={{
            border: (theme) => `1px solid ${theme.palette.textColor.secondary}`,
            padding: '8px',
            height: '36px',
            width: '800px',
            '&:hover': {
              border: (theme) => `${theme.other.primaryColor} 1px solid`, // Border color on hover
            },
          }}
        />
        {isEditing.name && (
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={() => handleSaveChanges('name')}
            sx={{ marginTop: '8px' }}
          >
            Update
          </Button>
        )}
      </Box>

      {/* Email Section */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginTop: '10px',
          borderBottom: (theme) => `${theme.palette.textColor.secondary} 1px solid`,
          paddingBottom: '16px',
        }}
      >
        <Typography sx={{ fontSize: '16px', width: '140px' }}>Email</Typography>
        <InputBase
          value={userData.email}
          onChange={handleInputChange('email')}
          placeholder="Enter your email"
          inputProps={{ 'aria-label': 'email' }}
          sx={{
            border: (theme) => `1px solid ${theme.palette.textColor.secondary}`,
            padding: '8px',
            height: '36px',
            width: '800px',
            '&:hover': {
              border: (theme) => `${theme.other.primaryColor} 1px solid`, // Border color on hover
            },
          }}
        />
        {isEditing.email && (
          <Button variant="outlined" color="primary" size="small" onClick={handleUpdateEmail} sx={{ marginTop: '8px' }}>
            Verify Email
          </Button>
        )}
      </Box>

      {/* OTP Input Email Section */}
      {showOtpInput && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginTop: '10px',
            borderBottom: (theme) => `${theme.palette.textColor.secondary} 1px solid`,
            paddingBottom: '16px',
          }}
        >
          <Typography sx={{ fontSize: '16px', width: '140px' }}>Enter OTP</Typography>
          <InputBase
            value={otp}
            onChange={(event) => setOtp(event.target.value)}
            placeholder="Enter OTP sent to your email"
            inputProps={{ 'aria-label': 'otp' }}
            sx={{
              border: (theme) => `1px solid ${theme.palette.textColor.secondary}`,
              padding: '8px',
              height: '36px',
              width: '800px',
              '&:hover': {
                border: (theme) => `${theme.other.primaryColor} 1px solid`, // Border color on hover
              },
            }}
          />
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={handleVerifyAndUpdateEmail}
            sx={{ marginTop: '8px' }}
          >
            Update Email
          </Button>
        </Box>
      )}

      {/* About Section */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginTop: '10px',
          borderBottom: (theme) => `${theme.palette.textColor.secondary} 1px solid`,
          paddingBottom: '16px',
        }}
      >
        <Typography sx={{ fontSize: '16px', width: '140px' }}>About</Typography>
        <InputBase
          value={userData.about}
          onChange={handleInputChange('about')}
          multiline
          rows={4}
          placeholder="Tell us about yourself"
          inputProps={{ 'aria-label': 'about' }}
          sx={{
            border: (theme) => `1px solid ${theme.palette.textColor.secondary}`,
            padding: '8px',
            height: '120px',
            width: '800px',
            '&:hover': {
              border: (theme) => `${theme.other.primaryColor} 1px solid`, // Border color on hover
            },
          }}
        />
        {isEditing.about && (
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={() => handleSaveChanges('about')}
            sx={{ marginTop: '8px' }}
          >
            Update
          </Button>
        )}
      </Box>

      {/* Address Section */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginTop: '10px',
          borderBottom: (theme) => `${theme.palette.textColor.secondary} 1px solid`,
          paddingBottom: '16px',
        }}
      >
        <Typography sx={{ fontSize: '16px', width: '140px' }}>Address</Typography>
        <InputBase
          value={userData.address}
          onChange={handleInputChange('address')}
          placeholder="Enter your address"
          inputProps={{ 'aria-label': 'address' }}
          sx={{
            border: (theme) => `1px solid ${theme.palette.textColor.secondary}`,
            padding: '8px',
            height: '36px',
            width: '800px',
            '&:hover': {
              border: (theme) => `${theme.other.primaryColor} 1px solid`, // Border color on hover
            },
          }}
        />
        {isEditing.address && (
          <Button
            variant="outlined"
            color="primary"
            size="small"
            onClick={() => handleSaveChanges('address')}
            sx={{ marginTop: '8px' }}
          >
            Update
          </Button>
        )}
      </Box>

      {/* Change Password */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginTop: '10px',
          borderBottom: (theme) => `${theme.palette.textColor.secondary} 1px solid`,
          paddingBottom: '16px',
        }}
      >
        <Typography sx={{ fontSize: '16px', width: '140px' }}>Change Password</Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setOpenChangePasswordDialog(true)}
          sx={{ bgcolor: '#fba94b', color: '#fff' }}
        >
          Change Password
        </Button>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => setOpenForgetPasswordDialog(true)}
          sx={{ bgcolor: '#31ae60', color: '#fff' }}
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

      {/* Link with Google */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          marginTop: '10px',
          borderBottom: (theme) => `${theme.palette.textColor.secondary} 1px solid`,
          paddingBottom: '16px',
        }}
      >
        <Typography sx={{ fontSize: '16px', width: '140px' }}>Link with Google</Typography>
        <Button
          variant="outlined"
          color="primary"
          onClick={handleLinkWithGoogle}
          sx={{ bgcolor: '#ed3f15', color: '#fff' }}
        >
          Link with Google
        </Button>
      </Box>
    </Box>
  )
}

export default UserProfile
