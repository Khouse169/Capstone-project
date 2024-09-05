import { IconMessageCircle, IconShare3, IconThumbUp, IconThumbUpFilled } from '@tabler/icons-react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import { createReactPhotoPost, createReactPost, createReactSharePost, createReactVideoPost, getAllReactByPostId } from '~/apis/reactApis'
import { selectCurrentActivePost, showModalActivePost, showModalSharePost, updateCurrentActivePost } from '~/redux/activePost/activePostSlice'
import { selectListReactType } from '~/redux/sideData/sideDataSlice'
import { selectCurrentUser } from '~/redux/user/userSlice'
import connectionSignalR from '~/utils/signalRConnection'
import likeEmoji from '~/assets/img/emojis/like.png'
import angryEmoji from '~/assets/img/emojis/angry.png'
import { POST_TYPES } from '~/utils/constants'
import { createReactGroupPhotoPost, createReactGroupPost, createReactGroupSharePost, createReactGroupVideoPost } from '~/apis/groupPostApis'
import { cloneDeep } from 'lodash'
import { selectCurrentActiveListPost, updateCurrentActiveListPost } from '~/redux/activeListPost/activeListPostSlice'
import { useCallback, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Popover } from '@mui/material'
import PostReactStatusDetail from './PostReactStatusDetail'
// import { motion } from 'framer-motion'

function PostReactStatus({ postData, postType, postShareData, postShareType, isCanShare = true }) {
  const currentActiveListPost = useSelector(selectCurrentActiveListPost)
  const currentActivePost = useSelector(selectCurrentActivePost)
  const listReact = useSelector(selectListReactType)
  const reactLike = listReact?.find(e => e?.reactTypeName?.toLowerCase() == 'like')
  // const [isHovered, setIsHovered] = useState(false)
  const { t } = useTranslation()
  const updateTopReact = useCallback(() => {
    let top2React = cloneDeep(postData?.reactCount?.top2React) || []
    listReact?.forEach(item => {

      if (!top2React?.some(e => e?.reactTypeId == item?.reactTypeId))
        top2React.push({ ...item, numberReact: 0 })
    })
    return top2React
  }, [listReact, postData])

  let postReact = cloneDeep({ ...postData?.reactCount, top2React: updateTopReact() })
  // console.log('🚀 ~ PostReactStatus ~ postType:', postReact)

  const currentUser = useSelector(selectCurrentUser)
  const isYourPost = currentUser?.userId == postData?.userId
  const dispatch = useDispatch()
  // const [postReact, setPostReact] = useState({})
  const isProfile = postType == POST_TYPES.PROFILE_POST
  const isShare = postType == POST_TYPES.SHARE_POST
  const isPhoto = postType == POST_TYPES.PHOTO_POST
  const isVideo = postType == POST_TYPES.VIDEO_POST
  const isGroup = postType == POST_TYPES.GROUP_POST
  const isGroupShare = postType == POST_TYPES.GROUP_SHARE_POST
  const isGroupPhoto = postType == POST_TYPES.GROUP_PHOTO_POST
  const isGroupVideo = postType == POST_TYPES.GROUP_VIDEO_POST
  let postId = ''
  let url = ''
  if (isProfile) {
    postId = postData?.userPostId || postData?.postId
    url = `/post/${postId}?share=0`
  } else if (isPhoto) {
    postId = postData?.userPostMediaId
    url = `/photo/${postId}?type=${POST_TYPES.PHOTO_POST}`
  } else if (isVideo) {
    postId = postData?.userPostMediaId
    url = `/video/${postId}?type=${POST_TYPES.VIDEO_POST}`
  } else if (isShare) {
    postId = postData?.sharePostId || postData?.postId
    url = `/post/${postId}?share=1`
  } else if (isGroup) {
    postId = postData?.groupPostId || postData?.postId
    url = `/groups/${postData?.groupId}/post/${postId}?share=0`
  } else if (isGroupShare) {
    postId = postData?.groupSharePostId || postData?.postId
    url = `/groups/${postData?.groupId}/post/${postId}?share=1`
  } else if (isGroupPhoto) {
    postId = postData?.groupPostMediaId
    url = `/photo/${postId}?type=${POST_TYPES.GROUP_PHOTO_POST}`
  } else if (isGroupVideo) {
    postId = postData?.groupPostMediaId
    url = `/video/${postId}?type=${POST_TYPES.GROUP_VIDEO_POST}`
  }

  const handleOpenCurrenPostModal = () => {
    dispatch(showModalActivePost())
    // dispatch(updatePostReactStatus(postReact))
    dispatch(updateCurrentActivePost({ ...postData, postType: postType }))
  }

  const handleReactPost = (reaction) => {
    const reactData = isPhoto ? {
      'userId': currentUser?.userId,
      'userPostPhotoId': postData?.userPostMediaId,
      'reactTypeId': reaction?.reactTypeId
    }
      : isVideo ? {
        'userId': currentUser?.userId,
        'userPostVideoId': postData?.userPostMediaId,
        'reactTypeId': reaction?.reactTypeId
      }
        : isProfile ? {
          'userId': currentUser?.userId,
          'userPostId': postData?.userPostId || postData?.postId,
          'reactTypeId': reaction?.reactTypeId
        }
          : isShare ? {
            'userId': currentUser?.userId,
            'sharePostId': postData?.sharePostId || postData?.postId,
            'reactTypeId': reaction?.reactTypeId
          }
            : isGroup ? {
              'userId': currentUser?.userId,
              'groupPostId': postData?.groupPostId || postData?.postId,
              'reactTypeId': reaction?.reactTypeId
            }
              : isGroupShare ? {
                'userId': currentUser?.userId,
                'groupSharePostId': postData?.groupSharePostId || postData?.postId,
                'reactTypeId': reaction?.reactTypeId
              }
                : isGroupPhoto ? {
                  'userId': currentUser?.userId,
                  'groupPostPhotoId': postData?.groupPostMediaId,
                  'reactTypeId': reaction?.reactTypeId
                }
                  : isGroupVideo && {
                    'userId': currentUser?.userId,
                    'groupPostVideoId': postData?.groupPostMediaId,
                    'reactTypeId': reaction?.reactTypeId
                  }
    toast.promise(
      (async () => {
        const data = await (
          isPhoto ? createReactPhotoPost(reactData)
            : isVideo ? createReactVideoPost(reactData)
              : isProfile ? createReactPost(reactData)
                : isShare ? createReactSharePost(reactData)
                  : isGroup ? createReactGroupPost(reactData)
                    : isGroupShare ? createReactGroupSharePost(reactData)
                      : isGroupPhoto ? createReactGroupPhotoPost(reactData)
                        : isGroupVideo && createReactGroupVideoPost(reactData)
        )
        if (data) {
          const signalRData = {
            MsgCode: 'User-003',
            Receiver: `${postData?.userId}`,
            Url: url,
            AdditionsMsd: '',
            ActionId: 'spam'
          }
          connectionSignalR.invoke('SendNotify', JSON.stringify(signalRData))
        }
      }),
      { pending: '' }
    ).then(
      // () => setReload(!reload)
      () => {
        let newPostReact = cloneDeep(postReact)
        let currentReact = ''
        // const isInListReact = newPostReact?.listReact?.some(e => e?.reactTypeId == reaction?.reactTypeId)
        if (newPostReact?.isReact) {
          currentReact = newPostReact?.userReactType
          if (currentReact?.reactTypeId == reaction?.reactTypeId) {
            // console.log(currentReact?.reactTypeId == reaction?.reactTypeId)
            newPostReact = {
              ...newPostReact,
              reactNumber: newPostReact.reactNumber - 1,
              userReactType: null,
              isReact: false,
              top2React: newPostReact?.top2React?.map(react => {
                if (react?.reactTypeId == reaction?.reactTypeId) return { ...react, numberReact: react?.numberReact - 1 }
                return react
              }),
            }
          }
          else {
            // console.log(currentReact?.reactTypeId == reaction?.reactTypeId)
            newPostReact = {
              ...newPostReact,
              isReact: true,
              userReactType: { ...reaction },
              top2React: newPostReact?.top2React?.map(react => {
                if (react?.reactTypeId == currentReact?.reactTypeId)
                  return { ...react, numberReact: react?.numberReact - 1 }
                else if (react?.reactTypeId == reaction?.reactTypeId)
                  return { ...react, numberReact: react?.numberReact + 1 }
                else return react
              })
            }
          }
        }
        else {
          newPostReact = {
            ...newPostReact,
            reactNumber: newPostReact.reactNumber + 1,
            isReact: true,
            userReactType: { ...reaction },
            top2React: newPostReact?.top2React?.map(react => {
              if (react?.reactTypeId == reaction?.reactTypeId)
                return { ...react, numberReact: react?.numberReact + 1 }
              else return react
            })
          }
        }
        // console.log(newPostReact)

        let newPostData = cloneDeep(postData)
        newPostData = { ...newPostData, reactCount: newPostReact }
        if (currentActivePost) {
          dispatch(updateCurrentActivePost(newPostData))
        }
        dispatch(updateCurrentActiveListPost(currentActiveListPost?.map(e => e?.postId == newPostData.postId ? newPostData : e)))
      }
    )
  }

  const [open, setOpen] = useState(false)
  const anchorRef = useRef(null)

  const handleClick = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div id="post-react"
      className="w-full flex flex-col items-start border-t-2 px-4">
      <div id="post-react-status"
        className="w-full flex items-center justify-between py-1">
        <div className="flex items-center gap-1 hover:underline cursor-pointer" ref={anchorRef} onClick={handleClick}
        >
          {
            postReact?.top2React?.sort((a, b) => b?.numberReact - a?.numberReact)?.slice(0, 2)?.map((react, i) => {
              if (react?.numberReact > 0) {
                if (react?.reactTypeName.toLowerCase() == 'like')
                  return <img key={i} className={`size-5 ${i != 0 ? '-ml-2' : 'z-10'} rounded-full outline outline-2 outline-white`} src={likeEmoji} />
                else return <img key={i} className={`size-5 ${i != 0 ? '-ml-2' : 'z-10'} rounded-full outline outline-2 outline-white`} src={angryEmoji} />
              }
            })
          }
          <span className="text-sm text-gray-500">{postReact?.reactNumber !== 0 && postReact?.reactNumber}</span>
        </div >
        <Popover
          open={open}
          anchorEl={anchorRef.current}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'left',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
        >
          <PostReactStatusDetail postData={postData} postType={postType} />
        </Popover>
        <div className='flex items-center gap-4'>
          <div className="flex items-center" onClick={handleOpenCurrenPostModal}>
            <IconMessageCircle stroke={1} />
            <span className="text-sm text-gray-500">{postReact?.commentNumber ?? 0}</span>
          </div>
          <div className="flex items-center ">
            <IconShare3 stroke={1} />
            <span className="text-sm text-gray-500">{postReact?.shareNumber ?? 0}</span>
          </div>
        </div>
      </div>

      <div id="post-react-action"
        className="w-full flex items-center justify-between border-t">
        <div
          className="group flex items-center justify-center hover:bg-fbWhite cursor-pointer py-1 rounded-md relative basis-1/3"
          onClick={() => handleReactPost(postReact?.userReactType || reactLike)}
        >
          <div className="flex items-center gap-1">
            {
              postReact?.isReact
                ? postReact?.userReactType?.reactTypeName.toLowerCase() == 'like'
                  ? <img
                    className={`size-6 interceptor-loading rounded-full outline outline-2 outline-white`}
                    src={likeEmoji} />
                  : <img
                    className={`size-6 interceptor-loading rounded-full outline outline-2 outline-white`}
                    src={angryEmoji}
                  />
                : <IconThumbUp stroke={1} />
            }
            <span className={`text-sm font-bold capitalize 
          ${postReact?.userReactType?.reactTypeName.toLowerCase() == 'like' ? 'text-blue-500' : postReact?.userReactType?.reactTypeName?.toLowerCase() == 'dislike' ? 'text-orange-500' : 'text-gray-500'}`}>
              {postReact?.userReactType?.reactTypeName.toLowerCase() == 'like' ? t('standard.react.like') : postReact?.userReactType?.reactTypeName.toLowerCase() == 'dislike' ? t('standard.react.disLike') : t('standard.react.like')}
            </span>
          </div>
          <div className="absolute z-50 flex gap-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 delay-500 top-0 -translate-y-10 bg-white shadow-4edges rounded-3xl px-2 py-1">
            {
              listReact?.map(reaction => (
                <div
                  key={reaction?.reactTypeId}
                  className="text-4xl hover:scale-110 transition-transform duration-200"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleReactPost(reaction)
                  }}
                >
                  {reaction?.reactTypeName?.toLowerCase() == 'like' ?
                    <img className='size-8 cursor-pointer' src={likeEmoji} />
                    : reaction?.reactTypeName?.toLowerCase() == 'dislike'
                    && <img className='size-8 cursor-pointer' src={angryEmoji} />}
                </div>
              ))
            }
          </div>
        </div>
        <div className="flex items-center justify-center hover:bg-fbWhite cursor-pointer py-1 rounded-md basis-1/3"
          onClick={handleOpenCurrenPostModal}
        >
          <IconMessageCircle stroke={1} />
          <span className="text-sm text-gray-500">{t('standard.react.comment')}</span>
        </div>
        {
          (!isYourPost || isShare || isGroupShare) && isCanShare &&
          <div className="flex items-center justify-center hover:bg-fbWhite cursor-pointer py-1 rounded-md  basis-1/3"
            onClick={() => {
              dispatch(showModalSharePost())
              dispatch(updateCurrentActivePost(
                (isShare || isGroupShare) ? { ...postShareData, postType: postShareType }
                  : { ...postData, postType: postType }
              ))
            }}
          >
            <IconShare3 stroke={1} />
            <span className="text-sm text-gray-500">{t('standard.react.share')}</span>
          </div>
        }

      </div>
    </div >
  )
}

export default PostReactStatus