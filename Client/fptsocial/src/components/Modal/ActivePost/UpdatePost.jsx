// import React from 'react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { getStatus } from '~/apis'
import { FormControl, FormControlLabel, Modal, Popover, Radio, RadioGroup } from '@mui/material'
import { IconCaretDownFilled, IconX } from '@tabler/icons-react'
import { updateSharePost, updateUserPost } from '~/apis/postApis'
import { clearAndHireCurrentActivePost, selectCurrentActivePost, selectIsShowModalUpdatePost } from '~/redux/activePost/activePostSlice'
import UserAvatar from '~/components/UI/UserAvatar'
import { triggerReload } from '~/redux/ui/uiSlice'
import { POST_TYPES } from '~/utils/constants'
import { getGroupByGroupId, selectCurrentActiveGroup } from '~/redux/activeGroup/activeGroupSlice'
import PostMedia from '~/components/ListPost/Post/PostContent/PostMedia'
import PostTitle from '~/components/ListPost/Post/PostContent/PostTitle'
import PostContents from '~/components/ListPost/Post/PostContent/PostContents'
import { updateGroupPost, updateGroupSharePost } from '~/apis/groupPostApis'
import EditMedia from '../EditMedia'
import { useTranslation } from 'react-i18next'
import Tiptap from '~/components/TitTap/TitTap'

function UpdatePost() {
  const isShowUpdatePost = useSelector(selectIsShowModalUpdatePost)
  const currentActivePost = useSelector(selectCurrentActivePost)
  const currentActiveGroup = useSelector(selectCurrentActiveGroup)

  const postType = currentActivePost?.postType
  // console.log('🚀 ~ UpdatePost ~ postType:', postType)
  const isProfile = postType == POST_TYPES.PROFILE_POST
  const isShare = postType == POST_TYPES.SHARE_POST
  const isGroup = postType == POST_TYPES.GROUP_POST
  const isGroupShare = postType == POST_TYPES.GROUP_SHARE_POST

  const { t } = useTranslation()

  const dispatch = useDispatch()
  const [isEdit, setIsEdit] = useState(false)

  const { handleSubmit } = useForm()
  const [content, setContent] = useState(currentActivePost?.content)
  const currentUser = useSelector(selectCurrentUser)

  let postShareType = ''
  let postShareData = ''
  if (currentActivePost?.isShare) {
    if (currentActivePost?.userPostShareId) {
      postShareType = POST_TYPES.PROFILE_POST
      postShareData = { ...currentActivePost?.userPostShare, userNameShare: currentActivePost?.userNameShare, userAvatarShare: currentActivePost?.userAvatarShare }
    } else if (currentActivePost?.userPostVideoShareId) {
      postShareType = POST_TYPES.VIDEO_POST
      postShareData = { ...currentActivePost?.userPostVideoShare, userNameShare: currentActivePost?.userNameShare, userAvatarShare: currentActivePost?.userAvatarShare }
    } else if (currentActivePost?.userPostPhotoShareId) {
      postShareType = POST_TYPES.PHOTO_POST
      postShareData = { ...currentActivePost?.userPostPhotoShare, userNameShare: currentActivePost?.userNameShare, userAvatarShare: currentActivePost?.userAvatarShare }
    } else if (currentActivePost?.groupPostShareId) {
      postShareType = POST_TYPES.GROUP_SHARE_POST
      postShareData = { ...currentActivePost?.groupPostShare, userNameShare: currentActivePost?.userNameShare, userAvatarShare: currentActivePost?.userAvatarShare }
    } else if (currentActivePost?.groupPostPhotoShareId) {
      postShareType = POST_TYPES.GROUP_PHOTO_POST
      postShareData = { ...currentActivePost?.groupPostPhotoShare, userNameShare: currentActivePost?.userNameShare, userAvatarShare: currentActivePost?.userAvatarShare }
    } else {
      postShareType = POST_TYPES.GROUP_VIDEO_POST
      postShareData = { ...currentActivePost?.groupPostVideoShare, userNameShare: currentActivePost?.userNameShare, userAvatarShare: currentActivePost?.userAvatarShare }
    }
  }

  const [listMedia, setListMedia] = useState(() => {
    let photos = []
    let videos = []
    if (isProfile) {
      photos = (currentActivePost?.userPostPhotos || currentActivePost?.userPostPhoto)?.map(e => ({ type: 'image', position: e?.postPosition, owner: 'subPost', url: e?.photo?.photoUrl }))
      videos = (currentActivePost?.userPostVideos || currentActivePost?.userPostVideo)?.map(e => ({ type: 'video', position: e?.postPosition, owner: 'subPost', url: e?.video?.videoUrl }))
      if (currentActivePost?.photo) photos.push({ type: 'image', position: 0, owner: 'mainPost', url: currentActivePost?.photo?.photoUrl })
      if (currentActivePost?.video) videos.push({ type: 'video', position: 0, owner: 'mainPost', url: currentActivePost?.video?.videoUrl })
    }
    else if (isGroup) {
      photos = currentActivePost?.groupPostPhoto?.map(e => ({ type: 'image', position: e?.postPosition, owner: 'subPost', url: e?.groupPhoto?.photoUrl }))
      videos = currentActivePost?.groupPostVideo?.map(e => ({ type: 'video', position: e?.postPosition, owner: 'subPost', url: e?.groupVideo?.videoUrl }))
      if (currentActivePost?.groupPhoto) photos.push({ type: 'image', position: 0, owner: 'mainPost', url: currentActivePost?.groupPhoto?.photoUrl })
      if (currentActivePost?.groupVideo) videos.push({ type: 'video', position: 0, owner: 'mainPost', url: currentActivePost?.groupVideo?.videoUrl })
    }
    return [...photos, ...videos].sort((a, b) => a.position - b.position)
  })
  // console.log('🚀 ~ const[listMedia,setListMedia]=useState ~ listMedia:', listMedia)

  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined
  const [listStatus, setListStatus] = useState([])
  const [choseStatus, setChoseStatus] = useState({})

  useEffect(() => {
    if (isProfile || isShare)
      getStatus().then(data => setListStatus(data))
    else if (isGroup || isGroupShare) {
      if (!currentActiveGroup) {
        dispatch(getGroupByGroupId(currentActivePost?.groupId))
      }
      setChoseStatus(currentActiveGroup?.groupSettings?.find(e => e?.groupSettingName == 'Group Status'))
    }
  }, [currentActiveGroup])

  useEffect(() => {
    if (isProfile || isShare) {
      const { userStatusId, userStatusName } = currentActivePost?.userStatus ?? {}
      setChoseStatus({ userStatusId: userStatusId, statusName: userStatusName })
    }
  }, [listStatus])

  const handleEdit = () => {
    setIsEdit(!isEdit)
  }

  const handleRemove = (index) => {
    setListMedia(listMedia?.filter((e, i) => i !== index))
  }
  useEffect(() => {
    if (listMedia.length == 0 && isEdit)
      setIsEdit(false)
  }, [listMedia])
  const submitPost = () => {
    const listPhoto = listMedia.map((media, index) =>
      media.type === 'image' ? { photoUrl: media.url, position: index } : undefined
    ).filter(Boolean)

    const listVideo = listMedia.map((media, index) =>
      media.type === 'video' ? { videoUrl: media.url, position: index } : undefined
    ).filter(Boolean)
    // console.log(listMedia)
    const submitData = isProfile ? {
      'userId': currentUser?.userId,
      'userPostId': currentActivePost?.postId || currentActivePost?.userPostId,
      'content': content ?? '',
      'userStatusId': choseStatus?.userStatusId,
      'photos': listPhoto,
      'videos': listVideo
    } : isGroup ? {
      'userId': currentUser?.userId,
      'groupPostId': currentActivePost?.postId || currentActivePost?.groupPostId,
      'groupId': currentActivePost?.groupId,
      'content': content,
      'groupStatusId': choseStatus?.groupStatusId,
      'photos': listPhoto,
      'videos': listVideo
    } : isShare ? {
      'sharePostId': currentActivePost?.postId || currentActivePost?.userPostId,
      'userId': currentUser?.userId,
      'userStatusId': choseStatus?.userStatusId,
      'content': content || ''
    } : isGroupShare && {
      'groupSharePostId': currentActivePost?.postId,
      'groupId': currentActivePost?.groupId,
      'userId': currentUser?.userId,
      'content': content || ''
    }
    // console.log('🚀 ~ submitPost ~ submitData:', submitData)

    toast.promise(
      isProfile ? updateUserPost(submitData)
        : isShare ? updateSharePost(submitData)
          : isGroup ? updateGroupPost(submitData)
            : isGroupShare && updateGroupSharePost(submitData),
      { pending: 'Updating...' }
    ).then(() => {
      handleCloseModal()
      setContent(null)
      setListMedia([])
      dispatch(triggerReload())
      toast.success('Update post successfully!')
    }).catch((error) => {
      if (error?.response?.data?.statusCode == "UP01") {
        toast.warn('Your post still contains sensitive words ! Please check again !', {
          position: "top-right",
          autoClose: false,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        })
        dispatch(triggerReload())
      }
    })
  }

  const handleCloseModal = () => {
    dispatch(clearAndHireCurrentActivePost())
    dispatch(triggerReload())
  }

  return (
    <Modal
      open={isShowUpdatePost}
      onClose={handleCloseModal}
    >
      <div className='flex flex-col items-center gap-3 w-[95%] lg:w-[900px] max-h-[90%] h-fit absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2
         bg-white border-gray-300 shadow-md rounded-md'>
        <div className='w-full h-full bg-white shadow-4edges rounded-lg flex flex-col overflow-y-auto scrollbar-none-track'>
          {!isEdit ? (
            <form onSubmit={handleSubmit(submitPost)} >
              <div className='flex flex-col'>
                <div className='h-[40px] flex justify-between items-center px-2 border-b '>
                  <span></span>
                  <span className='text-xl font-bold'>{t('standard.newPost.editPost')}</span>
                  <IconX
                    onClick={handleCloseModal}
                    className='bg-orangeFpt text-white rounded-full  cursor-pointer hover:bg-orange-700' />
                </div>
                <div className='mx-4'>
                  <div className='flex items-center h-[40] py-2 gap-2 '>
                    <UserAvatar isOther={false} />
                    <div className='flex flex-col w-full'>
                      <span className='font-bold'>{currentUser?.firstName + ' ' + currentUser?.lastName}</span>
                      <div
                        onClick={(e) => { if (isProfile || isShare) handleClick(e) }}
                        className={`flex items-center gap-1 text-xs ${(isShare || isProfile) ? 'cursor-pointer bg-orangeFpt' : 'bg-orange-400 '} text-white font-bold py-1 px-2  w-fit rounded-lg`}>
                        <span className=''>{choseStatus?.statusName || choseStatus?.userStatusName || choseStatus?.groupStatusName}</span>
                        {(isProfile || isShare) && <IconCaretDownFilled className='size-4' />}
                      </div>
                      <Popover
                        id={id}
                        open={open}
                        anchorEl={anchorEl}
                        onClose={handleClose}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'left'
                        }}
                      >
                        {/* <div className='flex flex-col p-2'> */}
                        <FormControl>
                          <RadioGroup
                            aria-labelledby="demo-radio-buttons-group-label"
                            value={JSON.stringify(choseStatus) || ''}
                            onChange={e => { setChoseStatus(JSON.parse(e.target.value)) }}
                            name="radio-buttons-group"
                            className='p-2 '
                          >
                            {listStatus?.map((status) =>
                              <FormControlLabel
                                key={status?.userStatusId || status?.groupStatusId}
                                value={JSON.stringify(status)}
                                control={<Radio />}
                                label={status?.statusName || status?.groupStatusName} />
                            )}
                          </RadioGroup>
                        </FormControl>
                        {/* </div> */}
                      </Popover>
                    </div>
                  </div>
                </div>
                <div className='pb-1 ' >
                  <Tiptap setContent={setContent} content={content} postType={postType} listMedia={listMedia} setListMedia={setListMedia} handleEdit={handleEdit} />
                </div >
                {(isShare || isGroupShare) &&
                  <div className='px-2'>
                    <div
                      id='media-share'
                      className='h-[300px] overflow-y-auto no-scrollbar flex justify-center border-2 rounded-lg'>
                      <div className='pointer-events-none rounded-lg w-full'>
                        <PostMedia postData={postShareData} postType={postShareType} />
                        <PostTitle postData={postShareData} />
                        <PostContents postData={postShareData} />
                      </div>
                    </div>
                  </div>
                }
                <div className='interceptor-loading py-4 flex justify-center items-center'>
                  <button className={`h-9 w-full mx-4 bg-orangeFpt font-bold text-white rounded-lg cursor-pointer
                    ${(!content?.replace(/<\/?[^>]+(>|$)/g, "") && listMedia.length == 0) && 'opacity-50 pointer-events-none'}`}
                  >{t('standard.newPost.savePost')}
                  </button>
                </div>
              </div >
            </form >
          )
            : isEdit && (
              <EditMedia handleEdit={handleEdit} handleRemove={handleRemove} listMedia={listMedia} setListMedia={setListMedia} />
            )}
        </div >
      </div >
    </Modal>
  )
}

export default UpdatePost