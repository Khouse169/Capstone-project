import { useCallback, useEffect, useState, useRef } from "react"
import debounce from "lodash.debounce"
import authorizedAxiosInstance from "~/utils/authorizeAxios"
import {
  API_ROOT,
  CHAT_ENGINE_CONFIG_HEADER,
  CHAT_KEY,
  USER_ID,
} from "~/utils/constants"
import ChatItem from './ChatItem'
import { ChatEngineWrapper, Socket } from 'react-chat-engine'
import { useNavigate } from 'react-router-dom'

function Sidebar({ onSelectChat, allMessages, chatId, chats, setChats }) {
  const navigate = useNavigate()
  const [searchResults, setSearchResults] = useState({
    listFriend: [],
    listUserNotFriend: [],
  })

  const [allUsers, setAllUsers] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])
  // const [currentSelectedUserId, setCurrentSelectedUserId] = useState(null)
  // const [modalOpen, setModalOpen] = useState(false)
  // const [modalMessages, setModalMessages] = useState([])
  // const [selectedUsername, setSelectedUsername] = useState("")
  // const [selectedUserFullName, setSelectedUserFullName] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const inputRef = useRef(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    fetchChats()
    fetchAllUsers()
  }, [chatId])

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !inputRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const fetchChats = async () => {
    try {
      const response = await authorizedAxiosInstance.get(
        "https://api.chatengine.io/chats/",
        CHAT_ENGINE_CONFIG_HEADER
      )
      setChats(response.data)
    } catch (error) {
      console.error("Error fetching chat list:", error)
    }
  }

  const fetchAllUsers = async () => {
    try {
      const response = await authorizedAxiosInstance.get(
        `${API_ROOT}/api/Chat/searchinchat`
      )
      if (response.data.statusCode === "Success") {
        setAllUsers(response.data.data.otherUser)
      } else {
        setAllUsers([])
      }
    } catch (error) {
      console.error("Error fetching all users:", error)
      setAllUsers([])
    }
  }

  const handleSelectChat = (chatId) => {
    navigate(`/chats-page/${chatId}`)
  }

  const handleSearch = async (searchText) => {
    try {
      const response = await authorizedAxiosInstance.get(
        `${API_ROOT}/api/Chat/searchuserforchat?FindName=${encodeURIComponent(
          searchText
        )}`
      )
      if (response.data.statusCode === "Success") {
        setSearchResults(response.data.data)
      } else {
        setSearchResults({ listFriend: [], listUserNotFriend: [] })
      }
    } catch (error) {
      console.error("Error searching for users:", error)
      setSearchResults({ listFriend: [], listUserNotFriend: [] })
    }
  }

  const debouncedSearch = useCallback(
    debounce((searchText) => handleSearch(searchText), 1000),
    []
  )

  const handleInputChange = (event) => {
    const value = event.target.value
    if (!value) return
    debouncedSearch(value)
    setIsOpen(true)
  }

  const flattenedOptions = [
    ...searchResults.listFriend.map((user) => ({ ...user, group: "Friends" })),
    ...searchResults.listUserNotFriend.map((user) => ({
      ...user,
      group: "Others",
    })).filter(user => user?.friendId !== USER_ID),
  ]

  const handleChoseSearchChat = async (chat) => {
    inputRef.current.value = ''
    setSearchResults({
      listFriend: [],
      listUserNotFriend: [],
    })
    setIsOpen(false)
    if (chat?.chatId) {
      navigate(`/chats-page/${chat?.chatId}`)
    }
    else {
      const createChatResponse = await authorizedAxiosInstance.post(
        `${API_ROOT}/api/Chat/createchatbox`,
        {
          otherId: chat?.friendId,
          title: "",
        }
      )
      navigate(`/chats-page/${createChatResponse?.data?.data?.chatId}`)
    }
  }

  return (
    <ChatEngineWrapper>
      <Socket
        projectID={CHAT_KEY.ProjectID}
        userName={USER_ID}
        userSecret={USER_ID}
        onEditChat={fetchChats}
      />
      <div className='h-[calc(100vh_-_55px)] w-[400px] flex-shrink-0 flex flex-col border-r-2'>
        <div className='p-2 flex flex-col h-full'>
          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orangeFpt"
              placeholder="Search Users"
              // value={search}
              onChange={handleInputChange}
              onFocus={() => setIsOpen(true)}
            />
            {isOpen && (
              <div ref={dropdownRef} className="absolute z-10 w-full mt-1 bg-white border p-1 border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto scrollbar-none-track">
                {flattenedOptions?.map((option, index) => (
                  <div key={index} className='flex flex-col gap-1 interceptor-loading'>
                    {index === 0 || option.group !== flattenedOptions[index - 1].group ? (
                      <div className="px-4 py-2 text-sm font-semibold text-gray-500 bg-gray-100 rounded-md mt-1">
                        {option.group}
                      </div>
                    ) : null}
                    <div
                      className="flex items-center px-4 py-2 cursor-pointer hover:bg-orangeFpt hover:text-white rounded-md interceptor-loading"
                      onClick={() => handleChoseSearchChat(option)}
                    >
                      <img
                        src={option.avata}
                        alt={option.friendName}
                        className="w-8 h-8 mr-2 rounded-full"
                      />
                      <span className='capitalize'>{option.friendName}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className='flex-grow overflow-y-auto p-2 scrollbar-none-track '>
            <div className='h-full'>
              {!chats.length && selectedUsers.length === 0 ? (
                "No chats to display"
              ) : (
                <>
                  {chats &&
                    chats.map((chat) => (
                      <ChatItem key={chat?.id} chat={chat} inPageChat handleSelectChat={handleSelectChat} />
                    ))}
                </>
              )}
            </div>
          </div>
        </div>
      </div >
    </ChatEngineWrapper>

  )
}

export default Sidebar