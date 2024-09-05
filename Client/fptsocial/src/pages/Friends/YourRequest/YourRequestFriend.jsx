import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllFriendRequest, getAllYourFriendRequested, updateFriendStatus } from '~/apis';
import NoDataMessage from '../NoDataMessage';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '~/redux/user/userSlice';
import { FRONTEND_ROOT } from '~/utils/constants';
import connectionSignalR from '~/utils/signalRConnection';
import { toast } from 'react-toastify';

function YourRequestFriend() {
  const [listRequestedFriend, setListRequestedFriend] = useState([])
  const [reload, setReload] = useState(false)
  const currentUser = useSelector(selectCurrentUser)
  const { t } = useTranslation()

  useEffect(() => {
    getAllYourFriendRequested().then(data => setListRequestedFriend(data))
  }, [reload])

  const handleResponse = (data_) => {
    const data = {
      ...data_
    }
    updateFriendStatus(data)
      .then((data) => {
        setReload(!reload)
        toast.success('Cancelled request!')
      })
    // .then(forceUpdate)
  }

  return (
    <div className='w-full '>
      <div className='p-4'>
        <div className='mb-4'>
          <span className='text-xl font-bold'>{t('standard.friend.yourRequest')}</span>
        </div>
        <div className='grid grid-cols-12 gap-x-2'>
          {
            listRequestedFriend?.map(friend => (
              <div key={friend?.userId} className='bg-white col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3 h-[300px] rounded-md flex flex-col'>
                <Link to={`/profile?id=${friend?.userId}`}>
                  <img
                    className='w-full h-[205px] object-cover rounded-t-md'
                    src={friend?.avata || '../src/assets/img/avatar_holder.png'}
                  />
                </Link>
                <div className='p-3 h-full flex flex-col'>
                  <span className='font-bold capitalize'>{friend?.userName}</span>
                  <div className=' flex flex-col gap-2 h-full justify-end items-center'>
                    <div className='text-blue-500 bg-blue-100 hover:bg-blue-200 cursor-pointer w-full flex justify-center rounded-md'
                      onClick={() => handleResponse({
                        confirm: false,
                        cancle: true,
                        reject: false,
                        friendId: friend?.userId
                      })}
                    >
                      <span className='my-2 font-bold flex'>{t('standard.profile.cancelRequest')}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
        {
          listRequestedFriend?.length == 0 &&
          <NoDataMessage message={t('standard.friend.noYourRequest')} />
        }
      </div>

    </div>
  )
}

export default YourRequestFriend
