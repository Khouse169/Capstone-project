import { Chip } from '@mui/material'
import { IconCake, IconHeartFilled, IconHomeFilled, IconManFilled, IconUser } from '@tabler/icons-react'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { getBannedPostByUserId, getOtherUserPost, getUserPostByUserId } from '~/apis/postApis'
import ListPost from '~/components/ListPost/ListPost'
import Post from '~/components/ListPost/Post/Post'
// import UpdatePost from '~/components/Modal/ActivePost/UpdatePost'
import NewPost from '~/components/Modal/NewPost/NewPost'
import SearchNotFound from '~/components/UI/SearchNotFound'

// import { selectIsShowModalUpdatePost } from '~/redux/activePost/activePostSlice'
import { selectIsReload } from '~/redux/ui/uiSlice'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { POST_TYPES } from '~/utils/constants'
import InfoItem from './InforItem'

function ProfilePosts({ user }) {
  const { t } = useTranslation()
  const [listBannedPost, setListBannedPost] = useState([])
  const currentUser = useSelector(selectCurrentUser)
  const isYourProfile = user?.userId == currentUser?.userId
  const [isBan, setIsBan] = useState(false)
  // const isShowUpdatePost = useSelector(selectIsShowModalUpdatePost)
  const isReload = useSelector(selectIsReload)

  useEffect(() => {
    isYourProfile && user ?
      getBannedPostByUserId({ page: 1 }).then(data => {
        setListBannedPost(data?.result)
      })
      : setListBannedPost([])
  }, [user, isReload])

  const getUserPostFn = useCallback(({ page, pageSize }) => {
    if (!user) return () => Promise.resolve([])
    return (isBan && isYourProfile) ? getBannedPostByUserId({ page: page, pageSize })
      : isYourProfile
        ? getUserPostByUserId({ page, pageSize })
        : getOtherUserPost({ userId: user.userId, page, pageSize })
  }, [user, isBan, isYourProfile])

  return (
    <div id=''
      className='flex flex-col items-center lg:flex-row lg:justify-center lg:items-start w-full gap-3 bg-fbWhite'>
      <div
        id='info'
        className={`lg:sticky top-16 w-full   ${isYourProfile && 'mt-8'} lg:w-[600px] lg:basis-3/12 h-fit bg-white  rounded-md shadow-md`}>
        <div className='flex flex-col p-4 gap-3'>
          <h3 className='text-xl font-bold'>{t('standard.profile.about')}</h3>
          <InfoItem Icon={IconUser} label={''} value={user?.firstName + ' ' + user?.lastName} />
          <InfoItem Icon={IconHomeFilled} label={t('standard.profile.live')} value={user?.homeTown} />
          <InfoItem Icon={IconManFilled} label={t('standard.profile.gender')} value={user?.userGender?.genderName} />
          <InfoItem Icon={IconHeartFilled} label={t('standard.profile.relationship')} value={user?.userRelationship?.relationshipName} />
          <InfoItem Icon={IconCake} label={t('standard.profile.birthday')} value={new Date(user?.birthDay).toLocaleDateString()} />
        </div>
      </div>
      <div className={`flex flex-col items-center ${isYourProfile && 'gap-3'} w-full lg:w-fit `}>
        <div className='w-full lg:w-[600px]'>
          {
            isYourProfile && <NewPost postType={POST_TYPES.PROFILE_POST} />
          }
        </div>
        <div className='flex flex-col items-center w-full'>
          {
            isYourProfile &&
            <div className='flex gap-2 pb-2'>
              {/* {isShowUpdatePost && <UpdatePost />} */}
              <Chip label="Your posts" color={isBan ? 'default' : 'primary'} onClick={() => setIsBan(false)} />
              <div
                onClick={() => setIsBan(true)}
                className={`inline-flex border-2 border-white relative items-center px-3 py-1 rounded-full text-sm font-medium cursor-pointer transition-colors duration-200 ease-in-out
                    ${isBan ? 'bg-orangeFpt text-white hover:bg-orange-700' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
              >
                Banned posts
                {
                  listBannedPost?.length > 0 &&
                  <div className='absolute top-0 -right-1 size-3 bg-red-500 rounded-full border-2 border-white'></div>
                }
              </div>
            </div>
          }
          {/* {
            isBan && <div className='flex flex-col gap-4 w-full min-w-[300px]'>
              {
                listBannedPost?.map(bp => (
                  <Post postData={bp} type="ban" key={bp?.postId} />
                ))
              }
              {
                listBannedPost?.length == 0 && <SearchNotFound isNoneData={true} />
              }
            </div>
          } */}
          {
            <>
              {
                user && <ListPost getListPostFn={getUserPostFn} isBan={isBan} />
              }
            </>
          }
        </div>
      </div>
    </div >
  )
}

export default ProfilePosts
