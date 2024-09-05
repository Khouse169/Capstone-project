import { useState, useEffect, useRef } from "react"
import { Tooltip, Fab } from "@mui/material"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import authorizedAxiosInstance from "~/utils/authorizeAxios"
import { API_ROOT, USER_ID, CHAT_ENGINE_CONFIG_HEADER, CHAT_KEY } from "~/utils/constants"
import { ChatEngineWrapper, Socket } from "react-chat-engine"
import UserAvatar from '../UI/UserAvatar'
import { cleanAndParseHTML, formatDate } from '~/utils/formatters'
import TipTapMes from '../TitTap/TitTabMessage'
import { useConfirm } from 'material-ui-confirm'
import { Popover } from '@mui/material'
import { IconChevronDown, IconLock, IconMessage2, IconTrash, IconUserCircle, IconX } from '@tabler/icons-react'
import { Link, useNavigate } from 'react-router-dom'
import { getChatDetailById } from '~/apis'

function ChatWindow({ chatId, onNewMessage, fetchChats, inChatPage = false, chats, handleCloseModal }) {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [attachments, setAttachments] = useState([])
  const [chatDetail, setChatDetail] = useState(null)
  const [titleUser, setTitleUser] = useState({})
  const [lastReadMessageId, setLastReadMessageId] = useState(null)
  const [showScrollButton, setShowScrollButton] = useState(false)
  const navigate = useNavigate()
  const messagesEndRef = useRef(null)
  const chatContainerRef = useRef(null)
  const [isBlock, setIsBlock] = useState(false)

  useEffect(() => {
    setChatDetail(null)
    if (chatId) {
      fetchChatMessages(chatId)
      getChatDetailById(chatId).then(data => setIsBlock(data?.isBloked))
    }
  }, [chatId])

  useEffect(() => {
    if (chatDetail)
      setTitleUser(chatDetail?.people?.find((person) => person.person.username !== USER_ID))
    else
      setTitleUser(chats?.find(chat => chat?.id == chatId)?.people?.find((person) => person.person.username !== USER_ID))
  }, [chatDetail, chats, chatId])

  useEffect(() => {
    if (messages.length > 0 && chatId) {
      const lastMessage = messages[messages.length - 1]
      if (lastMessage.id !== lastReadMessageId) {
        fetchCheckRead(chatId, lastMessage.id)
        setLastReadMessageId(lastMessage.id)
      }
      scrollToBottom()
    }
  }, [messages, chatId, lastReadMessageId])

  useEffect(() => {
    if (messages.length > 0) {
      scrollToBottom()
    }
  }, [])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current
    const bottomThreshold = 100 // pixels from bottom
    setShowScrollButton(scrollHeight - scrollTop - clientHeight > bottomThreshold)
  }

  const fetchCheckRead = async (chatId, messageId) => {
    try {
      await authorizedAxiosInstance.patch(
        `https://api.chatengine.io/chats/${chatId}/people/`,
        { last_read: messageId },
        CHAT_ENGINE_CONFIG_HEADER
      )
    } catch (error) {
      console.error("Error updating last read:", error)
    }
  }

  const fetchChatMessages = async (chatId) => {
    try {
      const response = await authorizedAxiosInstance.get(
        `https://api.chatengine.io/chats/${chatId}/messages/`,
        CHAT_ENGINE_CONFIG_HEADER
      )
      setMessages(response.data)
    } catch (error) {
      console.error("Error fetching chat messages:", error)
    }
  }

  const sendMessage = async () => {
    if (!message.trim() && attachments?.length == 0) return
    const requestBody = {
      text: message,
      attachment_urls: attachments.length > 0 ? attachments?.map(e => (e?.url)) : undefined,
    }

    try {
      await authorizedAxiosInstance.post(
        `https://api.chatengine.io/chats/${chatId}/messages/`,
        requestBody,
        CHAT_ENGINE_CONFIG_HEADER
      )
      setMessage("")
      setAttachments([])
      await fetchChatMessages(chatId)
    } catch (error) {
      console.error("Error sending message:", error)
    }
  }

  const handleNewMessage = (chatId, message) => {
    if (chatId === chatId) {
      setMessages((prevMessages) => [...prevMessages, message])
    }
    onNewMessage(chatId, message)
  }

  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }
  const confirm = useConfirm()
  const handleDeleteChat = () => {
    confirm({
      title: "Xóa hộp chat",
      allowClose: true,
      description: "Bạn có chắc chắn muốn xóa hộp chat này? Hành động này không thể hoàn tác.",
      confirmationText: "Xóa",
      cancellationText: "Hủy",
      confirmationButtonProps: {
        variant: "contained",
        color: "warning"
      },
      cancellationButtonProps: {
        variant: "outlined",
        color: "primary"
      },
    })
      .then(() => {
        return authorizedAxiosInstance.delete(`${API_ROOT}/api/Chat/deletechat`, {
          headers: {
            'Content-Type': 'application/json'
          },
          data: { "chatId": chatId }
        });
      })
      .then(() => {
        handleClose()
        if (handleCloseModal) {
          handleCloseModal()
        }
        if (fetchChats) {
          fetchChats()
        }
        if (inChatPage) {
          navigate('/chats-page')
        }
      })
      .catch((error) => {
        console.error("Error deleting chat:", error);
        // Optionally, show an error message to the user
      });
  };


  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  useEffect(() => {
    chatDetail &&
      setTitleUser(chatDetail?.people?.find((person) => person.person.username !== USER_ID))
  }, [chatDetail])


  return (
    <ChatEngineWrapper>
      <Socket
        projectID={CHAT_KEY.ProjectID}
        userName={USER_ID}
        userSecret={USER_ID}
        onEditChat={(data) => {
          setChatDetail(data)
        }}
        onNewMessage={handleNewMessage}
      />
      <div className='flex flex-col justify-between h-full'>
        <div className='border-b rounded-md bg-orange-100 p-2 flex justify-between'>
          <div className='flex gap-2 cursor-pointer p-1 w-fit' onClick={handleClick}>
            {
              titleUser && <>
                <div className='relative h-fit'>
                  <UserAvatar avatarSrc={`${titleUser?.person?.avatar}`} size='1.8' />
                  {titleUser?.person?.is_online && <div className='absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border border-white'></div>}
                </div>
                <div className='flex flex-col'>
                  <h3 className='capitalize'>{`${titleUser?.person?.first_name} ${titleUser?.person?.last_name}`}</h3>
                  <p className='text-xs text-gray-500/90 flex items-center gap-1'>{titleUser?.person?.is_online ? 'Active now' : `Offline`}
                    <IconChevronDown className='text-orangeFpt size-5' />
                    {titleUser && isBlock && <IconLock className='text-red-500/90 size-5' />}
                  </p>
                </div>
              </>
            }
          </div>

          <div className='flex gap-2 items-center'
          >{
              !inChatPage && <IconX onClick={handleCloseModal} className='cursor-pointer hover:text-orangeFpt rounded-full' />
            }
          </div>
          <Popover
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
            <div className='p-2 rounded-md text-sm'>
              <div className='flex flex-col gap-1'>
                <Link to={`/profile?id=${titleUser?.person?.username}`} className='flex gap-1 cursor-pointer hover:bg-fbWhite p-1 rounded-md'><IconUserCircle stroke={1} />View profile</Link>
              </div>
              {
                !inChatPage &&
                <div className='flex flex-col gap-1'>
                  <Link to={`/chats-page/${chatId}`} className='flex gap-1 cursor-pointer hover:bg-fbWhite p-1 rounded-md'><IconMessage2 stroke={1} />Open in chat page</Link>
                </div>
              }
              <div className='flex flex-col gap-1'>
                <div className='flex gap-1 cursor-pointer hover:bg-fbWhite p-1 rounded-md'
                  onClick={handleDeleteChat}
                ><IconTrash stroke={1} />Delete chat</div>
              </div>
            </div>
          </Popover>
        </div>
        <div
          ref={chatContainerRef}
          onScroll={handleScroll}
          className='h-[400px] grow overflow-y-auto scrollbar-none-track p-3 bg-white'
        >
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <Tooltip key={index} title={formatDate(message?.created)} placement={message.sender_username === USER_ID ? "bottom-end" : "bottom-start"}>
                <div
                  className={`flex flex-col ${message.sender_username === USER_ID ? 'items-end' : 'items-start'} mb-2 cursor-pointer`}
                >
                  <div className='text-xs capitalize font-light'>{message?.sender.first_name}</div>
                  <div className={`flex gap-1 max-w-[70%] ${message.sender_username === USER_ID ? 'justify-end' : 'justify-start'}`}>
                    {message.sender_username !== USER_ID && <div className='relative min-w-8 h-fit'>
                      <UserAvatar
                        avatarSrc={message?.sender?.avatar}
                        size='2'
                      />
                    </div>
                    }
                    <div className='flex flex-col gap-1'>
                      <div className={`flex ${message.sender_username === USER_ID ? 'justify-end' : 'justify-start'}`}>
                        {
                          message?.text?.length > 0 &&
                          <div className={`py-2 px-3 w-fit rounded-lg ${message.sender_username === USER_ID ? 'bg-orange-50 text-orangeFpt' : 'bg-gray-100'} 
                    shadow-lg`}>
                            {cleanAndParseHTML(message?.text)}
                          </div>
                        }
                      </div>
                      {message?.attachments?.length > 0 &&
                        <div className='grid grid-cols-2 gap-1'>
                          {message?.attachments?.map((file, i) => {
                            const fileExtension = file?.file?.toLowerCase()
                            const isImage = ['jpg', 'jpeg', 'png', 'gif'].some(type => fileExtension?.includes(type))
                            const isVideo = ['mp4', 'webm', 'ogg'].some(type => fileExtension?.includes(type))

                            return (
                              <div key={file?.id} className={`flex items-center bg-gray-100 ${message?.attachments?.length % 2 === 1 && i === 0 ? 'col-span-2' : 'col-span-1'}`}>
                                {isImage && <img src={file?.file} alt="Attachment" className='object-cover w-full' loading='lazy' />}
                                {isVideo && (
                                  <video src={file?.file} controls className='object-cover w-full' loading='lazy' />
                                )}
                                {/* {!isImage && !isVideo && <a href={file?.file} download>Download File</a>} */}
                              </div>
                            );
                          })}
                        </div>}
                      <div className={`flex gap-1 w-full ${message.sender_username === USER_ID ? 'justify-start' : 'justify-end'}`}>
                        {
                          titleUser?.last_read == message?.id &&
                          <div className="">
                            <UserAvatar
                              avatarSrc={titleUser?.person?.avatar}
                              size='1'
                            />
                          </div>
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </Tooltip>
            ))
          ) : (
            <div
              className='flex justify-center items-center grow'
            >
              <div className='text-gray-500/90'>
                Let&apos;s start the chat
              </div>
            </div>
          )}
          <div ref={messagesEndRef} className='flex justify-center text-lg font-bold text-red-500/90 w-full'>
            {titleUser && isBlock && <span className='flex items-center p-2'><IconLock />Chat blocked</span>}
          </div>
        </div>
        <div className={`flex justify-center p-2 border-t ${isBlock && 'pointer-events-none'}`}>
          <TipTapMes listMedia={attachments} setListMedia={setAttachments} content={message} setContent={setMessage} sendMessage={sendMessage} />
        </div>

        {showScrollButton && (
          <Fab
            color="primary"
            size="small"
            onClick={scrollToBottom}
            sx={{ position: 'absolute', bottom: 100, right: 16 }}
          >
            <KeyboardArrowDownIcon />
          </Fab>
        )}
      </div>
    </ChatEngineWrapper>
  )
}

export default ChatWindow