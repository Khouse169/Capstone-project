import { Link, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import NavTopBar from '~/components/NavTopBar/NavTopBar'
import { Box, Button, TextField } from '@mui/material'
import { IconArticle, IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { getStatus } from '~/apis'
import { commentPhotoPost, commentPost, commentVideoPost, getChildPostById, getComment, getPhotoComment, getUserPostById, getVideoComment, updatePhotoPost, updateVideoPost } from '~/apis/postApis'
import PostComment from '~/components/ListPost/Post/PostContent/PostComment/PostComment'
import PostReactStatus from '~/components/ListPost/Post/PostContent/PostReactStatus'
import PostTitle from '~/components/ListPost/Post/PostContent/PostTitle'
import Tiptap from '~/components/TitTap/TitTap'
import UserAvatar from '~/components/UI/UserAvatar'
import { reLoadComment, selectCommentFilterType, selectCurrentActivePost, selectIsShowModalSharePost, selectIsShowModalUpdatePost, triggerReloadComment, updateCurrentActivePost } from '~/redux/activePost/activePostSlice'
import { selectCurrentUser } from '~/redux/user/userSlice'
import PostContents from '~/components/ListPost/Post/PostContent/PostContents'
import { getAllReactByPhotoPostId, getAllReactByPostId, getAllReactBySharePostId, getAllReactByVideoPostId, getAllReactType } from '~/apis/reactApis'
import { addListReactType } from '~/redux/sideData/sideDataSlice'
import { EDITOR_TYPE, POST_TYPES } from '~/utils/constants'
import { commentGroupPhotoPost, commentGroupPost, commentGroupVideoPost, getAllReactByGroupPhotoPostId, getAllReactByGroupPostId, getAllReactByGroupVideoPostId, getChildGroupPost, getGroupPhotoPostComment, getGroupPostByGroupPostId, getGroupPostComment, getGroupVideoPostComment, updateGroupPhotoPost, updateGroupVideoPost } from '~/apis/groupPostApis'
import Report from '~/components/Modal/Report/Report'
import { selectIsOpenReport } from '~/redux/report/reportSlice'
import { useTranslation } from 'react-i18next'
import UpdatePost from '~/components/Modal/ActivePost/UpdatePost'
import { selectIsReload } from '~/redux/ui/uiSlice'
import SharePost from '~/components/Modal/ActivePost/SharePost'

function Media() {
  const [searchParams] = useSearchParams()
  const postType = searchParams.get('type')
  const { photoId, videoId, postId } = useParams()
  const isPhoto = postType === POST_TYPES.PHOTO_POST
  const isVideo = postType === POST_TYPES.VIDEO_POST
  const isProfile = postType === POST_TYPES.PROFILE_POST
  const isGroup = postType === POST_TYPES.GROUP_POST
  const isGroupPhoto = postType === POST_TYPES.GROUP_PHOTO_POST
  const isGroupVideo = postType === POST_TYPES.GROUP_VIDEO_POST

  const isInStory = [POST_TYPES.PHOTO_POST, POST_TYPES.VIDEO_POST].includes(postType)
  // const isInGroup = [POST_TYPES.GROUP_PHOTO_POST, POST_TYPES.GROUP_VIDEO_POST].includes(postType)
  const currentActivePost = useSelector(selectCurrentActivePost)
  // const [currentActivePost, setPostData] = useState({})
  const [isEditContent, setIsEditContent] = useState(false)
  const [content, setContent] = useState()
  const currentUser = useSelector(selectCurrentUser)
  const dispatch = useDispatch()
  const [listStatus, setListStatus] = useState([])
  const [listMedia, setListMedia] = useState([])
  const [listComment, setListComment] = useState([])
  const commentFilterType = useSelector(selectCommentFilterType)
  const reloadComment = useSelector(reLoadComment)
  const [isYourPost, setIsYourPost] = useState(false)
  const isShowModalUpdate = useSelector(selectIsShowModalUpdatePost)
  const isShowModalShare = useSelector(selectIsShowModalSharePost)
  const { t } = useTranslation()
  const isReload = useSelector(selectIsReload)

  const { register, getValues, handleSubmit, setValue } = useForm()

  const navigate = useNavigate()
  const isShowModalReport = useSelector(selectIsOpenReport)

  const handleGetReact = async (postData) => {
    const response = await (
      isPhoto ? getAllReactByPhotoPostId(postData?.userPostMediaId)
        : isVideo ? getAllReactByVideoPostId(postData?.userPostMediaId)
          : isProfile ? getAllReactByPostId(postData?.userPostId || postData?.postId)
            : isGroup ? getAllReactByGroupPostId(postData?.groupPostId || postData?.postId)
              : isGroupPhoto ? getAllReactByGroupPhotoPostId(postData?.groupPostMediaId)
                : isGroupVideo && getAllReactByGroupVideoPostId(postData?.groupPostMediaId)
    )
    return response
  }

  useEffect(() => {
    getStatus().then(data => setListStatus(data))
    getAllReactType().then(data => dispatch(addListReactType(data)))
  }, [])

  useEffect(() => {
    if (postType) {
      (async () => {
        try {
          let responsePostData
          let responseCommentData
          let postReactStatus
          if (isProfile) {
            responsePostData = await getUserPostById(postId)
            responseCommentData = await getComment(postId, commentFilterType)

          } else if (isPhoto || isVideo) {
            responsePostData = await getChildPostById(videoId || photoId)
            responseCommentData = await (isPhoto ? getPhotoComment(photoId, commentFilterType)
              : isVideo && getVideoComment(videoId, commentFilterType))
          } else if (isGroup) {
            responsePostData = await getGroupPostByGroupPostId(postId)
            responseCommentData = await getGroupPostComment(postId, commentFilterType)
          } else if (isGroupPhoto || isGroupVideo) {
            responsePostData = await getChildGroupPost(videoId || photoId)
            responseCommentData = await (isGroupPhoto ? getGroupPhotoPostComment(photoId, commentFilterType)
              : isGroupVideo && getGroupVideoPostComment(videoId, commentFilterType))
          }
          if (responsePostData) {
            postReactStatus = await handleGetReact(responsePostData)
          }

          if (responseCommentData?.length == 0 || !responseCommentData) navigate('/notavailable')
          dispatch(updateCurrentActivePost({ ...responsePostData, postReactStatus: postReactStatus }))
          setListComment(responseCommentData?.posts)
          setValue('content', responsePostData?.content)
        } catch (error) {
          navigate('/notavailable')
        }
      })()
    } else navigate('/notavailable')
    setIsEditContent(false)
  }, [reloadComment, postType, photoId, videoId, postId, isReload, commentFilterType])

  useEffect(() => {
    setIsYourPost(currentUser?.userId == currentActivePost?.userId)
  }, [currentActivePost, postType])


  const replaceRegex = (html) => {
    return html?.replace(/<!--MEDIA:(video|image):(.+?)-->/g, '')
  }
  const handleCommentPost = () => {
    const submitData = {
      'userId': currentUser?.userId,
      'content': listMedia?.length > 0 ? `${replaceRegex(content || '')}<!--MEDIA:${listMedia[0]?.type}:${listMedia[0]?.url}-->` : replaceRegex(content),
      'parentCommentId': null,
      ...(
        isPhoto ? { 'userPostPhotoId': currentActivePost?.userPostMediaId }
          : isProfile ? { 'userPostId': currentActivePost?.userPostId }
            : isVideo ? { 'userPostVideoId': currentActivePost?.userPostMediaId }
              : isGroup ? { 'groupPostId': currentActivePost?.groupPostId }
                : isGroupPhoto ? { 'groupPostPhotoId': currentActivePost?.groupPostMediaId }
                  : isGroupVideo && { 'groupPostVideoId': currentActivePost?.groupPostMediaId }
      )
    }
    toast.promise(isProfile ? commentPost(submitData)
      : isPhoto ? commentPhotoPost(submitData)
        : isVideo ? commentVideoPost(submitData)
          : isGroup ? commentGroupPost(submitData)
            : isGroupPhoto ? commentGroupPhotoPost(submitData)
              : isGroupVideo && commentGroupVideoPost(submitData),
      { pending: 'Updating is in progress...' })
      .then(() => toast.success('Commented'))
      .finally(() => {
        dispatch(triggerReloadComment()), setContent(null), setListMedia([])
      })

  }
  const handleUpdateChildPostContent = () => {
    const submitData = {
      ...(isPhoto ? {
        'userPostPhotoId': photoId,
        'userPostId': currentActivePost?.userPostId
      }
        : isVideo ? {
          'userPostVideoId': videoId,
          'userPostId': currentActivePost?.userPostId
        }
          : isGroupPhoto ? {
            'groupPostPhotoId': photoId,
            'groupPostId': currentActivePost?.groupPostId
          }
            : isGroupVideo && {
              'groupPostVideoId': videoId,
              'groupPostId': currentActivePost?.groupPostId
            }
      ),
      'userId': currentUser?.userId,
      'content': getValues('content')
    }

    toast.promise(
      isPhoto ? updatePhotoPost(submitData)
        : isVideo ? updateVideoPost(submitData)
          : isGroupPhoto ? updateGroupPhotoPost(submitData)
            : isGroupVideo && updateGroupVideoPost(submitData),
      { pending: 'Updating...' })
      .then(() => toast.success('Updated!'))
      .finally(() => {
        dispatch(triggerReloadComment())
        setIsEditContent(false)
      })
  }

  return (
    <>
      <NavTopBar />
      {isShowModalReport && <Report />}
      {isShowModalUpdate && <UpdatePost />}
      {isShowModalShare && <SharePost />}
      <div className='flex flex-col lg:flex-row h-[calc(100vh_-_55px)]'>
        <div className='max-lg:h-1/2 lg:basis-8/12 bg-black flex justify-center relative'>
          {(isProfile || isGroup)
            ? (currentActivePost?.photo || currentActivePost?.groupPhoto)
              ? <img
                src={currentActivePost?.photo?.photoUrl || currentActivePost?.groupPhoto?.photoUrl}
                className='object-contain'
              />
              : <video
                src={currentActivePost?.video?.videoUrl || currentActivePost?.groupVideo?.videoUrl}
                className='object-contain'
                controls
                disablePictureInPicture
              />
            : (isPhoto || isGroupPhoto)
              ? <img
                src={currentActivePost?.photo?.photoUrl || currentActivePost?.groupPhoto?.photoUrl}
                className='object-contain'
              />
              : (isVideo || isGroupVideo)
              && <video
                src={isVideo ? currentActivePost?.video?.videoUrl : currentActivePost?.groupVideo?.videoUrl}
                className='object-contain'
                controls
                disablePictureInPicture
              />
          }
          {
            currentActivePost?.previousType && <Link
              className='absolute left-2 top-1/2 -translate-y-1/2 text-orangeFpt bg-white hover:bg-orange-100 rounded-full flex justify-center items-center'
              to={currentActivePost?.previousType?.toLowerCase() == 'photo'
                ? `/photo/${currentActivePost?.previousId}?type=${isInStory ? POST_TYPES.PHOTO_POST : POST_TYPES.GROUP_PHOTO_POST}`
                : `/video/${currentActivePost?.previousId}?type=${isInStory ? POST_TYPES.VIDEO_POST : POST_TYPES.GROUP_VIDEO_POST}`}
            >
              <IconChevronLeft className='size-9' />
            </Link>
          }
          {
            currentActivePost?.nextType && <Link
              className='absolute right-2 top-1/2 -translate-y-1/2 text-orangeFpt bg-white hover:bg-orange-100 rounded-full flex justify-center items-center'
              to={currentActivePost?.nextType?.toLowerCase() == 'photo'
                ? `/photo/${currentActivePost?.nextId}?type=${isInStory ? POST_TYPES.PHOTO_POST : POST_TYPES.GROUP_PHOTO_POST}`
                : `/video/${currentActivePost?.nextId}?type=${isInStory ? POST_TYPES.VIDEO_POST : POST_TYPES.GROUP_VIDEO_POST}`}
            >
              <IconChevronRight className='size-9' />
            </Link>
          }
        </div>
        <div className='max-lg:h-1/2 lg:basis-4/12 overflow-y-auto overflow-x-clip no-scrollbar'>
          <div className='h-[80%] overflow-y-auto scrollbar-none-track overflow-x-clip'>
            {
              !postId &&
              <div className="flex flex-wrap items-center justify-between border-b px-4 pt-4 pb-3">
                <span className="text-sm text-gray-500 flex items-center gap-1"><IconArticle />{t('standard.media.from')}</span>
                <Link to={currentActivePost?.groupPostId ? `/groups/${currentActivePost?.groupId}/post/${currentActivePost?.groupPostId}?share=0` : `/post/${currentActivePost?.userPostId}?share=0`} className="font-semibold text-sm hover:bg-fbWhite p-1 rounded-md">{t('standard.media.view')}</Link>
              </div>
            }
            <PostTitle postData={currentActivePost} isYourPost={isYourPost} postType={postType} />
            {
              (isProfile || isGroup) ? <PostContents postData={currentActivePost} />
                : <div className="px-4 pb-3">
                  {!isEditContent && <div className='mb-3'>{currentActivePost?.content}</div>}
                  {isEditContent && <Box >
                    <TextField
                      defaultValue={currentActivePost?.content}
                      multiline variant="standard" sx={{ width: '100%', marginBottom: '12px' }}
                      placeholder={t('standard.media.placeHolder')}
                      {...register('content')}
                    />
                    <div className='flex gap-2'>
                      <Button variant="contained" color='warning' onClick={handleUpdateChildPostContent}>{t('standard.media.save')}</Button>
                      <Button variant="contained" color='inherit' onClick={() => setIsEditContent(!isEditContent)}>{t('standard.media.cancel')}</Button>
                    </div>
                  </Box>}
                  {isYourPost && !isEditContent && (!isProfile || !isGroup) && <Button variant="contained" color='warning' onClick={() => setIsEditContent(!isEditContent)}>{t('standard.media.edit')}</Button>}
                </div>
            }
            <PostReactStatus postData={currentActivePost} postType={postType} />
            <PostComment comment={listComment} postType={postType} />
          </div>
          <form onSubmit={handleSubmit(handleCommentPost)} className='pb-4 pt-2 border-t w-full flex gap-2 px-4'>
            <UserAvatar isOther={false} />
            <div className='rounded-lg pt-2 w-full bg-fbWhite'>
              <Tiptap
                setContent={setContent}
                content={content}
                listMedia={listMedia}
                setListMedia={setListMedia}
                editorType={EDITOR_TYPE.COMMENT}
              />
            </div>
          </form>
        </div>
      </div>
    </>
  )
}

export default Media
