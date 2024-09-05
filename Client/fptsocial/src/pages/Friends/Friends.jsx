import NavTopBar from '~/components/NavTopBar/NavTopBar'
import { useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import FriendRequests from './FriendRequests/FriendRequests'
import FriendSuggestions from './FriendSuggestions/FriendSuggestions'
import FriendList from './FriendList/FriendList'
import FriendsSideBar from './FriendsSideBar/FriendsSideBar'
import YourRequestFriend from './YourRequest/YourRequestFriend'


function Friends() {
  const location = useLocation()
  const navigate = useNavigate()
  useEffect(() => {
    if (location.pathname === '/friends') {
      navigate('/friends/requests', { replace: true });
    }
  }, [location, navigate]);

  const isRequests = location.pathname === '/friends/requests'
  const isSendedRequests = location.pathname === '/friends/sendrequests'
  const isSuggestions = location.pathname === '/friends/suggestions'
  const isFriendList = location.pathname === '/friends/list'
  const [listPost, setListPost] = useState(null)
  // useEffect(() => {
  //   // Call API
  //   getAllPost().then(data => {
  //     // console.log('🚀 ~ getAllPost ~ data:', data)
  //     setListPost(data)
  //   })
  // }, [])
  return (
    <>
      <NavTopBar />
      <div className='flex h-[calc(100vh_-_55px)] bg-whites'>
        <FriendsSideBar isFriendList={isFriendList} isRequests={isRequests} isSuggestions={isSuggestions} isSendedRequests={isSendedRequests} />
        <div className='flex h-[calc(100vh_-_55px)] bg-fbWhite w-full overflow-y-auto'>
          {isRequests && <FriendRequests />}
          {isSuggestions && <FriendSuggestions />}
          {isFriendList && <FriendList />}
          {isSendedRequests && <YourRequestFriend />}
        </div>
      </div>
    </>
  )
}

export default Friends
