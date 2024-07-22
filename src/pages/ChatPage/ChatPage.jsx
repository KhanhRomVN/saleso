import { useEffect, useState } from 'react'
//* Mui Component
import Box from '@mui/material/Box'
//* NPM Package
import axios from 'axios'
//* Socket
import io from 'socket.io-client'
//* SERVER_API
import { BACKEND_URI } from '~/API'
//* Component
import ChatWindow from './ChatWindow'
import MessageInput from './MessageInput'
import ConversationList from './ConversationList'
import MediaViewDialog from './MediaViewDialog'
import ChatDetailSidebar from './ChatDetailSidebar'

const socket = io.connect(BACKEND_URI)

const ChatPage = () => {
  const [friendList, setFriendList] = useState([])
  const [groupList, setGroupList] = useState([])
  const [friendId, setFriendId] = useState('')
  const [chatRoomId, setChatRoomId] = useState('')
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [image, setImage] = useState('')
  const [listImage, setListImage] = useState([])
  const [userFriendName, setUserFriendName] = useState('')
  const [userAvatar, setUserAvatar] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [groupName, setGroupName] = useState('')
  const [groupAvatar, setGroupAvatar] = useState('')
  const [groupData, setGroupData] = useState(null)
  const [friendData, setFriendData] = useState(null)
  const [isOpenMediaDialog, setIsOpenMediaDialog] = useState(false) // State for Dialog visibility
  const [mediaImages, setMediaImages] = useState([]) // State for images in Dialog

  const accessToken = localStorage.getItem('accessToken')
  const currentUser = JSON.parse(localStorage.getItem('currentUser'))
  const user_id = currentUser.user_id

  useEffect(() => {
    //* Friend
    const listFriend = async () => {
      try {
        const response = await axios.post(
          `${BACKEND_URI}/user/get-list-friend-with-last-message`,
          {},
          {
            headers: { accessToken: accessToken },
          },
        )
        setFriendList(response.data)
      } catch (error) {
        console.error('Error fetching friend list:', error)
      }
    }
    listFriend()
    const listGroup = async () => {
      try {
        const responseListGroup = await axios.post(
          `${BACKEND_URI}/chat/get-list-group-chat`,
          {},
          { headers: { accessToken } },
        )
        setGroupList(responseListGroup.data)
      } catch (error) {
        console.error('Error fetching group list:', error)
      }
    }
    listGroup()
  }, [accessToken, user_id])

  const handlerClickFriend = async (friend_id, userFriendName, userAvatar) => {
    try {
      setUserFriendName(userFriendName)
      setUserAvatar(userAvatar)
      const responseChatBox = await axios.post(
        `${BACKEND_URI}/chat/get-all-user-message`,
        { receiver_id: friend_id },
        { headers: { accessToken: accessToken } },
      )
      const { conservation_id, messageList } = responseChatBox.data
      setFriendId(friend_id)
      setChatRoomId(conservation_id)
      setMessages(messageList)
      socket.emit('joinRoom', conservation_id)

      //* Get Data User (Contact Detail Sidebar)
      const responseUserData = await axios.post(
        `${BACKEND_URI}/user/get-user-data-by-username`,
        { username: userFriendName },
        { headers: { accessToken: accessToken } },
      )
      setFriendData(responseUserData.data)

      //* Get All Picture (Detail Contact Sidebar)
      const responseListImage = await axios.post(
        `${BACKEND_URI}/chat/get-all-user-image`,
        { receiver_id: friend_id },
        { headers: { accessToken } },
      )
      setListImage(responseListImage.data.imageList)
    } catch (error) {
      console.error('Error fetching chat or user data:', error)
    }
  }

  const handlerClickGroup = async (group_id, group_name, group_avatar) => {
    try {
      console.log(group_avatar)
      setGroupName(group_name)
      setGroupAvatar(group_avatar)
      const responseChatBox = await axios.post(
        `${BACKEND_URI}/chat/get-all-group-message`,
        { group_id: group_id },
        { headers: { accessToken: accessToken } },
      )
      setChatRoomId(group_id)
      setMessages(responseChatBox.data)
      socket.emit('joinRoom', group_id)
      setGroupData({ group_name, group_avatar, group_id })

      //* Get All Picture (Detail Contact Sidebar)
      const responseListImage = await axios.post(
        `${BACKEND_URI}/chat/get-all-group-image`,
        { group_id: chatRoomId },
        { headers: { accessToken } },
      )
      setListImage(responseListImage.data.imageList)
    } catch (error) {
      console.error('Error fetching chat or user data:', error)
    }
  }

  const handleSendMessage = () => {
    if (input.trim() !== '' || image !== '') {
      socket.emit('sendMessage', chatRoomId, input.trim(), image, user_id)
      setInput('')
      setImage('')
    }
  }

  useEffect(() => {
    if (chatRoomId) {
      socket.on('receiveMessage', (data) => {
        const newMessage = {
          sender_id: data.senderId,
          message: data.message,
          image: data.image,
        }
        setMessages((prevMessages) => [...prevMessages, newMessage])
      })
    }
    return () => {
      socket.off('receiveMessage')
    }
  }, [chatRoomId])

  const filteredFriends = friendList.filter((friend) =>
    friend.username.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleOpenMediaDialog = () => {
    setMediaImages(listImage) // Set images to be displayed in MediaViewDialog
    setIsOpenMediaDialog(true) // Open the dialog
  }

  const handleCloseMediaDialog = () => {
    setIsOpenMediaDialog(false)
  }

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        backgroundColor: (theme) => theme.palette.backgroundColor.secondary,
        boxSizing: 'border-box',
        margin: 0,
      }}
    >
      {/* //* Conservation Sidebar */}
      <Box sx={{ minWidth: '300px' }}>
        <ConversationList
          friendList={filteredFriends}
          groupList={groupList}
          handlerClickFriend={handlerClickFriend}
          handlerClickGroup={handlerClickGroup}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          accessToken={accessToken}
        />
      </Box>
      {/* //* ChatWindow */}
      <Box
        sx={{
          minWidth: '700px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '10px',
          gap: '10px',
        }}
      >
        {/* <ChatWindow
          userFriendName={userFriendName}
          messages={messages}
          image={image}
          user_id={user_id}
          userAvatar={userAvatar}
          groupName={groupName}
          groupAvatar={groupAvatar}
        /> */}
        {/* //* Message Input */}
        <Box sx={{ height: '40px' }}>
          {/* <MessageInput
            input={input}
            setInput={setInput}
            handleSendMessage={handleSendMessage}
            image={image}
            setImage={setImage}
          /> */}
        </Box>
      </Box>
      {/* //* Chat Detail Sidebar */}
      <Box sx={{ width: '100%', boxSizing: 'border-box', padding: '10px 10px 10px 0' }}>
        {/* <ChatDetailSidebar
          groupData={groupData}
          friendData={friendData}
          handleCloseMediaDialog={handleCloseMediaDialog}
          handleOpenMediaDialog={handleOpenMediaDialog}
          listImage={listImage}
          accessToken={accessToken}
        /> */}
      </Box>
      {/* MediaViewDialog component */}
      <MediaViewDialog isOpen={isOpenMediaDialog} onClose={handleCloseMediaDialog} images={mediaImages} />
    </Box>
  )
}

export default ChatPage
