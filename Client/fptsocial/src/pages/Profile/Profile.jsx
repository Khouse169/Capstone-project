import { useEffect, useState } from 'react'
import NavTopBar from '~/components/NavTopBar/NavTopBar'
import TopProfile from './TopProfile/TopProfile'
import ContentProfile from './ContentProfile/ContentProfile'
import UpdateProfile from './UpdateProfile/UpdateProfile'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Modal } from '@mui/material'
import { getAllFriend, getAllFriendOtherProfile, getBlockedUserList, getButtonFriend, getOtherUserByUserId } from '~/apis'
import { getOtherUserPost, getUserPostByUserId } from '~/apis/postApis'
import { selectIsReload, triggerReload } from '~/redux/ui/uiSlice'
import { clearCurrentActiveListPost } from '~/redux/activeListPost/activeListPostSlice'

function Profile() {
  const [update, setUpdate] = useState(false)
  const [userProfile, setUserProfile] = useState(null)
  const [buttonProfile, setButtonProfile] = useState({})
  const [isOpenModalUpdateProfile, setIsOpenModalUpdateProfile] = useState(false)
  const [listFriend, setListFriend] = useState([])
  const [blockedUserList, setBlockedUserList] = useState([])
  const dispatch = useDispatch()

  const currentUser = useSelector(selectCurrentUser)
  const isReload = useSelector(selectIsReload)
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const currentUserId = currentUser?.userId
  const paramUserId = searchParams.get('id')
  const isYourProfile = currentUserId == paramUserId

  const forceUpdate = () => setUpdate(!update)

  useEffect(() => {
    dispatch(clearCurrentActiveListPost())
  }, [])

  useEffect(() => {
    if (isYourProfile) {
      setUserProfile(currentUser)
      getAllFriend().then(data => setListFriend(data))
    }
    else {
      getOtherUserByUserId({ userId: currentUserId, viewUserId: paramUserId })
        .then(res => setUserProfile(res))
        .catch(() => navigate('/notavailable'))
      getAllFriendOtherProfile(paramUserId).then(data => setListFriend(data))
    }
    getBlockedUserList().then(data => setBlockedUserList(data))
  }, [paramUserId, isReload, currentUser])

  useEffect(() => {
    userProfile && getButtonFriend(currentUser?.userId, userProfile.userId)
      .then(res => setButtonProfile(res))
  }, [update, userProfile])

  return (
    <>
      <div className="relative">
        <NavTopBar />
        <div className="">
          <TopProfile listFriend={listFriend} setIsOpenModalUpdateProfile={setIsOpenModalUpdateProfile} user={userProfile} currentUser={currentUser} buttonProfile={buttonProfile} forceUpdate={forceUpdate} />
          <ContentProfile user={userProfile} blockedUserList={blockedUserList} />
        </div>
        <Modal
          open={isOpenModalUpdateProfile}
          onClose={() => setIsOpenModalUpdateProfile(false)}
          sx={{ overflowY: 'auto' }}
        >
          <div className='bg-white w-full md:w-fit absolute rounded-md  left-1/2 -translate-x-1/2 mt-5 '>
            <UpdateProfile user={userProfile} onClose={close} setIsOpenModalUpdateProfile={setIsOpenModalUpdateProfile} />
          </div>
        </Modal>
      </div >
    </>
  )
}

export default Profile;