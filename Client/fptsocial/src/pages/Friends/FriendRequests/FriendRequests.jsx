import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllFriendRequest, updateFriendStatus } from '~/apis';
import NoDataMessage from '../NoDataMessage';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '~/redux/user/userSlice';
import { FRONTEND_ROOT } from '~/utils/constants';
import connectionSignalR from '~/utils/signalRConnection';
import { toast } from 'react-toastify';

function FriendRequests() {
  const [listRequestedFriend, setListRequestedFriend] = useState([])
  const [reload, setReload] = useState(false)
  const currentUser = useSelector(selectCurrentUser)
  const { t } = useTranslation()

  useEffect(() => {
    getAllFriendRequest().then(data => setListRequestedFriend(data?.allFriend))
  }, [reload])

  const handleResponse = (data_) => {
    const data = {
      ...data_
    }
    updateFriendStatus(data)
      .then((data) => {
        setReload(!reload)
        if (data?.confirm) {
          toast.success('Accepted request')
          const signalRData = {
            MsgCode: 'User-002',
            Receiver: `${data_?.friendId}`,
            Url: `${FRONTEND_ROOT}/profile?id=${currentUser?.userId}`,
            AdditionsMsd: ''
          }
          connectionSignalR.invoke('SendNotify', JSON.stringify(signalRData))
        }
      })
    // .then(forceUpdate)
  }

  return (
    <div className='w-full '>
      <div className='p-4'>
        <div className='mb-4'>
          <span className='text-xl font-bold'>{t('standard.friend.request')}</span>
        </div>
        <div className='grid grid-cols-12 gap-x-2'>
          {
            listRequestedFriend?.map(friend => (
              <div key={friend?.friendId} className='bg-white col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3 h-[350px] rounded-md flex flex-col'>
                <Link to={`/profile?id=${friend?.friendId}`}>
                  <img
                    className='w-full h-[205px] object-cover rounded-t-md'
                    src={friend?.avata || '../src/assets/img/avatar_holder.png'}
                  />
                </Link>
                <div className='p-3 h-full flex flex-col'>
                  <span className='font-bold capitalize'>{friend?.friendName}</span>
                  <div className=' flex flex-col gap-2 h-full justify-end items-center'>
                    <div className='text-blue-500 bg-blue-100 hover:bg-blue-200 cursor-pointer w-full flex justify-center rounded-md'
                      onClick={() => handleResponse({
                        confirm: true,
                        cancle: false,
                        reject: false,
                        friendId: friend?.friendId
                      })}
                    >
                      <span className='my-2 font-bold flex'>{t('standard.profile.confirmRequest')}</span>
                    </div>
                    <div className='text-red-500 bg-red-100 hover:bg-red-200 cursor-pointer w-full flex justify-center rounded-md'
                      onClick={() => handleResponse({
                        confirm: false,
                        cancle: false,
                        reject: true,
                        friendId: friend?.friendId
                      })}>
                      <span className='my-2 font-bold'>{t('standard.profile.deleteRequest')}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
        {
          listRequestedFriend?.length == 0 &&
          <NoDataMessage message={t('standard.friend.noRequest')} />
        }
      </div>

    </div>
  )
}

export default FriendRequests;
