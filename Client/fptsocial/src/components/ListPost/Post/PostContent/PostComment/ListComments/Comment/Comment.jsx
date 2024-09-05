import { Menu, MenuItem, Popover } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { commentPhotoPost, commentPost, commentSharePost, commentVideoPost, deleteCommentSharePost, deleteCommentUserPhotoPost, deleteCommentUserPost, deleteCommentUserVideoPost, updateCommentSharePost, updateUserCommentPhotoPost, updateUserCommentPost, updateUserCommentVideoPost } from '~/apis/postApis'
import { createReactCommentSharePost, createReactCommentUserPhotoPost, createReactCommentUserPost, createReactCommentUserVideoPost, getAllReactByCommentId, getAllReactByCommentPhotoId, getAllReactByCommentSharePostId, getAllReactByCommentVideoId } from '~/apis/reactApis'
import Tiptap from '~/components/TitTap/TitTap'
import UserAvatar from '~/components/UI/UserAvatar'
import { clearAndHireCurrentActivePost, selectCurrentActivePost, triggerReloadComment, updateCurrentActivePost } from '~/redux/activePost/activePostSlice'
import { selectListReactType } from '~/redux/sideData/sideDataSlice'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { cleanAndParseHTML, compareDateTime } from '~/utils/formatters'
import likeEmoji from '~/assets/img/emojis/like.png'
import angryEmoji from '~/assets/img/emojis/angry.png'
import { commentGroupPhotoPost, commentGroupPost, commentGroupSharePost, commentGroupVideoPost, createReactCommentGroupPhotoPost, createReactCommentGroupPost, createReactCommentGroupSharePost, createReactCommentGroupVideoPost, deleteCommentGroupPhotoPost, deleteCommentGroupPost, deleteCommentGroupSharePost, deleteCommentGroupVideoPost, getAllReactByCommentGroupSharePostId, getAllReactByGroupCommentId, getAllReactByGroupCommentPhotoId, getAllReactByGroupCommentVideoId, updateCommentGroupSharePost, updateGroupCommentPhotoPost, updateGroupCommentPost, updateGroupCommentVideoPost } from '~/apis/groupPostApis'
import { EDITOR_TYPE, POST_TYPES, REPORT_TYPES } from '~/utils/constants'
import { IconDotsVertical } from '@tabler/icons-react'
import { useConfirm } from 'material-ui-confirm'
import { selectCurrentActiveListPost, updateCurrentActiveListPost } from '~/redux/activeListPost/activeListPostSlice'
import { addReport, openModalReport } from '~/redux/report/reportSlice'
import { useTranslation } from 'react-i18next'
import CommentReactDetail from './CommentReactDetail'
import { Link } from 'react-router-dom'

function Comment({ comment, postType }) {
  const currentActivePost = useSelector(selectCurrentActivePost)
  const currentActiveListPost = useSelector(selectCurrentActiveListPost)
  const [currentReact, setCurrentReact] = useState({})
  const { handleSubmit } = useForm()
  const listReact = useSelector(selectListReactType)
  const reactLike = listReact?.find(e => e?.reactTypeName?.toLowerCase() == 'like')
  const [content, setContent] = useState(comment?.content)
  const [contentReply, setContentReply] = useState()
  const [listMedia, setListMedia] = useState([])
  const [listCommentReact, setListCommentReact] = useState()
  const [reload, setReload] = useState(false)
  const dispatch = useDispatch()
  const [isEditContent, setIsEditContent] = useState(false)

  const currentUser = useSelector(selectCurrentUser)
  const isYourComment = currentUser?.userId == comment?.userId

  const isProfile = postType === POST_TYPES.PROFILE_POST
  const isShare = postType === POST_TYPES.SHARE_POST
  const isVideoPost = postType === POST_TYPES.VIDEO_POST
  const isPhotoPost = postType === POST_TYPES.PHOTO_POST
  const isGroup = postType === POST_TYPES.GROUP_POST
  const isGroupShare = postType === POST_TYPES.GROUP_SHARE_POST
  const isGroupPhoto = postType === POST_TYPES.GROUP_PHOTO_POST
  const isGroupVideo = postType === POST_TYPES.GROUP_VIDEO_POST
  const [commentMedia, setCommentMedia] = useState(cleanAndParseHTML(comment?.content, true))

  let postIdParam = {}
  let commentIdParam = {}
  let getCommentReactFn
  let replyCommentFn
  let reactCommentFn
  let deleteCommentFn


  if (isProfile) {
    commentIdParam['commentId'] = comment?.commentId
    postIdParam['userPostId'] = comment?.userPostId
    getCommentReactFn = getAllReactByCommentId
    replyCommentFn = commentPost
    reactCommentFn = createReactCommentUserPost
    deleteCommentFn = deleteCommentUserPost
  } else if (isShare) {
    commentIdParam['commentSharePostId'] = comment?.commentSharePostId
    postIdParam['sharePostId'] = comment?.sharePostId
    getCommentReactFn = getAllReactByCommentSharePostId
    replyCommentFn = commentSharePost
    reactCommentFn = createReactCommentSharePost
    deleteCommentFn = deleteCommentSharePost
  } else if (isVideoPost) {
    commentIdParam['commentVideoPostId'] = comment?.commentVideoPostId
    postIdParam['userPostVideoId'] = comment?.userPostVideoId
    getCommentReactFn = getAllReactByCommentVideoId
    replyCommentFn = commentVideoPost
    reactCommentFn = createReactCommentUserVideoPost
    deleteCommentFn = deleteCommentUserVideoPost
  } else if (isPhotoPost) {
    commentIdParam['commentPhotoPostId'] = comment?.commentPhotoPostId
    postIdParam['userPostPhotoId'] = comment?.userPostPhotoId
    getCommentReactFn = getAllReactByCommentPhotoId
    replyCommentFn = commentPhotoPost
    reactCommentFn = createReactCommentUserPhotoPost
    deleteCommentFn = deleteCommentUserPhotoPost
  } else if (isGroup) {
    commentIdParam['commentGroupPostId'] = comment?.commentGroupPostId
    postIdParam['groupPostId'] = comment?.groupPostId
    getCommentReactFn = getAllReactByGroupCommentId
    replyCommentFn = commentGroupPost
    reactCommentFn = createReactCommentGroupPost
    deleteCommentFn = deleteCommentGroupPost
  } else if (isGroupShare) {
    commentIdParam['commentGroupSharePostId'] = comment?.commentGroupSharePostId
    postIdParam['groupSharePostId'] = comment?.groupSharePostId
    getCommentReactFn = getAllReactByCommentGroupSharePostId
    replyCommentFn = commentGroupSharePost
    reactCommentFn = createReactCommentGroupSharePost
    deleteCommentFn = deleteCommentGroupSharePost
  } else if (isGroupPhoto) {
    commentIdParam['commentPhotoGroupPostId'] = comment?.commentPhotoGroupPostId
    postIdParam['groupPostPhotoId'] = comment?.groupPostPhotoId
    getCommentReactFn = getAllReactByGroupCommentPhotoId
    replyCommentFn = commentGroupPhotoPost
    reactCommentFn = createReactCommentGroupPhotoPost
    deleteCommentFn = deleteCommentGroupPhotoPost
  } else if (isGroupVideo) {
    commentIdParam['commentGroupVideoPostId'] = comment?.commentGroupVideoPostId
    postIdParam['groupPostVideoId'] = comment?.groupPostVideoId
    getCommentReactFn = getAllReactByGroupCommentVideoId
    replyCommentFn = commentGroupVideoPost
    reactCommentFn = createReactCommentGroupVideoPost
    deleteCommentFn = deleteCommentGroupVideoPost
  }

  const { t } = useTranslation()
  const [anchorEl, setAnchorEl] = useState(null)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }
  const [anchorEl2, setAnchorEl2] = useState(null)
  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget)
  }
  const handleClose2 = () => {
    setAnchorEl2(null)
  }
  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined
  const open2 = Boolean(anchorEl2)
  const id2 = open ? 'simple-popover2' : undefined

  useEffect(() => {
    const getReactOfComment = async () => {
      const response = await (
        getCommentReactFn(Object.values(commentIdParam)[0])
      )
      setListCommentReact(response)
      setCurrentReact(response?.listCommentReact?.find(e => e?.userId == currentUser?.userId))
    }
    getReactOfComment()
  }, [reload])

  const handleRelyComment = () => {
    const submitData = {
      ...postIdParam,
      'userId': currentUser?.userId,
      'content': listMedia?.length > 0 ? `${replaceRegex(contentReply)}<!--MEDIA:${listMedia[0]?.type}:${listMedia[0]?.url}-->` : replaceRegex(contentReply),
      'parentCommentId': Object.values(commentIdParam)[0]
    }
    toast.promise(
      replyCommentFn(submitData),
      { pending: 'Posting...' }
    ).then(() => {

      toast.success('Commented')
    }).then(() => { dispatch(triggerReloadComment()); setAnchorEl(null); setContentReply(null) })
      .then(() => dispatch(updateCurrentActivePost({ ...currentActivePost, reactCount: { ...currentActivePost?.reactCount, commentNumber: currentActivePost?.reactCount?.commentNumber + 1 } })))
      .then(() => {
        if (currentActiveListPost) {
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
          )
          dispatch(updateCurrentActiveListPost(updatedPosts));
        }
      })
  }

  const handleReactPost = (type) => {
    const reactData = {
      ...postIdParam,
      'userId': currentUser?.userId,
      'reactTypeId': type,
      ...commentIdParam
    }

    toast.promise(reactCommentFn(reactData)
      //   .then((data) => {
      //     if (data) {
      //       const signalRData = {
      //         MsgCode: 'User-004',
      //         Receiver: `${postData?.userId}`,
      //         Url: `/profile?id=${currentUser?.userId}`,
      //         AdditionsMsd: ''
      //       }
      //       connectionSignalR.invoke('SendNotify', JSON.stringify(signalRData))
      //     }
      //   })
      , { pending: '' }
    ).then(() => setReload(!reload)
    )
  }
  const confirm = useConfirm()
  const handleRemoveComment = () => {
    confirm({
      title: (
        <div className='flex flex-col gap-2'>
          <div className='font-bold text-[#d22e2e]'>Delete this comment?</div>
        </div>
      ),
      description: ('This a permanent action and cannot be undone.The comment and all associated replies will be removed from the system..'),
      confirmationButtonProps: { color: 'error', variant: 'contained' },
      confirmationText: 'Delete',
      cancellationText: 'Cancel'
    }).then(() => {
      toast.promise(
        deleteCommentFn(Object.values(commentIdParam)[0]),
        { pending: 'Processing...' }
      ).then(() => { dispatch(triggerReloadComment()); toast.success('Deleted') })
        .then(() => dispatch(updateCurrentActivePost({ ...currentActivePost, reactCount: { ...currentActivePost?.reactCount, commentNumber: currentActivePost?.reactCount?.commentNumber - 1 } })))
        .then(() => {
          if (currentActiveListPost) {
            const updatedPosts = currentActiveListPost.map(post =>
              post.postId === currentActivePost.postId
                ? {
                  ...currentActivePost,
                  reactCount: {
                    ...currentActivePost.reactCount,
                    commentNumber: currentActivePost.reactCount.commentNumber - 1
                  }
                }
                : post
            )
            dispatch(updateCurrentActiveListPost(updatedPosts));
          }
        })
    })
  }

  const replaceRegex = (html) => {
    return html.replace(/<!--MEDIA:(video|image):(.+?)-->/g, '')
  }
  const handleUpdateComment = () => {
    (async () => {
      const submitData = {
        'userId': currentUser?.userId,
        'content': commentMedia?.length > 0 ? `${replaceRegex(content)}<!--MEDIA:${commentMedia[0]?.type}:${commentMedia[0]?.url}-->` : replaceRegex(content),
        ...commentIdParam
      }
      await (isProfile ? updateUserCommentPost(submitData)
        : isShare ? updateCommentSharePost(submitData)
          : isPhotoPost ? updateUserCommentPhotoPost(submitData)
            : isVideoPost ? updateUserCommentVideoPost(submitData)
              : isGroup ? updateGroupCommentPost(submitData)
                : isGroupShare ? updateCommentGroupSharePost(submitData)
                  : isGroupPhoto ? updateGroupCommentPhotoPost(submitData)
                    : isGroupVideo && updateGroupCommentVideoPost(submitData)
      )
      dispatch(triggerReloadComment())
      toast.success('Updated')
      setIsEditContent(false)
      setContent('')
    })()
  }

  const [open3, setOpen3] = useState(false)
  const anchorRef = useRef(null)

  const handleClick3 = () => {
    setOpen3(true)
  }
  const handleClose3 = () => {
    setOpen3(false)
  }
  return (
    <div className={`${comment?.level !== 1 && 'pl-[15%] mt-3'} `}>
      <div className='flex gap-1'>
        <Link to={`/profile?id=${comment?.userId}`} onClick={() => dispatch(clearAndHireCurrentActivePost())}><UserAvatar avatarSrc={comment?.url} size={2} /></Link>
        <div className='flex flex-col gap-[2px] '>
          {
            !isEditContent &&
            <>
              <div className='bg-gray-100 flex flex-col py-1 px-2 gap-[2px] rounded-lg w-full text-sm'>
                <div>
                  <Link to={`/profile?id=${comment?.userId}`} onClick={() => dispatch(clearAndHireCurrentActivePost())}
                    className='font-bold capitalize hover:underline'>{comment?.userName}</Link>
                  {
                    currentActivePost?.userId == comment?.userId &&
                    <span className='font-medium text-xs text-white bg-orangeFpt ml-1 px-1 py-[2px] rounded-md'>{t('standard.comment.author')}</span>
                  }
                </div>
                <div className='font-normal flex-col'>
                  {cleanAndParseHTML(comment?.content)}
                  <div className='max-w-[300px]'>
                    {commentMedia?.length > 0 && commentMedia && (
                      commentMedia[0]?.type == 'image'
                        ? <img src={cleanAndParseHTML(comment?.content, true)[0]?.url} />
                        : <video src={cleanAndParseHTML(comment?.content, true)[0]?.url} controls />
                    )}
                  </div>
                </div>
              </div>
              <div className='flex gap-2 items-center text-xs'>
                <span className='font-thin cursor-pointer'>{compareDateTime(comment?.createdDate)}</span>
                <div className={`relative ${listCommentReact?.isReact && (currentReact?.reactTypeName?.toLowerCase() == 'dislike' ? 'text-orange-500' : 'text-blue-500')} font-semibold cursor-pointer [&>#react-comment]:hover:!opacity-100`}
                  onClick={() => handleReactPost(currentReact?.reactTypeId || reactLike?.reactTypeId)}
                >
                  {
                    !listCommentReact?.isReact
                      ? t('standard.react.like')
                      : currentReact?.reactTypeName?.toLowerCase() == 'dislike'
                        ? t('standard.react.disLike')
                        : t('standard.react.like')
                  }
                  <div id='react-comment' className='min-w-20 absolute flex gap-1 opacity-0 transition-opacity duration-300 delay-500 top-0 -translate-y-10
                  bg-white shadow-4edges rounded-3xl px-2 py-1'>
                    {listReact?.map(reaction => (
                      <div key={reaction?.reactTypeId} className="text-4xl" onClick={(e) => {
                        e.stopPropagation()
                        handleReactPost(reaction?.reactTypeId)
                      }}>
                        {reaction?.reactTypeName?.toLowerCase() == 'like' ?
                          <img className='size-8 hover:scale-[1.2] cursor-pointer' src={likeEmoji} />
                          : reaction?.reactTypeName?.toLowerCase() == 'dislike'
                          && <img className='size-8 hover:scale-[1.2] cursor-pointer' src={angryEmoji} />}
                      </div>
                    ))}
                  </div>
                </div>
                <span id='comment-filter' className='font-semibold cursor-pointer' onClick={handleClick}>{t('standard.comment.reply')}</span>
                <span className={`font-semibold hover:underline cursor-pointer flex items-center gap-[1px] ${(listCommentReact?.sumOfReact ?? 0) == 0 && 'invisible'}`}
                  ref={anchorRef} onClick={handleClick3}
                >
                  {
                    listCommentReact?.listReact?.sort((a, b) => b?.numberReact - a?.numberReact)?.slice(0, 2)?.map((react, i) => {
                      if (react?.numberReact > 0) {
                        if (react?.reactTypeName.toLowerCase() == 'like')
                          return <img key={i} className={`size-5 ${i != 0 ? '-ml-2' : 'z-10'} rounded-full outline outline-2 outline-white`} src={likeEmoji} />
                        else return <img key={i} className={`size-5 ${i != 0 ? '-ml-2' : 'z-10'} rounded-full outline outline-2 outline-white`} src={angryEmoji} />
                      }
                    })
                  }
                  {listCommentReact?.sumOfReact}
                </span>
                <Popover
                  open={open3}
                  anchorEl={anchorRef.current}
                  onClose={handleClose3}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                >
                  <CommentReactDetail comment={comment} postType={postType} />
                </Popover>
                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                  transformOrigin={{
                    vertical: 'bottom',
                    horizontal: 'left',
                  }}
                // disablePortal
                >
                  <form onSubmit={handleSubmit(handleRelyComment)} className='px-2 flex gap-1 py-1 w-[400px]'>
                    <UserAvatar isOther={false} />
                    <div className='rounded-2xl pt-2'>
                      <Tiptap
                        setContent={setContentReply}
                        content={contentReply}
                        editorType={EDITOR_TYPE.COMMENT}
                        listMedia={listMedia}
                        setListMedia={setListMedia}
                      />
                    </div>
                  </form>
                </Popover>
              </div>
            </>
          }
          {
            isEditContent && <div className='mb-3'>
              <form onSubmit={handleSubmit(handleUpdateComment)} className='my-4 w-full flex gap-2 px-4 bg-fbWhite rounded-md'>
                <div className='rounded-lg pt-2'>
                  <Tiptap
                    setContent={setContent}
                    content={content}
                    listMedia={commentMedia}
                    setListMedia={setCommentMedia}
                    editorType={EDITOR_TYPE.COMMENT}
                  />
                </div>
              </form>
              <span className='cursor-pointer text-xs px-3 font-semibold text-blue-500' onClick={() => {
                setListMedia(cleanAndParseHTML(comment?.content, true))
                setIsEditContent(!isEditContent)
              }}>Cancel</span>
            </div>

          }
        </div>

        <div
          className="flex justify-center items-center hover:text-orangeFpt cursor-pointer size-5"
          onClick={handleClick2}
        ><IconDotsVertical stroke={1} /></div>
        <Menu
          anchorEl={anchorEl2}
          id={id2}
          open={open2}
          onClose={handleClose2}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          {isYourComment && <MenuItem onClick={() => { handleClose2(), setIsEditContent(!isEditContent) }} sx={{ gap: '5px' }}>
            Edit
          </MenuItem>}
          {isYourComment && <MenuItem onClick={() => { handleRemoveComment(); handleClose2() }} sx={{ gap: '5px' }}>
            Delete
          </MenuItem>}
          {
            currentUser?.userId != comment?.userId &&
            <MenuItem
              onClick={() => {
                dispatch(addReport({ reportData: { ...comment, type: postType }, reportType: REPORT_TYPES.COMMENT }))
                dispatch(openModalReport())
                handleClose()
              }}
              sx={{ gap: '5px' }}>
              Report
            </MenuItem>
          }
        </Menu>

      </div>
      {comment?.replies?.map((e, i) => (
        <Comment key={i} comment={e} postType={postType} />
      ))}
    </div >
  )
}

export default Comment
