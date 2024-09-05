// import React from 'react'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { motion } from 'framer-motion'
import { getStatus } from '~/apis'
import { FormControl, FormControlLabel, Modal, Popover, Radio, RadioGroup } from '@mui/material'
import { IconBook, IconCaretDownFilled, IconChevronLeft, IconUsersGroup, IconX } from '@tabler/icons-react'
import { sharePost, updateUserPost } from '~/apis/postApis'
import { clearAndHireCurrentActivePost, selectCurrentActivePost, selectIsShowModalSharePost } from '~/redux/activePost/activePostSlice'
import UserAvatar from '~/components/UI/UserAvatar'
import { triggerReload } from '~/redux/ui/uiSlice'
import Tiptap from '~/components/TitTap/TitTap'
import { CREATE, EDITOR_TYPE, POST_TYPES, PUBLIC } from '~/utils/constants'
import PostTitle from '~/components/ListPost/Post/PostContent/PostTitle'
import PostContents from '~/components/ListPost/Post/PostContent/PostContents'
import PostMedia from '~/components/ListPost/Post/PostContent/PostMedia'
import { getGroupByGroupId, getGroupByUserId, getGroupStatusForCreate } from '~/apis/groupApis'
import GroupAvatar from '~/components/UI/GroupAvatar'
import { getGroupPostByGroupId, shareGroupPost } from '~/apis/groupPostApis'


function SharePost() {
  const isShowModalSharePost = useSelector(selectIsShowModalSharePost)
  const currentActivePost = useSelector(selectCurrentActivePost)
  const postType = currentActivePost?.postType
  const currentUser = useSelector(selectCurrentUser)
  const dispatch = useDispatch()
  const [isChooseGroup, setIsChooseGroup] = useState(false)
  const [shareType, setShareType] = useState(EDITOR_TYPE.STORY)
  const [listGroup, setListGroup] = useState(null)

  const { handleSubmit } = useForm()
  const [content, setContent] = useState(null)
  const user = useSelector(selectCurrentUser)

  const [listStatus, setListStatus] = useState([])
  const [choseStatus, setChoseStatus] = useState({})
  const [chooseGroup, setChooseGroup] = useState(null)

  const isProfile = postType == POST_TYPES.PROFILE_POST
  const isPhoto = postType == POST_TYPES.PHOTO_POST
  const isVideo = postType == POST_TYPES.VIDEO_POST
  const isGroup = postType == POST_TYPES.GROUP_POST
  const isGroupPhoto = postType == POST_TYPES.GROUP_PHOTO_POST
  const isGroupVideo = postType == POST_TYPES.GROUP_VIDEO_POST

  useEffect(() => {
    getGroupByUserId().then(data => setListGroup([...data?.listGroupAdmin || [], ...data?.listGroupMember || []]))
  }, [])

  useEffect(() => {
    if (shareType == EDITOR_TYPE.STORY) getStatus().then(data => setListStatus(data))
  }, [shareType])

  useEffect(() => {
    if (shareType == EDITOR_TYPE.STORY)
      setChoseStatus(listStatus?.find(e => (e?.statusName?.toLowerCase() || e?.groupStatusName?.toLowerCase()) == PUBLIC))
    else if (shareType == EDITOR_TYPE.GROUP) {
      getGroupByGroupId(chooseGroup?.groupId).then(data => setChoseStatus(data?.groupSettings?.find(e => e?.groupSettingName == 'Group Status')))
    }
  }, [listStatus, chooseGroup])

  const submitPost = () => {
    const submitData = {
      'userId': currentUser?.userId,
      'content': content || '',
      'userPostId': (isProfile || (isPhoto || isVideo)) && (currentActivePost?.userPostId || currentActivePost?.postId) || null,
      'userPostVideoId': isVideo && (currentActivePost?.userPostMediaId || currentActivePost?.userPostVideoId) || null,
      'userPostPhotoId': isPhoto && (currentActivePost?.userPostMediaId || currentActivePost?.userPostPhotoId) || null,
      'groupPostId': (isGroup || (isGroupPhoto || isGroupVideo)) && (currentActivePost?.groupPostId || currentActivePost?.postId) || null,
      'groupPostPhotoId': isGroupPhoto && (currentActivePost?.groupPostMediaId || currentActivePost?.groupPostPhotoId) || null,
      'groupPostVideoId': isGroupVideo && (currentActivePost?.groupPostMediaId || currentActivePost?.groupPostVideoId) || null,
      'sharedToUserId': null,
      ...(shareType == EDITOR_TYPE.STORY && { userStatusId: choseStatus?.userStatusId ?? null }),
      // 'userStatusId': choseStatus?.userStatusId || choseStatus?.groupStatusId,
      'userSharedId': currentActivePost?.userId,
      ...(shareType == EDITOR_TYPE.GROUP && { groupId: chooseGroup?.groupId }),
    }
    // console.log(submitData)

    toast.promise(
      shareType == EDITOR_TYPE.STORY ? sharePost(submitData)
        : shareGroupPost(submitData)
      ,
      { pending: 'Posting...' }
    ).then(() => {
      dispatch(triggerReload())
      dispatch(clearAndHireCurrentActivePost())
      setContent(null)
      toast.success('Posted!')
    })
  }
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  };

  const handleClose = () => {
    setAnchorEl(null)
  };

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  // const currentUser = useSelector(selectCurrentUser)

  return (
    <Modal
      open={isShowModalSharePost}
      onClose={() => dispatch(clearAndHireCurrentActivePost())}
    >
      <div className="flex w-[90%] sm:w-70% md:w-[60%] h-fit justify-center items-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className='w-full h-full bg-white shadow-4edges rounded-lg flex flex-col'>
          {!isChooseGroup ? (
            <form onSubmit={handleSubmit(submitPost)} >
              <div className='flex flex-col'>
                <div className='h-[60px] flex justify-between items-center px-2 border-b '>
                  <span></span>
                  <span className='text-xl font-bold flex items-center'>Share post
                    {
                      shareType == EDITOR_TYPE.GROUP && chooseGroup &&
                      <div
                        className='flex items-center gap-1 text-orangeFpt font-bold py-1 px-2  w-fit rounded-xl'>
                        <span className='capitalize'>{chooseGroup?.groupName}</span>
                        <GroupAvatar avatarSrc={chooseGroup?.coverImage} size={8} />
                      </div>
                    }
                  </span>
                  <IconX
                    onClick={() => dispatch(clearAndHireCurrentActivePost())}
                    className='bg-orangeFpt text-white rounded-full  cursor-pointer hover:bg-orange-700' />
                </div>
                <div className='mx-4'>
                  <div className='flex items-center h-[40] py-2 gap-2 '>
                    <UserAvatar isOther={false} />
                    <div className='flex flex-col w-full '>
                      <span className='font-bold'>{user?.firstName + ' ' + user?.lastName}</span>
                      <div className='flex gap-2'>
                        <div
                          onClick={(e) => { if (shareType == EDITOR_TYPE.STORY) handleClick(e) }}
                          className={`flex items-center gap-1 text-xs ${(shareType == EDITOR_TYPE.STORY) ? 'cursor-pointer bg-orangeFpt' : 'bg-orange-400 '} text-white font-bold py-1 px-2  w-fit rounded-lg`}>
                          <span className=''>{choseStatus?.statusName || choseStatus?.userStatusName || choseStatus?.groupStatusName}</span>
                          {(shareType == EDITOR_TYPE.STORY) && <IconCaretDownFilled className='size-4' />}
                        </div>
                        <Popover
                          id={id}
                          open={open}
                          anchorEl={anchorEl}
                          onClose={handleClose}
                          anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
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
                        <div
                          className='flex items-center gap-1 text-xs text-white font-bold py-1 px-2 bg-orangeFpt w-fit rounded-xl'>
                          <span className='capitalize'>{shareType}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='pb-1 text-2xl  ' >
                  <Tiptap setContent={setContent} content={content} postType={POST_TYPES.SHARE_POST} actionType={CREATE} />
                </div >

                {/* <div className='interceptor-loading py-4 flex justify-center items-center'>
                  <button className='h-9 w-full  mx-4 bg-orangeFpt font-bold text-white rounded-lg cursor-pointer'
                  >
                    Save
                  </button>
                </div> */}
                <div className=' pb-2 flex justify-center w-full'>
                  <div className='rounded-lg w-[95%] h-[200px] overflow-y-auto no-scrollbar border-2'>
                    <div className='pointer-events-none'>
                      {(isProfile || isGroup) ?
                        <PostMedia postData={currentActivePost} postType={postType} />
                        : (
                          <div className='w-full'>
                            {(isPhoto || isGroupPhoto)
                              ? <img
                                src={currentActivePost?.photo?.photoUrl || currentActivePost?.groupPhoto?.photoUrl}
                                className='object-contain w-full'
                              />
                              : (isVideo || isGroupVideo)
                              && <video
                                src={isVideo ? currentActivePost?.video?.videoUrl : currentActivePost?.groupVideo?.videoUrl}
                                className='object-contain w-full'
                                controls
                                disablePictureInPicture
                              />
                            }
                          </div>
                        )
                      }
                      <PostTitle postData={currentActivePost} />
                      <PostContents postData={currentActivePost} />
                    </div>

                  </div>
                </div>
                <div className='border-t-2 mb-2'>
                  <div className='px-4 pt-2 text-lg font-semibold'>Share to</div>
                  <div className='flex gap px-2'>
                    <div
                      onClick={() => setShareType(EDITOR_TYPE.STORY)}
                      className={`h-[100px] w-[85px] pt-2 rounded-lg flex flex-col items-center cursor-pointer
                      ${shareType == EDITOR_TYPE.STORY && 'bg-orange-100'}`}>
                      <IconBook className={`size-[60px] rounded-full p-4 text-orangeFpt bg-orange-100 
                        ${shareType == EDITOR_TYPE.STORY && '!bg-orangeFpt text-white'}`} />
                      <span className={`text-sm ${shareType == EDITOR_TYPE.STORY && 'text-orangeFpt'}`}>Your feed</span>
                    </div>
                    <div
                      onClick={() => { setShareType(EDITOR_TYPE.GROUP, setIsChooseGroup(!isChooseGroup)) }}
                      className={`h-[100px] w-[85px] pt-2 rounded-lg flex flex-col items-center cursor-pointer
                       ${shareType == EDITOR_TYPE.GROUP && 'bg-orange-100'}`}>
                      <IconUsersGroup className={`size-[60px] rounded-full p-4 text-orangeFpt bg-orange-100 
                        ${shareType == EDITOR_TYPE.GROUP && '!bg-orangeFpt text-white'}`} />
                      <span className={`text-sm ${shareType == EDITOR_TYPE.GROUP && 'text-orangeFpt'}`}>Your group</span>
                    </div>
                  </div>
                </div>
              </div >

            </form >
          )
            : isChooseGroup && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className='flex flex-col h-fit'
              >
                <div className='h-[10%] flex justify-between items-center border-b p-4'>
                  <IconChevronLeft className='bg-orangeFpt text-white rounded-full size-9 cursor-pointer hover:bg-orange-700'
                    onClick={() => {
                      setIsChooseGroup(!isChooseGroup)
                      if (!chooseGroup)
                        setShareType(EDITOR_TYPE.STORY)
                    }}
                  />
                  <span className='text-2xl font-bold'>Share to a group</span>
                  <span></span>
                </div>
                <div className='h-[90%] overflow-y-auto no-scrollbar px-2 py-2 flex flex-col gap-2 bg-fbWhite' >
                  {
                    listGroup?.map(e => (
                      <div key={e?.groupId} className='flex gap-2 items-center cursor-pointer hover:bg-orange-100 p-2 rounded-lg'
                        onClick={() => { setChooseGroup(e), setIsChooseGroup(!isChooseGroup) }}
                      >
                        <GroupAvatar avatarSrc={e?.coverImage} size={12} />
                        <span className='font-semibold capitalize'>{e?.groupName}</span>
                      </div>
                    ))
                  }
                </div >
              </motion.div>
            )}
        </div >
      </div >
    </Modal>
  )
}

export default SharePost
