import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Button, Tab } from '@mui/material'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getAllReactByCommentGroupSharePostId, getAllReactByGroupCommentId, getAllReactByGroupCommentPhotoId, getAllReactByGroupCommentVideoId } from '~/apis/groupPostApis'
import { getAllReactByCommentId, getAllReactByCommentPhotoId, getAllReactByCommentSharePostId, getAllReactByCommentVideoId, getReactCommentPostDetail, getReactPostDetail } from '~/apis/reactApis'
import UserAvatar from '~/components/UI/UserAvatar'
import { FRONTEND_ROOT, POST_TYPES } from '~/utils/constants'
import likeEmoji from '~/assets/img/emojis/like.png'
import angryEmoji from '~/assets/img/emojis/angry.png'
import reactionImg from '~/assets/img/reaction.png'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { sendFriend, updateFriendStatus } from '~/apis'
import connectionSignalR from '~/utils/signalRConnection'
import InfiniteScroll from '~/components/IntersectionObserver/InfiniteScroll'
import { selectListUserStatus } from '~/redux/sideData/sideDataSlice'

function CommentReactDetail({ postType, comment }) {
  const currentUser = useSelector(selectCurrentUser)
  const [isLoadMore, setIsLoadMore] = useState(true)
  const [listPostReact, setListPostReact] = useState([])
  const [listUserReact, setListUserReact] = useState([])
  const [listUserReactByReactType, setListUserReactByReactType] = useState([])
  const [value, setValue] = useState(10)
  console.log('🚀 ~ CommentReactDetail ~ value:', value)
  const { t } = useTranslation()
  const [updatef, setUpdatef] = useState(false)
  const [page, setPage] = useState(1)
  console.log('🚀 ~ CommentReactDetail ~ page:', page)

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  let commentId = ''
  let commentTypeName = ''
  let getAllCommentReactFn = ''
  const isProfile = postType == POST_TYPES.PROFILE_POST
  const isShare = postType == POST_TYPES.SHARE_POST
  const isPhoto = postType == POST_TYPES.PHOTO_POST
  const isVideo = postType == POST_TYPES.VIDEO_POST
  const isGroup = postType == POST_TYPES.GROUP_POST
  const isGroupShare = postType == POST_TYPES.GROUP_SHARE_POST
  const isGroupPhoto = postType == POST_TYPES.GROUP_PHOTO_POST
  const isGroupVideo = postType == POST_TYPES.GROUP_VIDEO_POST

  if (isProfile) {
    commentId = comment?.commentId
    commentTypeName = 'CommentUserPost'
    getAllCommentReactFn = getAllReactByCommentId
  } else if (isShare) {
    commentId = comment?.commentSharePostId
    commentTypeName = 'CommentUserSharePost'
    getAllCommentReactFn = getAllReactByCommentSharePostId
  } else if (isPhoto) {
    commentId = comment?.commentPhotoPostId
    commentTypeName = 'CommentUserPhotoPost'
    getAllCommentReactFn = getAllReactByCommentPhotoId
  } else if (isVideo) {
    commentId = comment?.commentVideoPostId
    commentTypeName = 'CommentUserVideoPost'
    getAllCommentReactFn = getAllReactByCommentVideoId
  } else if (isGroup) {
    commentId = comment?.commentGroupPostId
    commentTypeName = 'CommentGroupPost'
    getAllCommentReactFn = getAllReactByGroupCommentId
  } else if (isGroupShare) {
    commentId = comment?.commentGroupSharePostId
    commentTypeName = 'CommentGroupSharePost'
    getAllCommentReactFn = getAllReactByCommentGroupSharePostId
  } else if (isGroupPhoto) {
    commentId = comment?.commentPhotoGroupPostId
    commentTypeName = 'CommentGroupPhotoPost'
    getAllCommentReactFn = getAllReactByGroupCommentPhotoId
  } else if (isGroupVideo) {
    commentId = comment?.commentGroupVideoPostId
    commentTypeName = 'CommentGroupVideoPost'
    getAllCommentReactFn = getAllReactByGroupCommentVideoId
  }

  useEffect(() => {
    getAllCommentReactFn(commentId, page).then(data => setListPostReact(data?.listReact))
  }, [])

  useEffect(() => {
    isLoadMore && setIsLoadMore(true)
    setPage(1)
    setListUserReact([])
    setListUserReactByReactType([])
  }, [value])

  useEffect(() => {
    value == 10 &&
      getAllCommentReactFn(commentId, page).then(data => {
        if (data?.listCommentReact?.length == 0) setIsLoadMore(false)
        setListUserReact([...listUserReact, ...data?.listCommentReact || []])
      })
  }, [updatef, page, value])


  useEffect(() => {
    listPostReact?.length > 0 && value != 10 &&
      getReactCommentPostDetail({ commentId: commentId, commentType: commentTypeName, reactName: listPostReact[value]?.reactTypeName, page: page, userId: currentUser?.userId })
        .then(data => {
          if (data?.listUserReact?.length == 0) setIsLoadMore(false)
          setListUserReactByReactType(data?.listUserReact)

        })
  }, [value, updatef, page])


  const handleAddFriend = async (data) => {
    try {
      const response = await sendFriend({ userId: currentUser?.userId, friendId: data?.userId })
      if (response) {
        const signalRData = {
          MsgCode: 'User-001',
          Receiver: data?.userId,
          Url: `${FRONTEND_ROOT}/profile?id=${currentUser?.userId}`,
          AdditionsMsd: '',
          ActionId: 'true'
        }
        await connectionSignalR.invoke('SendNotify', JSON.stringify(signalRData))
      }
      setUpdatef(!updatef)
    } catch (err) {
      console.error('Error while starting connection: ', err)
    }
  }

  const handleCancelFriendRequest = (data) => {
    if (data?.status == 'Friend') return
    const submitData = {
      userId: currentUser?.userId,
      friendId: data?.userId,
      confirm: false,
      cancle: true,
      reject: false
    }
    updateFriendStatus(submitData).then(() => setUpdatef(!updatef))
  }

  return (
    <div className='p-1 w-[90%] xs:w-[400px] '>
      <TabContext value={value}>
        <Box sx={{
          borderBottom: 1,
          borderColor: 'divider',
          '.MuiTab-root': {
            height: '30px !important',
            minHeight: '30px',
            padding: '2px 8px',
            minWidth: 'auto',
            fontSize: '0.75rem',
          },
          '.MuiTabs-flexContainer': {
            height: '100%',
            justifyContent: 'center',
          },
          '.MuiTabScrollButton-root': {
            flex: '0 0 20px',
          }
        }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example">
            <Tab
              value={10}
              label={t('standard.react.all')}
            />
            {listPostReact?.map((e, index) => (
              <Tab
                key={e?.reactTypeId}
                value={index}
                icon={
                  <img
                    className='size-5'
                    src={e?.reactTypeName?.toLowerCase() == 'like' ? likeEmoji : angryEmoji}
                  />
                }
                iconPosition="start"
                label={String(e?.numberReact)}
              />
            ))}
          </TabList>
        </Box>
        <div className='p-1 h-[200px] overflow-y-auto scrollbar-none-track'>
          <div className='flex flex-col gap-1'>
            <InfiniteScroll
              className={'min-h-[200px]'}
              fetchMore={() => setPage((prev) => prev + 1)}
              hasMore={isLoadMore}
            >
              {
                (value == 10 ? listUserReact : listUserReactByReactType)?.map(e => (
                  <Link to={`/profile?id=${e?.userId}`} key={e?.userId} className='flex items-center justify-between hover:bg-gray-100 p-2 rounded-md'>
                    <div className='flex gap-2 items-center'>
                      <div className='relative'>
                        <UserAvatar avatarSrc={e?.avataUrl} />
                        <img
                          className='size-5 absolute right-0 bottom-0 border border-white rounded-full'
                          src={(e?.reactTypeName || e?.reactName)?.toLowerCase() == 'like' ? likeEmoji : angryEmoji}
                        />
                      </div>
                      <div className=''>
                        <p className='capitalize'>{e?.userName}</p>
                      </div>
                    </div>
                    <div>
                      {currentUser?.userId !== e?.userId &&
                        (e?.status == 'NotFriend' ?
                          <Button size='small' onClick={(event) => {
                            event.stopPropagation()
                            event.preventDefault()
                            handleAddFriend(e)
                          }}>
                            {t('standard.profile.addFriend')}
                          </Button>
                          : <Button variant={e?.status == 'Friend' ? 'contained' : 'outlined'} size='small' onClick={(event) => {
                            event.stopPropagation()
                            event.preventDefault()
                            handleCancelFriendRequest(e)
                          }}>
                            {
                              e?.status == 'Friend'
                                ? t('standard.profile.friend')
                                : t('standard.profile.cancelRequest')
                            }
                          </Button>)}
                    </div>
                  </Link>
                ))
              }
            </InfiniteScroll>
            {
              listUserReactByReactType?.length == 0 && value !== 10 &&
              <div className='flex flex-col items-center text-gray-500/90'>
                <img src={reactionImg} className='size-12' />
                <p>{t('standard.react.noReact')}</p>
              </div>
            }
          </div>
        </div>
      </TabContext>
    </div>)
}

export default CommentReactDetail
