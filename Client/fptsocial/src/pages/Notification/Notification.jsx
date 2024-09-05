import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getNotificationsListByUserId, updateReadNotification } from '~/apis';
import InfiniteScroll from '~/components/IntersectionObserver/InfiniteScroll';
import NavTopBar from '~/components/NavTopBar/NavTopBar';
import UserAvatar from '~/components/UI/UserAvatar';
import { compareDateTime } from '~/utils/formatters';

function Notification() {
  const [listNotification, setListNotification] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [unRead, setUnRead] = useState(false)

  useEffect(() => {
    getNotificationsListByUserId({ page }).then((data) => {
      if (data?.length == 0) { setHasMore(false) }
      else
        setListNotification((prev => [...prev, ...data]))
    })
  }, [page])

  const handleCheckReadNotification = (notificationId) => {
    updateReadNotification(notificationId)
  }

  return (<>
    <NavTopBar />
    <div className='bg-fbWhite w-screen min-h-screen flex justify-center'>
      <div className='w-full flex justify-center mt-4'>
        <InfiniteScroll
          fetchMore={() => setPage(prev => prev + 1)}
          hasMore={hasMore}
          className={'min-h-[900px] w-[90%] md:w-[40%] bg-white shadow-lg rounded-lg'}
        >
          <div className='p-3 shrink-0'>
            <div className='font-bold flex justify-between'>
              <span>Notification</span>
              <div className='flex gap-2'>
                <span to='/notifications'
                  onClick={() => setUnRead(false)}
                  className={`cursor-pointer w-16 text-center text-sm font-semibold text-blue-500 hover:bg-blue-100/90 rounded-md py-1 px-2 ${!unRead && 'bg-blue-100/90'}`}>
                  All
                </span>
                <span to='/notifications'
                  onClick={() => setUnRead(true)}
                  className={`cursor-pointer w-16 text-center text-sm font-semibold text-orangeFpt hover:bg-orange-100/90 rounded-md py-1 px-2 ${unRead && 'bg-orange-100/90'}`}>
                  Unread
                </span>
              </div>
            </div>
            <div className='py-2 flex flex-col gap-2'>
              {
                listNotification?.map((notification, i) => {
                  if ((unRead && !notification?.isRead) || (!unRead))
                    return <Link to={notification?.url} onClick={() => handleCheckReadNotification(notification?.notificationId)} key={i} className='flex items-center gap-2 min-h-12 hover:bg-fbWhite-500 rounded-md p-1 w-full'>
                      <UserAvatar avatarSrc={notification?.senderAvatar} size='2' isOther='true' />
                      <div className='flex flex-col w-full'>
                        <div className='flex gap-1 text-xs justify-between items-center'>
                          <span>
                            <span className='font-bold capitalize'>{notification?.senderName}</span>
                            {notification?.message}
                          </span>
                          {!notification?.isRead && <div className='size-2 min-w-2 bg-blue-500 rounded-full'></div>}
                        </div>
                        <span className='text-blue-500 font-semibold text-xs'>{compareDateTime(notification?.createdAt)}</span>
                      </div>
                    </Link>
                })
              }
            </div>
          </div>
        </InfiniteScroll>
      </div>

    </div>


  </>
  )
}

export default Notification;
