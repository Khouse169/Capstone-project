import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Button, Tab, Tabs } from '@mui/material';
import { IconSearch } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { cancelBlockUser, getAllFriend, getAllFriendOtherProfile, searchFriendByName } from '~/apis';
import GroupAvatar from '~/components/UI/GroupAvatar';
import UserAvatar from '~/components/UI/UserAvatar';
import { useDebounceFn } from '~/customHooks/useDebounceFn';
import NoDataMessage from '~/pages/Friends/NoDataMessage';
import { triggerReload } from '~/redux/ui/uiSlice';
import { selectCurrentUser } from '~/redux/user/userSlice';
import userImg from '~/assets/img/banUser.png'

function FriendProfile({ user, blockedUserList }) {
  const [listFriend, setListFriend] = useState([])
  const currentUser = useSelector(selectCurrentUser)
  const isYourProfile = currentUser?.userId == user?.userId
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()
  const [value, setValue] = useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue)
  };
  const handleInputSearchChange = (event) => {
    const searchValue = event.target?.value
    if (!searchValue) return

    // const searchPath = `?${createSearchParams({ 'q[title]': searchValue })}`

    setLoading(true)
    searchFriendByName({ search: searchValue, accUserId: user?.userId, userId: currentUser?.userId })
      .then(res => {
        console.log('🚀 ~ handleInputSearchChange ~ res:', res.getFriendByName)

        setListFriend(res?.getFriendByName)
      })
      .finally(() => {
        setLoading(false)
      })
  }
  const debounceSearchBoard = useDebounceFn(handleInputSearchChange, 1000)


  useEffect(() => {
    isYourProfile ? getAllFriend().then(data => setListFriend(data?.allFriend))
      : getAllFriendOtherProfile(user?.userId).then(data => setListFriend(data?.allFriend))
  }, [user])

  const dispatch = useDispatch()
  const handleUnblock = (id) => {
    const submitData = {
      "userId": currentUser?.userId,
      "blockedUserId": id
    }
    cancelBlockUser(submitData).then(() => dispatch(triggerReload()))
  }

  return (
    <div className=' w-full flex justify-center min-h-[300px]'>
      <div className='w-[95%] sm:w-[600px] bg-white rounded-md p-2'>
        <div className='flex flex-col '>
          <div className='flex justify-between'>
            <div className="relative text-gray-600" >
              <input className="w-full bg-fbWhite h-10 px-5 pr-16 rounded-xl text-sm font-light focus:outline-none"
                type="search" placeholder="Search"
                onChange={debounceSearchBoard}
              />
              <span className='absolute right-2 top-1/2 -translate-y-1/2'><IconSearch className='text-orangeFpt' /></span>
            </div>
          </div>

          <Box sx={{ width: '100%', typography: 'body1' }}>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList onChange={handleChange} aria-label="lab API tabs example">
                  <Tab label={t('standard.profile.friend')} value="1" />
                  {isYourProfile && <Tab label={t('standard.profile.blockUser')} value="2" />}
                </TabList>
              </Box>
              <TabPanel value="1">
                <div className='grid grid-cols-2 gap-2'>
                  {listFriend?.map((friend) => (
                    <Link
                      to={`/profile?id=${friend?.friendId}`}
                      key={friend?.friendId}
                      className='col-span-2 sm:col-span-1 flex gap-4 p-2 border rounded-lg hover:bg-fbWhite'
                    >
                      <GroupAvatar
                        avatarSrc={friend?.avata || './src/assets/img/avatar_holder.png'}
                        isOther={true}
                        size={20}
                      />
                      <div className='flex flex-col gap-2'>
                        <span className='capitalize font-semibold'>{friend?.friendName}</span>
                        <span>{friend?.mutualFriends} {t('sideText.mutualFriend')}</span>
                      </div>
                    </Link>
                  ))}
                </div>
                {
                  listFriend?.length == 0 && <NoDataMessage message={t('standard.friend.noFriend')} />
                }
              </TabPanel>
              <TabPanel value="2">
                <div className='grid grid-cols-2 gap-2'>
                  {blockedUserList?.map((e) => (
                    <div
                      key={e?.userBlockedId}
                      className='col-span-2 sm:col-span-1 flex gap-4 p-2 border rounded-lg hover:bg-fbWhite'
                    >
                      <GroupAvatar
                        avatarSrc={e?.avata || './src/assets/img/avatar_holder.png'}
                        isOther={true}
                        size={20}
                      />
                      <div className='flex flex-col gap-2'>
                        <span className='capitalize font-semibold'>{e?.fullName}</span>
                        <Button onClick={() => handleUnblock(e?.userBlockedId)} variant='contained' color='warning' size='small'>{t('standard.profile.unblockUserMes')}</Button>
                      </div>
                    </div>
                  ))}
                </div>
                {
                  blockedUserList?.length == 0 && <div className='flex justify-center'>
                    <div className='flex flex-col items-center gap-2'>
                      <img src={userImg} className='size-20' />
                      <p className='text-lg text-gray-500/90'>{t('standard.friend.noBlock')} </p>
                    </div>
                  </div>
                }
              </TabPanel>
            </TabContext>
          </Box>
        </div>

      </div>

    </div >
  )
}

export default FriendProfile;
