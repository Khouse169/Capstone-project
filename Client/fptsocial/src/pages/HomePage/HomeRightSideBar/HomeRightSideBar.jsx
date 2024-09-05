import { Avatar, Button, IconButton } from '@mui/material'
import { IconUserPlus } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { getAllFriend, sendFriend, suggestionFriend, updateFriendStatus, updateReadNotification } from '~/apis'
import UserAvatar from '~/components/UI/UserAvatar'
import { selectLatestNotification } from '~/redux/notification/notificationSlice'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { compareDateTime } from '~/utils/formatters'
import connectionSignalR from '~/utils/signalRConnection'
import bellImg from '~/assets/img/bell2.png'
import noIdeaImg from '~/assets/img/no-idea.png'
import contactChat from '~/assets/img/contactChat.png'
import { useTranslation } from 'react-i18next'
import { FRONTEND_ROOT } from '~/utils/constants'
import { toast } from 'react-toastify'

function HomeRightSideBar() {
  const currentUser = useSelector(selectCurrentUser)
  const listLatestNotification = useSelector(selectLatestNotification)
  const [listFriend, setListFriend] = useState([])
  const [listFriendSuggestion, setListFriendSuggestion] = useState([])
  const { t } = useTranslation()
  const [isUpdate, setIsUpdate] = useState(false)

  useEffect(() => {
    getAllFriend().then(data => setListFriend(data?.allFriend))
    suggestionFriend().then(data => setListFriendSuggestion(data?.allFriend))
  }, [isUpdate])

  const handleAddFriend = async (userId) => {
    try {
      const response = await sendFriend({
        // userId: currentUser?.userId,
        friendId: userId
      })
      toast.success('Request sended!')
      setIsUpdate(!isUpdate)
      if (response) {
        const signalRData = {
          MsgCode: 'User-001',
          Receiver: userId,
          Url: `${FRONTEND_ROOT}/profile?id=${currentUser?.userId}`,
          AdditionsMsd: ''
        }
        // console.log(signalRData)
        await connectionSignalR.invoke('SendNotify', JSON.stringify(signalRData))

      }
    } catch (err) {
      console.error('Error while starting connection: ', err)

    }
  }

  // const handleResponse = (data_) => {
  //   const data = {
  //     // userId: currentUser?.userId,
  //     friendId: user?.userId,
  //     ...data_
  //   }

  //   updateFriendStatus(data)
  //     .then((data) => {
  //       if (data?.confirm) {
  //         const signalRData = {
  //           MsgCode: 'User-002',
  //           Receiver: `${user?.userId}`,
  //           Url: `${FRONTEND_ROOT}/profile?id=${currentUser?.userId}`,
  //           AdditionsMsd: ''
  //         }

  //         connectionSignalR.invoke('SendNotify', JSON.stringify(signalRData))

  //       }
  //     })
  //     .then(forceUpdate)

  // }

  const handleCheckReadNotification = (notificationId) => {
    updateReadNotification(notificationId)
  }


  return (
    <div className="h-[calc(100vh_-_55px)] w-[380px] hidden lg:!flex flex-col overflow-y-auto scrollbar-none-track ">
      <div className='flex flex-col gap-5 mt-8 '>
        <div className="bg-white rounded-lg shadow-md px-3 py-2">
          <div id="suggestion"
            className="flex flex-col items-start "
          >
            <p className=" text-gray-500 pb-2 font-semibold">{t('standard.home.rightSidebar.suggestion')}</p>
            {listFriendSuggestion?.slice(0, 5).map(friend => (
              <Link key={friend?.friendId} to={`/profile?id=${friend?.friendId}`} className="w-full h-[52px] px-2 py-3 hover:bg-fbWhite-500  flex items-center justify-between cursor-pointer rounded-md">
                <div className='flex items-center gap-2'>
                  <UserAvatar avatarSrc={friend?.avata} isOther={true} />
                  <div className='flex flex-col'>
                    <span className="font-semibold capitalize">{friend?.friendName}</span>
                    <span className="text-xs">{friend?.mutualFriends ?? 0} {t('sideText.mutualFriend')}</span>
                  </div>
                </div>
                <IconButton color="primary" onClick={(e) => {
                  e.preventDefault()
                  handleAddFriend(friend?.friendId)
                }}><IconUserPlus /></IconButton>
              </Link>
            ))}
            {
              listFriendSuggestion?.length == 0 &&
              <div className='flex flex-col justify-center w-full'>
                <img src={noIdeaImg} className='size-10' />
                <span className='font-semibold text-sm text-gray-500'>
                  {t('sideText.noneSuggestion')}
                </span>
              </div>
            }
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md px-3 py-2">
          <div id="suggestion"
            className="flex flex-col items-start gap-1"
          >
            <p className=" text-gray-500 pb-2 font-semibold">{t('standard.home.rightSidebar.notification')}</p>
            {
              listLatestNotification?.slice(0, 3)?.map((notification, i) => (
                <Link to={notification?.Url} onClick={() => handleCheckReadNotification(notification?.NotificationId)} key={i} className='flex items-center gap-2 min-h-12 hover:bg-fbWhite-500 rounded-md p-1 w-full'>
                  <UserAvatar avatarSrc={notification?.SenderAvatar} size='2' isOther='true' />
                  <div className='flex flex-col w-full'>
                    <div className='flex gap-1 text-xs justify-between items-center'>
                      <span>
                        <span className='font-bold capitalize'>{notification?.SenderName}</span>
                        {notification?.Message}
                      </span>
                      {!notification?.IsRead && <div className='size-2 min-w-2 bg-blue-500 rounded-full'></div>}
                    </div>
                    <span className='text-blue-500 font-semibold text-xs'>{compareDateTime(notification?.CreatedAt)}</span>
                  </div>
                </Link>
              ))
            }
            {
              listLatestNotification?.length == 0 && !listLatestNotification &&
              <div className='flex flex-col justify-center w-full'>
                <img src={bellImg} className='size-10' />
                <span className='font-semibold text-sm text-gray-500'>
                  {t('sideText.noneNotification')}
                </span>
              </div>
            }
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md px-3 py-2">
          <div id="people"
            className="flex flex-col items-start "
          >
            <p className=" text-gray-500 font-semibold">{t('standard.home.rightSidebar.contact')}</p>
            {listFriend?.slice(0, 15).map(friend => (
              <Link key={friend?.friendId} to={`/profile?id=${friend?.friendId}`} className="w-full h-[52px] px-2 py-3 hover:bg-orangeFpt hover:text-white flex items-center gap-3 cursor-pointer rounded-md">
                <UserAvatar avatarSrc={friend?.avata} isOther={true} />
                <span className="font-semibold capitalize">{friend?.friendName}</span>
              </Link>
            ))}
            {
              listFriend?.length == 0 &&
              <div className='flex flex-col justify-center w-full py-2'>
                <img src={contactChat} className='size-10' />
                <span className='font-semibold text-sm text-gray-500'>
                  {t('sideText.contactMes')}
                </span>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeRightSideBar