import { Button, Modal } from '@mui/material'
import { IconX } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { commentGroupPost, commentGroupSharePost, getGroupPostComment, getGroupSharePostComment } from '~/apis/groupPostApis'
import { commentPost, commentSharePost, getComment, getSharePostComment } from '~/apis/postApis'
import Post from '~/components/ListPost/Post/Post'
import PostComment from '~/components/ListPost/Post/PostContent/PostComment/PostComment'
import PostContents from '~/components/ListPost/Post/PostContent/PostContents'
import PostMedia from '~/components/ListPost/Post/PostContent/PostMedia'
import PostReactStatus from '~/components/ListPost/Post/PostContent/PostReactStatus'
import PostTitle from '~/components/ListPost/Post/PostContent/PostTitle'
import Tiptap from '~/components/TitTap/TitTap'
import UserAvatar from '~/components/UI/UserAvatar'
import { selectCurrentActiveListPost, updateCurrentActiveListPost } from '~/redux/activeListPost/activeListPostSlice'
import { clearAndHireCurrentActivePost, reLoadComment, selectCommentFilterType, selectCurrentActivePost, selectIsShowModalActivePost, selectPostReactStatus, showModalActivePost, triggerReloadComment, updateCurrentActivePost } from '~/redux/activePost/activePostSlice'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { EDITOR_TYPE, POST_TYPES } from '~/utils/constants'
import connectionSignalR from '~/utils/signalRConnection'

function ActivePost({ isReportPost = false }) {
  const isShowActivePost = useSelector(selectIsShowModalActivePost)
  const currentActivePost = useSelector(selectCurrentActivePost)
  const currentActiveListPost = useSelector(selectCurrentActiveListPost)
  const postReactStatus = useSelector(selectPostReactStatus)
  const currentUser = useSelector(selectCurrentUser)
  const dispatch = useDispatch()
  const commentFilterType = useSelector(selectCommentFilterType)
  const { t } = useTranslation()
  const postType = currentActivePost?.postType
  const isProfile = postType == POST_TYPES.PROFILE_POST
  const isShare = postType == POST_TYPES.SHARE_POST
  const isGroup = postType == POST_TYPES.GROUP_POST
  const isGroupShare = postType == POST_TYPES.GROUP_SHARE_POST
  const isYourPost = currentActivePost?.userId == currentUser?.userId
  const { handleSubmit } = useForm()
  const [content, setContent] = useState('')
  const [listMedia, setListMedia] = useState([])
  const [listComment, setListComment] = useState([])
  const reloadComment = useSelector(reLoadComment)

  let postId = ''
  let url = ''
  if (isProfile) {
    postId = currentActivePost?.userPostId || currentActivePost?.postId
    url = `/post/${postId}?share=0`
  } else if (isShare) {
    postId = currentActivePost?.sharePostId || currentActivePost?.postId
    url = `/post/${postId}?share=1`
  } else if (isGroup) {
    postId = currentActivePost?.groupPostId || currentActivePost?.postId
    url = `/groups/${currentActivePost?.groupId}/post/${postId}?share=0`
  } else if (isGroupShare) {
    postId = currentActivePost?.groupSharePostId || currentActivePost?.postId
    url = `/groups/${currentActivePost?.groupId}/post/${postId}?share=1`
  }

  let postShareType = ''
  let postShareData = ''
  if (currentActivePost?.isShare) {
    if (currentActivePost?.userPostShareId) {
      postShareType = POST_TYPES.PROFILE_POST
      postShareData = { ...currentActivePost?.userPostShare, userName: currentActivePost?.userNameShare, avatar: currentActivePost?.userAvatarShare }
    } else if (currentActivePost?.userPostVideoShareId) {
      postShareType = POST_TYPES.VIDEO_POST
      postShareData = { ...currentActivePost?.userPostVideoShare, userName: currentActivePost?.userNameShare, avatar: currentActivePost?.userAvatarShare }
    } else if (currentActivePost?.userPostPhotoShareId) {
      postShareType = POST_TYPES.PHOTO_POST
      postShareData = { ...currentActivePost?.userPostPhotoShare, userName: currentActivePost?.userNameShare, avatar: currentActivePost?.userAvatarShare }
    } else if (currentActivePost?.groupPostShareId) {
      postShareType = POST_TYPES.GROUP_POST
      postShareData = { ...currentActivePost?.groupPostShare, userName: currentActivePost?.userNameShare, avatar: currentActivePost?.userAvatarShare, groupName: currentActivePost?.groupShareName, groupCorverImage: currentActivePost?.groupShareCorverImage }
    }
    else if (currentActivePost?.groupPostPhotoShareId) {
      postShareType = POST_TYPES.GROUP_PHOTO_POST
      postShareData = { ...currentActivePost?.groupPostPhotoShare, userName: currentActivePost?.userNameShare, avatar: currentActivePost?.userAvatarShare, groupName: currentActivePost?.groupShareName, groupCorverImage: currentActivePost?.groupShareCorverImage }
    } else {
      postShareType = POST_TYPES.GROUP_VIDEO_POST
      postShareData = { ...currentActivePost?.groupPostVideoShare, userNameShare: currentActivePost?.userNameShare, avatar: currentActivePost?.userAvatarShare, groupName: currentActivePost?.groupShareName, groupCorverImage: currentActivePost?.groupShareCorverImage }
    }
  }

  useEffect(() => {
    if (!isReportPost) {
      isProfile ? getComment(currentActivePost?.postId || currentActivePost?.userPostId, commentFilterType).then(data => setListComment(data?.posts))
        : isShare ? getSharePostComment(currentActivePost?.postId || currentActivePost?.sharePostId, commentFilterType).then(data => setListComment(data?.posts))
          : isGroup ? getGroupPostComment(currentActivePost?.groupPostId || currentActivePost?.postId, commentFilterType).then(data => setListComment(data?.posts))
            : isGroupShare && getGroupSharePostComment(currentActivePost?.postId || currentActivePost?.groupSharePostId, commentFilterType).then(data => setListComment(data?.posts))
    }

  }, [reloadComment, commentFilterType])
  // console.log(currentActivePost)
  const replaceRegex = (html) => {
    return html?.replace(/<!--MEDIA:(video|image):(.+?)-->/g, '')
  }
  const handleCommentPost = () => {
    const submitData = {
      'userId': currentUser?.userId,
      'content': listMedia?.length > 0 ? `${replaceRegex(content)}<!--MEDIA:${listMedia[0]?.type}:${listMedia[0]?.url}-->` : replaceRegex(content),
      'parentCommentId': null,
      ...(
        isProfile ? { 'userPostId': currentActivePost?.userPostId || currentActivePost?.postId }
          : isShare ? { 'sharePostId': currentActivePost?.sharePostId || currentActivePost?.postId }
            : isGroup ? { 'groupPostId': currentActivePost?.groupPostId || currentActivePost?.postId }
              : isGroupShare && { 'groupSharePostId': currentActivePost?.groupSharePostId || currentActivePost?.postId }
      )
    }
    toast.promise(
      (isProfile ? commentPost(submitData)
        : isShare ? commentSharePost(submitData)
          : isGroup ? commentGroupPost(submitData)
            : isGroupShare && commentGroupSharePost(submitData)),
      { pending: 'Posting...' }
    ).then(() => {
      const signalRData = {
        MsgCode: 'User-007',
        Receiver: `${currentActivePost?.userId}`,
        Url: url,
        AdditionsMsd: '',
        ActionId: 'spam'
      }
      connectionSignalR.invoke('SendNotify', JSON.stringify(signalRData))
      toast.success('Commented')
    }).then(() => { dispatch(triggerReloadComment()), setContent(''), setListMedia([]) })
      .then(() => dispatch(updateCurrentActivePost({ ...currentActivePost, reactCount: { ...currentActivePost?.reactCount, commentNumber: currentActivePost?.reactCount?.commentNumber + 1 } })))
      .then(() => {
        const updatedPosts = currentActiveListPost.map(post =>
          post.postId === currentActivePost.postId
            ? {
              ...currentActivePost,
              reactCount: {
                ...currentActivePost.reactCount,
                commentNumber: currentActivePost.reactCount.commentNumber + 1
              }
            }
            : post
        );
        dispatch(updateCurrentActiveListPost(updatedPosts));
      })
  }

  return (
    <>
      <Modal
        open={isShowActivePost}
        onClose={() => dispatch(clearAndHireCurrentActivePost())}
      >
        <div className='flex flex-col items-center gap-3 w-[95%] lg:w-[900px] max-h-[90%] absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2
        h-[90%] bg-white border-gray-300 shadow-md rounded-md overflow-y-auto scrollbar-none-track'>
          <div id='post-detail-author'
            className='h-[60px] w-full flex justify-between items-center px-4'>
            <div></div>
            <span className='font-bold font-sans text-xl capitalize'>
              {t('standard.newPost.userPost', { name: currentActivePost?.userName || currentActivePost?.fullName })}
              {/* {(currentActivePost?.userName || currentActivePost?.fullName)}&apos; Post */}
            </span>
            <div className='cursor-pointer' onClick={() => dispatch(clearAndHireCurrentActivePost())}>
              <IconX className='text-white bg-orangeFpt rounded-full' />
            </div>
          </div>
          <div
            className="w-full h-[80%] flex flex-col items-center gap-2 border p-4  overflow-y-auto scrollbar-none-track">
            <PostTitle postData={currentActivePost} postType={postType} isYourPost={isYourPost} />
            <PostContents postData={currentActivePost} postType={postType} />
            {
              currentActivePost?.isShare && <div
                id='media-share'
                className='w-[90%] border p-1 rounded-md mb-2'>
                <PostMedia postData={postShareData} postType={postShareType} />
                <PostTitle postData={postShareData} isYourPost={false} postType={postShareType} />
                <PostContents postData={postShareData} postType={postShareType} />
              </div>
            }
            {!currentActivePost?.isShare && <PostMedia postData={currentActivePost} postType={postType} />}
            {/* <PostMedia postData={currentActivePost} postType={postType} /> */}
            {
              !isReportPost && <>
                <PostReactStatus postData={currentActivePost} postType={postType} postReact={postReactStatus} />
                <PostComment comment={listComment} postType={postType} />
              </>
            }

          </div>
          {
            !isReportPost && <form onSubmit={handleSubmit(handleCommentPost)} className='mb-4 w-full flex gap-2 px-4'>
              <UserAvatar isOther={false} />
              <div className='rounded-lg pt-2 w-full'>
                <Tiptap
                  setContent={setContent}
                  content={content}
                  listMedia={listMedia}
                  setListMedia={setListMedia}
                  editorType={EDITOR_TYPE.COMMENT}
                />
              </div>
            </form>
          }

        </div>
      </Modal>
    </>
  )
}

export default ActivePost