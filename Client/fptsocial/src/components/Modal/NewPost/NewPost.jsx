import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Tiptap from '../../TitTap/TitTap'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { getStatus } from '~/apis'
import { IconCaretDownFilled, IconX } from '@tabler/icons-react'
import { createPost } from '~/apis/postApis'
import UserAvatar from '../../UI/UserAvatar'
import { EDITOR_TYPE, POST_TYPES } from '~/utils/constants'
import { createGroupPost } from '~/apis/groupPostApis'
import { triggerReload } from '~/redux/ui/uiSlice'
import { FormControl, FormControlLabel, Modal, Popover, Radio, RadioGroup } from '@mui/material'
import { clearAndHireCurrentActivePost, selectIsShowModalCreatePost, showModalCreatePost } from '~/redux/activePost/activePostSlice'
import { useTranslation } from 'react-i18next'
import EditMedia from '../EditMedia'
import { getGroupByGroupId } from '~/apis/groupApis'

function NewPost({ postType, groupId }) {

  const { handleSubmit } = useForm()
  const [isEdit, setIsEdit] = useState(false)
  const [content, setContent] = useState(null)
  const [listMedia, setListMedia] = useState([])
  const [listStatus, setListStatus] = useState([])
  const [choseStatus, setChoseStatus] = useState()
  const currentUser = useSelector(selectCurrentUser)
  const isShowModalCreatePost = useSelector(selectIsShowModalCreatePost)
  const isProfile = postType === POST_TYPES.PROFILE_POST
  const isGroup = postType === POST_TYPES.GROUP_POST
  const { t } = useTranslation()

  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  const open = Boolean(anchorEl)
  const id = open ? 'simple-popover' : undefined

  const dispatch = useDispatch()

  useEffect(() => {
    if (isProfile) {
      getStatus().then(data => setListStatus(data))
    } else if (isGroup) {
      getGroupByGroupId(groupId).then(data => setChoseStatus(data?.groupSettings?.find(e => e?.groupSettingName == 'Group Status')))
      // setChoseStatus(currentActiveGroup?.groupSettings?.find(e => e?.groupSettingName === 'Group Status'))
    }
  }, [postType])

  useEffect(() => {
    if (isProfile) {
      setChoseStatus(listStatus?.find(e => e?.statusName?.toLowerCase() === 'public'))
    }
  }, [listStatus])

  const submitPost = () => {
    const listPhoto = listMedia.map((media, index) =>
      media.type === 'image' ? { photoUrl: media.url, position: index } : undefined
    ).filter(Boolean)

    const listVideo = listMedia.map((media, index) =>
      media.type === 'video' ? { videoUrl: media.url, position: index } : undefined
    ).filter(Boolean)

    const submitData = {
      userId: currentUser?.userId,
      content: content ?? '',
      photos: listPhoto,
      videos: listVideo,
      ...(isProfile && { userStatusId: choseStatus?.userStatusId }),
      ...(isGroup && { groupId, groupStatusId: choseStatus?.groupStatusId }),
    }

    const postFunction = isProfile ? createPost : createGroupPost
    postFunction(submitData).then(() => {
      clearData()
      dispatch(triggerReload())
      toast.success('Posted!')
    }).catch((error) => {
      if (error?.response?.data?.statusCode == "UP01") {
        toast.warn('Your post contains sensitive words ! Please check the banned posts on your profile page !', {
          position: "top-right",
          autoClose: false,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        })
        clearData()
        dispatch(triggerReload())
      }
    })
  }

  const clearData = () => {
    dispatch(clearAndHireCurrentActivePost())
    setListMedia([])
    setContent(null)
  }

  const handleEdit = () => {
    setIsEdit(!isEdit)
  }

  const handleRemove = (index) => {
    setListMedia(listMedia.filter((_, i) => i !== index))
  }

  return (
    <div id="new-post" className="w-full mt-8 lg:w-[600px] flex flex-col gap-2 p-4 rounded-lg shadow-lg bg-white">
      <div className="flex gap-4 items-center w-full">
        <Link to={`/profile?id=${currentUser?.userId}`} className="hover:text-gray-950 flex items-center justify-center gap-3">
          <UserAvatar isOther={false} />
        </Link>
        <div className="w-[90%] bg-fbWhite rounded-3xl hover:bg-fbWhite-500 cursor-pointer" onClick={() => dispatch(showModalCreatePost())}>
          <p className="px-3 py-3 max-sm:text-sm font-medium text-gray-500">
            {t('sideText.yourMind')}, {currentUser?.firstName + ' ' + currentUser?.lastName}?
          </p>
        </div>
      </div>
      <Modal open={isShowModalCreatePost} onClose={clearData}>
        <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] lg:w-[800px] max-h-[90%] rounded-md overflow-y-auto scrollbar-none-track'>
          <div className='bg-white min-h-full shadow-4edges'>
            {!isEdit ? (
              <form onSubmit={handleSubmit(submitPost)} className='h-full '>
                <div className='flex flex-col h-full'>
                  <div className='h-[60px] flex justify-between items-center px-2 border-b'>
                    <span></span>
                    <span className='text-2xl font-bold'>{t('standard.newPost.createPost')}</span>
                    <IconX className='bg-orangeFpt text-white rounded-full size-9 cursor-pointer hover:bg-orange-700' onClick={clearData} />
                  </div>
                  <div className='mx-4'>
                    <div className='flex items-center h-[40] gap-2'>
                      <UserAvatar isOther={false} />
                      <div className='flex flex-col w-full cursor-pointer'>
                        <span className='font-bold'>{currentUser?.firstName + ' ' + currentUser?.lastName}</span>
                        <div
                          onClick={(e) => isProfile && handleClick(e)}
                          className={`flex items-center gap-1 text-xs ${isProfile ? 'cursor-pointer bg-orangeFpt' : 'bg-orange-400'} text-white font-bold py-1 px-2 w-fit rounded-lg`}
                        >
                          <span>{choseStatus?.statusName || choseStatus?.groupStatusName}</span>
                          {isProfile && <IconCaretDownFilled className='size-4' />}
                        </div>
                        <Popover
                          id={id}
                          open={open}
                          anchorEl={anchorEl}
                          onClose={handleClose}
                          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                        >
                          <FormControl>
                            <RadioGroup
                              aria-labelledby="demo-radio-buttons-group-label"
                              value={JSON.stringify(choseStatus) || ''}
                              onChange={e => setChoseStatus(JSON.parse(e.target.value))}
                              name="radio-buttons-group"
                              className='p-2'
                            >
                              {listStatus.map(status => (
                                <FormControlLabel
                                  key={status.userStatusId || status.groupStatusId}
                                  value={JSON.stringify(status)}
                                  control={<Radio />}
                                  label={status.statusName || status.groupStatusName}
                                />
                              ))}
                            </RadioGroup>
                          </FormControl>
                        </Popover>
                      </div>
                    </div>
                  </div>
                  <div className='pb-1 text-2xl'>
                    <Tiptap setContent={setContent} content={content} postType={postType} listMedia={listMedia} setListMedia={setListMedia} handleEdit={handleEdit} />
                  </div>
                  <div className='interceptor-loading py-4 flex justify-center items-center'>
                    <button className={`h-9 w-full mx-4 bg-orangeFpt font-bold text-white rounded-lg cursor-pointer
                    ${(!content?.replace(/<\/?[^>]+(>|$)/g, "") && listMedia.length == 0) && 'opacity-50 pointer-events-none'}`}
                    >
                      {t('standard.newPost.post')}
                    </button>
                  </div>
                </div>
              </form>
            ) : (
              <EditMedia handleEdit={handleEdit} handleRemove={handleRemove} listMedia={listMedia} setListMedia={setListMedia} />
            )}
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default NewPost