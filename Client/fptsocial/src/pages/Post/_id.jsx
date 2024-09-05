import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { useParams, useSearchParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { commentPost, commentSharePost, getComment, getSharePostById, getSharePostComment, getUserPostById } from '~/apis/postApis'
import { getAllReactByPostId, getAllReactType } from '~/apis/reactApis'
// import Post from '~/components/ListPost/Post/Post'
import PostComment from '~/components/ListPost/Post/PostContent/PostComment/PostComment'
import PostContents from '~/components/ListPost/Post/PostContent/PostContents'
import PostMedia from '~/components/ListPost/Post/PostContent/PostMedia'
import PostReactStatus from '~/components/ListPost/Post/PostContent/PostReactStatus'
import PostTitle from '~/components/ListPost/Post/PostContent/PostTitle'
import SharePost from '~/components/Modal/ActivePost/SharePost'
import Report from '~/components/Modal/Report/Report'
import NavTopBar from '~/components/NavTopBar/NavTopBar'
import Tiptap from '~/components/TitTap/TitTap'
import CurrentUserAvatar from '~/components/UI/UserAvatar'
import { reLoadComment, selectCommentFilterType, selectCurrentActivePost, selectIsShowModalSharePost, triggerReloadComment, updateCurrentActivePost } from '~/redux/activePost/activePostSlice'
import { selectIsOpenReport } from '~/redux/report/reportSlice'
import { addListReactType } from '~/redux/sideData/sideDataSlice'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { EDITOR_TYPE, POST_TYPES } from '~/utils/constants'
import connectionSignalR from '~/utils/signalRConnection'

function Post() {
  const { postId } = useParams()
  const [searchParams] = useSearchParams()
  const dispatch = useDispatch()
  const isShare = searchParams.get('share')
  const { handleSubmit } = useForm()
  const [content, setContent] = useState(null)
  const currentUser = useSelector(selectCurrentUser)
  const isShowModalReport = useSelector(selectIsOpenReport)
  const isShowModalShare = useSelector(selectIsShowModalSharePost)
  const currentActivePost = useSelector(selectCurrentActivePost)
  const [listMedia, setListMedia] = useState([])
  const [listComment, setListComment] = useState([])
  const reloadComment = useSelector(reLoadComment)
  const commentFilterType = useSelector(selectCommentFilterType)

  const postType = isShare == 0 ? POST_TYPES.PROFILE_POST : POST_TYPES.SHARE_POST

  let getCommentFn
  let commentFn
  let postIdParam = {}
  if (isShare == 1) {
    getCommentFn = getSharePostComment
    commentFn = commentSharePost
    postIdParam = { sharePostId: postId }
  }
  else if (isShare == 0) {
    commentFn = commentPost
    getCommentFn = getComment
    postIdParam = { userPostId: postId }
  }

  let url = ''
  if (isShare == 0) {
    url = `/post/${postId}?share=0`
  } else if (isShare == 1) {
    url = `/post/${postId}?share=1`
  }

  useEffect(() => {
    (async () => {
      getAllReactType().then(data => dispatch(addListReactType(data)))
      const postData = await (isShare == 0 ? getUserPostById(postId) : getSharePostById(postId))
      const postReact = await getAllReactByPostId(postId)
      dispatch(updateCurrentActivePost({ ...postData, postReactStatus: postReact }))
    })()
  }, [isShowModalShare])

  useEffect(() => {
    getCommentFn(postId, commentFilterType).then(data => setListComment(data?.posts))
  }, [reloadComment, commentFilterType])

  let postShareType = ''
  let postShareData = ''
  if (isShare == 1) {
    if (currentActivePost?.userPostId) {
      postShareType = POST_TYPES.PROFILE_POST
      postShareData = { ...currentActivePost?.userPostShare, userName: currentActivePost?.userNameShare, avatar: currentActivePost?.userAvatarShare }
    } else if (currentActivePost?.userPostVideoId) {
      postShareType = POST_TYPES.VIDEO_POST
      postShareData = { ...currentActivePost?.userPostVideoShare, userName: currentActivePost?.userNameShare, avatar: currentActivePost?.userAvatarShare }
    } else if (currentActivePost?.userPostPhotoId) {
      postShareType = POST_TYPES.PHOTO_POST
      postShareData = { ...currentActivePost?.userPostPhotoShare, userName: currentActivePost?.userNameShare, avatar: currentActivePost?.userAvatarShare }
    } else if (currentActivePost?.groupPostId) {
      postShareType = POST_TYPES.GROUP_POST
      postShareData = { ...currentActivePost?.groupPostShare, userName: currentActivePost?.userNameShare, avatar: currentActivePost?.userAvatarShare, groupName: currentActivePost?.groupShareName, groupCorverImage: currentActivePost?.groupShareCorverImage }
    }
    else if (currentActivePost?.groupPostPhotoId) {
      postShareType = POST_TYPES.GROUP_PHOTO_POST
      postShareData = { ...currentActivePost?.groupPostPhotoShare, userName: currentActivePost?.userNameShare, avatar: currentActivePost?.userAvatarShare, groupName: currentActivePost?.groupShareName, groupCorverImage: currentActivePost?.groupShareCorverImage }
    } else {
      postShareType = POST_TYPES.GROUP_VIDEO_POST
      postShareData = { ...currentActivePost?.groupPostVideoShare, userNameShare: currentActivePost?.userNameShare, avatar: currentActivePost?.userAvatarShare, groupName: currentActivePost?.groupShareName, groupCorverImage: currentActivePost?.groupShareCorverImage }
    }
  }

  const replaceRegex = (html) => {
    return html?.replace(/<!--MEDIA:(video|image):(.+?)-->/g, '')
  }
  const handleCommentPost = () => {
    const submitData = {
      ...postIdParam,
      'userId': currentUser?.userId,
      'content': listMedia?.length > 0 ? `${replaceRegex(content) || ''}<!--MEDIA:${listMedia[0]?.type}:${listMedia[0]?.url}-->` : replaceRegex(content),
      'parentCommentId': null
    }
    toast.promise(
      commentFn(submitData),
      { pending: 'Updating is in progress...' }
    ).then(() => {
      const signalRData = {
        MsgCode: 'User-007',
        Receiver: `${currentActivePost?.userId}`,
        Url: url,
        AdditionsMsd: '',
        ActionId: 'spam'
      }
      connectionSignalR.invoke('SendNotify', JSON.stringify(signalRData))

      setListMedia([])
      setContent(null)
      dispatch(triggerReloadComment())
      toast.success('Commented')
    })
  }

  return (
    <>
      <NavTopBar />
      {isShowModalShare && <SharePost />}
      {isShowModalReport && <Report />}
      <div className="flex justify-center bg-fbWhite">
        <div className='flex flex-col items-center gap-3 w-[95%] md:w-[600px] bg-white shadow-md rounded-lg mt-4'>
          <div
            className="w-full flex flex-col items-center gap-2 border overflow-y-auto overflow-x-clip scrollbar-none-track">
            <PostTitle postData={currentActivePost} postType={postType} />
            <PostContents postData={currentActivePost} postType={postType} />
            {
              isShare == 1 && <div
                id='media-share'
                className='w-[90%] border p-1 rounded-md mb-2'>
                <PostMedia postData={postShareData} postType={postShareType} />
                <PostTitle postData={postShareData} isYourPost={false} postType={postShareType} />
                <PostContents postData={postShareData} postType={postShareType} />
              </div>
            }
            <PostMedia postData={currentActivePost} postType={postType} />
            <PostReactStatus postData={currentActivePost} postType={postType} />
            <form onSubmit={handleSubmit(handleCommentPost)} className='w-[95%] flex gap-2 px-4 border bg-fbWhite rounded-md'>
              <div className='mt-1'>
                <CurrentUserAvatar isOther={false} />
              </div>
              <div className='rounded-lg pt-2 w-full'>
                <Tiptap
                  setContent={setContent}
                  listMedia={listMedia}
                  setListMedia={setListMedia}
                  content={content}
                  editorType={EDITOR_TYPE.COMMENT}
                />
              </div>
            </form>
            <PostComment comment={listComment} postType={postType} />
          </div>

        </div>
      </div>

    </>
  )
}

export default Post