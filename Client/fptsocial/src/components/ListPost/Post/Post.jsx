import { useDispatch, useSelector } from 'react-redux'
import PostComment from './PostContent/PostComment/PostComment'
import PostContents from './PostContent/PostContents'
import PostMedia from './PostContent/PostMedia'
import PostReactStatus from './PostContent/PostReactStatus'
import PostTitle from './PostContent/PostTitle'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { POST_TYPES } from '~/utils/constants'
import { useLocation } from 'react-router-dom'
import { getAllReactByPhotoPostId, getAllReactByPostId, getAllReactBySharePostId, getAllReactByVideoPostId } from '~/apis/reactApis'
import { getAllReactByGroupPhotoPostId, getAllReactByGroupPostId, getAllReactByGroupSharePostId, getAllReactByGroupVideoPostId } from '~/apis/groupPostApis'
import { useEffect, useState } from 'react'
import { cloneDeep } from 'lodash'
import { selectCurrentActiveListPost, updateCurrentActiveListPost } from '~/redux/activeListPost/activeListPostSlice'

function Post({ postData, isBan = false, isAdmin = false }) {
  // console.log('🚀 ~ Post ~ postData:', postData)
  const currentUser = useSelector(selectCurrentUser)
  const currentActiveListPost = useSelector(selectCurrentActiveListPost)
  const isYourPost = postData?.userId == currentUser?.userId
  const location = useLocation()
  const isInGroupPath = /^\/groups\/\w+\/?.*$/.test(location.pathname)

  let postType = ''
  if (postData?.isGroupPost || isInGroupPath || postData?.groupId) {
    if (postData?.isShare) postType = POST_TYPES.GROUP_SHARE_POST
    else postType = POST_TYPES.GROUP_POST
  } else if (postData?.isShare) postType = POST_TYPES.SHARE_POST
  else postType = POST_TYPES.PROFILE_POST

  let postShareType = ''
  let postShareData = ''
  if (postData?.isShare) {
    if (postData?.userPostShareId) {
      postShareType = POST_TYPES.PROFILE_POST
      postShareData = { ...postData?.userPostShare, userName: postData?.userNameShare, avatar: postData?.userAvatarShare }
    } else if (postData?.userPostVideoShareId) {
      postShareType = POST_TYPES.VIDEO_POST
      postShareData = { ...postData?.userPostVideoShare, userName: postData?.userNameShare, avatar: postData?.userAvatarShare }
    } else if (postData?.userPostPhotoShareId) {
      postShareType = POST_TYPES.PHOTO_POST
      postShareData = { ...postData?.userPostPhotoShare, userName: postData?.userNameShare, avatar: postData?.userAvatarShare }
    } else if (postData?.groupPostShareId) {
      postShareType = POST_TYPES.GROUP_POST
      postShareData = { ...postData?.groupPostShare, userName: postData?.userNameShare, avatar: postData?.userAvatarShare, groupName: postData?.groupShareName, groupCorverImage: postData?.groupShareCorverImage }
    }
    else if (postData?.groupPostPhotoShareId) {
      postShareType = POST_TYPES.GROUP_PHOTO_POST
      postShareData = { ...postData?.groupPostPhotoShare, userName: postData?.userNameShare, avatar: postData?.userAvatarShare, groupName: postData?.groupShareName, groupCorverImage: postData?.groupShareCorverImage }
    } else {
      postShareType = POST_TYPES.GROUP_VIDEO_POST
      postShareData = { ...postData?.groupPostVideoShare, userNameShare: postData?.userNameShare, avatar: postData?.userAvatarShare, groupName: postData?.groupShareName, groupCorverImage: postData?.groupShareCorverImage }
    }
  }
  const isProfile = postType == POST_TYPES.PROFILE_POST
  const isShare = postType == POST_TYPES.SHARE_POST
  const isPhoto = postType == POST_TYPES.PHOTO_POST
  const isVideo = postType == POST_TYPES.VIDEO_POST
  const isGroup = postType == POST_TYPES.GROUP_POST
  const isGroupShare = postType == POST_TYPES.GROUP_SHARE_POST
  const isGroupPhoto = postType == POST_TYPES.GROUP_PHOTO_POST
  const isGroupVideo = postType == POST_TYPES.GROUP_VIDEO_POST
  const dispatch = useDispatch()
  const isCanShare = postData?.groupStatus ? postData?.groupStatus?.groupStatusName == 'Public' : true

  // const [reactStatus, setReactStatus] = useState({})
  // const handleGetReact = async () => {
  //   const response = await (
  //     isPhoto ? getAllReactByPhotoPostId(postData?.userPostMediaId)
  //       : isVideo ? getAllReactByVideoPostId(postData?.userPostMediaId)
  //         : isProfile ? getAllReactByPostId(postData?.userPostId || postData?.postId)
  //           : isShare ? getAllReactBySharePostId(postData?.sharePostId || postData?.postId)
  //             : isGroup ? getAllReactByGroupPostId(postData?.groupPostId || postData?.postId)
  //               : isGroupShare ? getAllReactByGroupSharePostId(postData?.groupSharePostId || postData?.postId)
  //                 : isGroupPhoto ? getAllReactByGroupPhotoPostId(postData?.groupPostMediaId)
  //                   : isGroupVideo && getAllReactByGroupVideoPostId(postData?.groupPostMediaId)
  //   )
  //   let newPostData = cloneDeep(postData)
  //   newPostData = { ...newPostData, postReactStatus: response }
  //   dispatch(updateCurrentActiveListPost(currentActiveListPost?.map(e => e?.postId == newPostData.postId ? newPostData : e)))
  //   // setReactStatus(response)
  // }
  // useEffect(() => {
  //   if (Object.keys(postData).length > 0)
  //     handleGetReact()
  // }, [postData])
  // const handleUpdateReactStatus = (newReactStatus) => {
  //   setReactStatus(newReactStatus)
  // }

  return (
    <div id="post"
      className="w-full lg:w-[600px] flex flex-col items-center bg-white shadow-lg rounded-lg">
      <PostTitle postData={postData} isYourPost={isYourPost} postType={postType} isBan={isBan} isAdmin={isAdmin} />
      <PostContents postData={postData} postType={postType} isBan={isBan} />
      {
        postData?.isShare && <div
          id='media-share'
          className={`w-[90%] border p-1 rounded-md mb-2 ${isBan && 'pointer-events-none'}`}>
          <PostMedia postData={postShareData} postType={postShareType} />
          <PostTitle postData={postShareData} isYourPost={false} postType={postShareType} />
          <PostContents postData={postShareData} postType={postShareType} />
        </div>
      }
      {!postData?.isShare && <PostMedia postData={postData} postType={postType} isAdmin={isAdmin} />}
      {
        !isBan &&
        <PostReactStatus postData={postData} postType={postType} postShareData={postShareData} postShareType={postShareType} isCanShare={isCanShare} />
      }
      {/* <PostComment postData={postData} /> */}
    </div>
  )

}
export default Post