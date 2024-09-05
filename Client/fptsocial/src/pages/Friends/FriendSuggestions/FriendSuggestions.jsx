import { Button, Card, CardActions, CardContent, CardMedia, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { sendFriend, suggestionFriend } from '~/apis'
import NoDataMessage from '../NoDataMessage'
import { toast } from 'react-toastify'
import { FRONTEND_ROOT } from '~/utils/constants'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import connectionSignalR from '~/utils/signalRConnection'

function FriendSuggestions() {
  const [listSuggestedFriend, setListSuggestedFriend] = useState([])
  const { t } = useTranslation()
  const [reload, setReload] = useState(false)
  const currentUser = useSelector(selectCurrentUser)

  useEffect(() => {
    suggestionFriend().then(data => setListSuggestedFriend(data?.allFriend))
  }, [reload])

  const handleAddFriend = async (userId) => {
    try {
      const response = await sendFriend({
        friendId: userId
      })
      toast.success('Request sended!')
      setReload(!reload)
      if (response) {
        const signalRData = {
          MsgCode: 'User-001',
          Receiver: userId,
          Url: `${FRONTEND_ROOT}/profile?id=${currentUser?.userId}`,
          AdditionsMsd: ''
        }
        await connectionSignalR.invoke('SendNotify', JSON.stringify(signalRData))
      }
    } catch (err) {
      console.error('Error while starting connection: ', err)
    }
  }

  return (
    <div className='w-full'>
      <div className='p-4'>
        <div className='mb-4'>
          <span className='text-xl font-bold'>{t('standard.friend.peopleSuggest')}</span>
        </div>
        <div className='grid grid-cols-12 gap-x-2'>
          {
            listSuggestedFriend?.map(suggestion => (
              <div key={suggestion?.friendId} className='bg-white col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3 h-[320px] rounded-md flex flex-col'>
                <Link to={`/profile?id=${suggestion?.friendId}`}>
                  <img
                    className='w-full h-[205px] object-cover rounded-t-md'
                    src={suggestion?.avata || '../src/assets/img/avatar_holder.png'}
                  />
                </Link>
                <div className='p-3 h-full flex flex-col gap-1'>
                  <span className='font-bold capitalize'>{suggestion?.friendName}</span>
                  <span className='text-gray-500'>{suggestion?.mutualFriends} {t('sideText.mutualFriend')}</span>
                  <div className=' flex flex-col gap-2 h-full justify-end items-center'>
                    <div className='text-blue-500 bg-blue-100 hover:bg-blue-200 cursor-pointer w-full flex justify-center rounded-md'
                      onClick={() => handleAddFriend(suggestion?.friendId)}
                    >
                      <span className='my-2 font-bold'>{t('standard.profile.addFriend')}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
        {
          listSuggestedFriend?.length == 0 &&
          <NoDataMessage message={t('standard.friend.noSuggest')} />
        }
      </div>

    </div>
  )
}

export default FriendSuggestions
