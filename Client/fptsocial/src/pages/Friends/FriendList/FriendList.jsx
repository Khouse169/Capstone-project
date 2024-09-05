import { IconMessage } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getAllFriend, updateFriendStatus } from '~/apis'
import NoDataMessage from '../NoDataMessage'
import { useTranslation } from 'react-i18next'
import { useConfirm } from 'material-ui-confirm'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { toast } from 'react-toastify'

function FriendList() {
  const [listFriend, setListFriend] = useState([])
  const { t } = useTranslation()
  const currentUser = useSelector(selectCurrentUser)
  const [reload, setReload] = useState(false)

  useEffect(() => {
    getAllFriend().then(data => setListFriend(data?.allFriend))
  }, [reload])

  const confirmUnfriend = useConfirm()

  const handleResponse = (data_) => {
    const data = {
      userId: currentUser?.userId,
      ...data_
    }
    updateFriendStatus(data)
      .then(() => {
        setReload(!reload)
        toast.success('Friend removed!')
      })

  }
  const openDeleteModal = (data) =>
    confirmUnfriend({
      title: 'Unfriend this account?',
      description: 'Are you sure want to remove this account from friend list?',
      confirmationText: 'Not anymore',
      cancellationText: 'Continue friend forever'
    })
      .then(() =>
        handleResponse(data)
      )
      .catch(() => { })


  return (
    <div className='w-full'>
      <div className='p-4'>
        <div className='mb-4'>
          <span className='text-xl font-bold'>{t('standard.friend.listFriend')}</span>
        </div>
        <div className='grid grid-cols-12 gap-x-2'>
          {
            listFriend?.map(friend => (
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
                    <div className='text-blue-500 bg-blue-100 hover:bg-blue-200 cursor-pointer w-full flex justify-center rounded-md'>
                      <Link to={'/chats-page'} className='my-2 font-bold flex'><IconMessage />{t('standard.friend.sendMessage')}</Link>
                    </div>
                    <div className='text-red-500 bg-red-100 hover:bg-red-200 cursor-pointer w-full flex justify-center rounded-md'
                      onClick={() => openDeleteModal({
                        confirm: false,
                        cancle: false,
                        reject: true,
                        friendId: friend?.friendId
                      })}
                    >
                      <span className='my-2 font-bold'>{t('standard.friend.unFriend')}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
        {
          listFriend?.length == 0 &&
          <NoDataMessage message={t('standard.friend.noFriend')} />
        }
      </div>

    </div>
  )
}

export default FriendList
