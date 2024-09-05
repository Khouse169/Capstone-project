import { ChatEngineWrapper, Socket } from 'react-chat-engine'
import UserAvatar from '../UI/UserAvatar'
import { API_ROOT, CHAT_KEY, USER_ID } from '~/utils/constants'
import { useEffect, useState } from 'react'
import { compareDateTime } from '~/utils/formatters'
import { Popover } from '@mui/material'
import { IconCaretDownFilled, IconMessage2, IconTrash, IconUserCircle } from '@tabler/icons-react'
import { Link } from 'react-router-dom'
import { useConfirm } from 'material-ui-confirm'
import authorizedAxiosInstance from '~/utils/authorizeAxios'

function UserTitle({ inChatPage = false, setSelectedChatId }) {
  const [chatDetail, setChatDetail] = useState(null)
  const [titleUser, setTitleUser] = useState()

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
        authorizedAxiosInstance.delete(`${API_ROOT}/api/Chat/deletechat`, {
          headers: {
            'Content-Type': 'application/json'
          },
          data: { "chatId": chatDetail?.id }
        })
      })
      .catch(() => {
      })
      .finally(() => {
        handleClose()
        setSelectedChatId(null)
      })
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  useEffect(() => {
    chatDetail &&
      setTitleUser(chatDetail?.people?.find((person) => person.person.username !== USER_ID))
  }, [chatDetail])

  return (
    <ChatEngineWrapper>
      {
        titleUser &&
        <div className='flex gap-2 cursor-pointer p-1 w-fit' onClick={handleClick}>
          <div className='relative h-fit'>
            <UserAvatar avatarSrc={`${titleUser?.person?.avatar}`} size='1.8' />
            {titleUser?.person?.is_online && <div className='absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border border-white'></div>}
          </div>
          <div className='flex flex-col'>
            <h3 className='capitalize'>{`${titleUser?.person?.first_name} ${titleUser?.person?.last_name}`}</h3>
            <p className='text-xs text-gray-500/90'>{titleUser?.person?.is_online ? 'Active now' : `Latest activity ${compareDateTime(titleUser?.chat_updated)}`}</p>
          </div>
          <IconCaretDownFilled className='text-orangeFpt' />
        </div>
      }

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
              <Link to={`/chats-page`} className='flex gap-1 cursor-pointer hover:bg-fbWhite p-1 rounded-md'><IconMessage2 stroke={1} />Open in chat page</Link>
            </div>
          }
          <div className='flex flex-col gap-1'>
            <div className='flex gap-1 cursor-pointer hover:bg-fbWhite p-1 rounded-md'
              onClick={handleDeleteChat}
            ><IconTrash stroke={1} />Delete chat</div>
          </div>
        </div>
      </Popover>
      <Socket
        projectID={CHAT_KEY.ProjectID}
        userName={USER_ID}
        userSecret={USER_ID}
        onGetMessages={(chatId, messages) => {
          console.log(chatId, messages)
        }}
        onGetChats={(chats) => {
          console.log(chats);
        }}
        onEditChat={setChatDetail}
      />
    </ChatEngineWrapper>

  )
}

export default UserTitle
