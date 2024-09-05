import MenuItem from '@mui/material/MenuItem'
import Menu from '@mui/material/Menu'
import FormControl from '@mui/material/FormControl'
import FormControlLabel from '@mui/material/FormControlLabel'
import Modal from '@mui/material/Modal'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import { IconBookmark, IconMessageReport, IconPencil, IconTrash, IconX } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { Link, useLocation } from 'react-router-dom'
import { IconDots } from '@tabler/icons-react'
import UserAvatar from '~/components/UI/UserAvatar'
import { compareDateTime } from '~/utils/formatters'
import { useDispatch, useSelector } from 'react-redux'
import { selectIsShowModalUpdatePost, showModalUpdatePost, updateCurrentActivePost } from '~/redux/activePost/activePostSlice'
import { selectListUserStatus } from '~/redux/sideData/sideDataSlice'
import { POST_TYPES, REPORT_TYPES } from '~/utils/constants'
import GroupAvatar from '~/components/UI/GroupAvatar'
import { deleteSharePost, deleteUserPost } from '~/apis/postApis'
import { triggerReload } from '~/redux/ui/uiSlice'
import { useConfirm } from 'material-ui-confirm'
import { selectCurrentActiveListPost, updateCurrentActiveListPost } from '~/redux/activeListPost/activeListPostSlice'
import { deleteGroupPost, deleteGroupSharePost } from '~/apis/groupPostApis'
import { addReport, openModalReport } from '~/redux/report/reportSlice'
import { useTranslation } from 'react-i18next'


function PostTitle({ postData, isYourPost, postType, isBan, isAdmin = false }) {
  const [isOpenModal, setIsOpenModal] = useState(false)
  const listStatus = useSelector(selectListUserStatus)
  const { t } = useTranslation()

  const currentActiveListPost = useSelector(selectCurrentActiveListPost)
  const { register, setValue, control, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
    }
  })
  const location = useLocation()
  const isInGroupPath = /^\/groups\/\w+\/?.*$/.test(location.pathname)

  const isProfile = postType == POST_TYPES.PROFILE_POST
  const isPhoto = postType == POST_TYPES.PHOTO_POST
  const isVideo = postType == POST_TYPES.VIDEO_POST
  const isShare = postType == POST_TYPES.SHARE_POST
  const isGroup = postType == POST_TYPES.GROUP_POST
  const isGroupPhoto = postType == POST_TYPES.GROUP_PHOTO_POST
  const isGroupVideo = postType == POST_TYPES.GROUP_VIDEO_POST
  const isGroupShare = postType == POST_TYPES.GROUP_SHARE_POST

  const isShowModalUpdatePost = useSelector(selectIsShowModalUpdatePost)
  const dispatch = useDispatch()
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = () => {
    setAnchorEl(null)
  }

  const handleEdit = () => {
    dispatch(showModalUpdatePost())
    dispatch(updateCurrentActivePost({ ...postData, postType: postType }))
  }

  const confirm = useConfirm()
  const handleRemovePost = () => {
    confirm({
      title: (
        <div className='flex flex-col gap-2'>
          <div className='font-bold text-[#d22e2e]'>Delete this post?</div>
        </div>
      ),
      description: ('This a permanent action and cannot be undone. All content and associated comments will be permanently removed from the system.'),
      confirmationButtonProps: { color: 'error', variant: 'contained' },
      confirmationText: 'Delete',
      cancellationText: 'Cancel'
    }).then(() => {
      (
        isProfile ? deleteUserPost(postData?.postId)
          : isShare ? deleteSharePost(postData?.postId)
            : isGroup ? deleteGroupPost(postData?.postId)
              : isGroupShare && deleteGroupSharePost(postData?.postId)
      ).then(() => {
        dispatch(triggerReload())
      })
    }).catch(() => { })
  }

  return (
    <div id="post-title"
      className="w-full flex justify-between items-center px-4 py-2">
      <div className={`w-full flex gap-4 ${isBan && 'pointer-events-none'}`}>
        <div className='flex items-center relative'>
          {(isGroup || isGroupShare) && !isInGroupPath ?
            <>
              <Link to={`/groups/${postData?.groupId}`} className="text-gray-500 hover:text-gray-950">
                <GroupAvatar avatarSrc={postData?.groupCorverImage} />
              </Link>
              <Link to={`/profile?id=${postData?.userId || postData?.photo?.userId}`}
                className="absolute text-gray-500 hover:text-gray-950 -bottom-[2px] -right-2">
                <UserAvatar avatarSrc={postData?.userAvata?.avataPhotosUrl || postData?.userAvatar?.avataPhotosUrl || postData?.avatar?.avataPhotosUrl} size={1.8} />
              </Link>
            </>
            : <Link to={`/profile?id=${postData?.userId || postData?.photo?.userId}`} className="text-gray-500 hover:text-gray-950 ">
              <UserAvatar avatarSrc={postData?.userAvatar?.avataPhotosUrl || postData?.avatar?.avataPhotosUrl} />
            </Link>
          }
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex gap-2 ">
            {(isGroup || isGroupShare) && !isInGroupPath
              ? <Link to={`/groups/${postData?.groupId}`} className="flex gap-2 font-bold font-sans capitalize hover:underline">
                {postData?.groupName}
              </Link>
              : <Link to={`/profile?id=${postData?.userId || postData?.photo?.userId}`} className="flex gap-2 font-bold font-sans capitalize hover:underline">
                {postData?.fullName || postData?.userName}
              </Link>
            }
            {
              postData?.isAvataPost ? <span className='text-gray-500 font-normal text-tr'>{t('sideText.avatarPost')}</span>
                : postData?.isCoverPhotoPost && <span className='text-gray-500 font-normal text-tr'>{t('sideText.coverPost')}</span>
            }
          </div>
          <div className="flex justify-start gap-1 text-gray-500 text-sm">
            {((isGroup || isGroupShare) && !isInGroupPath &&
              <>
                <Link to={`/profile?id=${postData?.userId || postData?.photo?.userId}`} className='font-semibold capitalize hover:underline'>
                  {postData?.userName}
                </Link>
                <span className='font-semibold'>.</span>
              </>
            )}
            {
              (isGroup || isGroupShare) ? <a href={`/groups/${postData?.groupId}/post/${postData?.userPostId || postData?.postId}?share=${isGroupShare ? 1 : 0}`} className='font-thin'>
                {compareDateTime(postData?.createdAt || postData?.createdDate)}
              </a>
                : <Link to={`/post/${postData?.userPostId || postData?.postId}?share=${isShare ? 1 : 0}`} className='font-thin'>
                  {compareDateTime(postData?.createdAt || postData?.createdDate)}
                </Link>
            }
            {/* <Link to={`/post/${postData?.userPostId || postData?.postId}`} className='font-thin'>
              {compareDateTime(postData?.createdAt)}
            </Link> */}
            <span
              // onClick={() => { isYourPost && !isGroup && !isGroupShare && setIsOpenModal(!isOpenModal) }}
              // ${isYourPost && !isGroup && !isGroupShare && 'cursor-pointer'}
              className={`text-gray-900 font-bold ${''}`}>
              {postData?.userStatus?.userStatusName || postData?.status?.userStatusName || postData?.groupStatus?.groupStatusName}
            </span>

            {/* <Modal
              open={isOpenModal}
              onClose={() => setIsOpenModal(!isOpenModal)}
              aria-labelledby="parent-modal-title"
              aria-describedby="parent-modal-description"
            >
              <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-md'>
                <div className='h-[60px]  flex justify-between items-center px-5 border-b '>
                  <span></span>
                  <span className='text-2xl font-bold'>Select audience</span>
                  <IconX className='bg-orangeFpt text-white rounded-full size-9 cursor-pointer hover:bg-orange-700'
                    onClick={() => setIsOpenModal(!isOpenModal)} />
                </div>
                <div className='px-4 pb-10 ' >
                  <div>
                    <div className='font-bold '>Who can see your post?</div>
                    <div className='text-sm'>
                      Your post will show up in Feed, on your profile and in search results.<br /><br />
                      Your default audience is set to Public, but you can change the audience of this specific post.
                    </div>
                  </div>
                  <div>
                    <FormControl fullWidth className="col-span-12" error={!!errors.groupType}>
                      <Controller
                        name="postStatus"
                        control={control}
                        defaultValue={postData?.userStatus?.userStatusId || postData?.status?.userStatusId}
                        // rules={{ required: FIELD_REQUIRED_MESSAGE }}
                        render={({ field }) => (
                          <RadioGroup
                            {...field}
                            value={field.value || ''}
                          >
                            {listStatus?.map(status => (
                              <FormControlLabel key={status.userStatusId} value={status.userStatusId} control={<Radio />} label={status.statusName} />
                            ))}
                          </RadioGroup>
                        )}
                      />
                    </FormControl>
                  </div>
                </div >
              </div>
            </Modal> */}
          </div>
        </div>
      </div>
      {
        !isAdmin && <div
          className="rounded-full flex justify-center items-center hover:bg-fbWhite cursor-pointer size-10"
          onClick={handleClick}
        ><IconDots /></div>
      }

      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        {/* <MenuItem onClick={handleClose} sx={{ gap: '5px' }}>
          <IconBookmark /> Save post
        </MenuItem> */}
        {
          isYourPost && (postType == POST_TYPES.PROFILE_POST || postType == POST_TYPES.GROUP_POST) && (
            <MenuItem onClick={() => { handleClose(); handleEdit() }} sx={{ gap: '5px' }} >
              <IconPencil /> Edit post
            </MenuItem>
          )
        }
        {
          isYourPost && (
            <MenuItem onClick={() => { handleClose(); handleRemovePost() }} sx={{ gap: '5px' }} >
              <IconTrash /> Remove post
            </MenuItem>
          )
        }
        {!isYourPost &&
          <MenuItem
            onClick={() => {
              dispatch(addReport({ reportData: { ...postData, type: postType }, reportType: REPORT_TYPES.POST }))
              dispatch(openModalReport())
              handleClose()
            }}
            sx={{ gap: '5px' }}>
            <IconMessageReport /> Report
          </MenuItem>
        }
      </Menu>
    </div>
  )
}

export default PostTitle