import { Button, IconButton, Modal, Pagination } from '@mui/material'
import { IconArrowBackUp } from '@tabler/icons-react'
import { useCallback, useEffect, useState } from 'react'
import { handleReport } from '~/apis/report'
import Post from '~/components/ListPost/Post/Post'
import { POST_TYPES } from '~/utils/constants'
import { getListReportPost } from '~/apis/adminApis/reportsApis'
import { deleteGroupPost, deleteGroupSharePost, getChildGroupPost, getGroupPostByGroupPostId } from '~/apis/groupPostApis'
import { deleteSharePost, deleteUserPost, getChildPostById, getUserPostById } from '~/apis/postApis'
import { useConfirm } from 'material-ui-confirm'
import { useDispatch } from 'react-redux'
import { triggerReload } from '~/redux/ui/uiSlice'
import ListUserReported from '../ListUserReported'

function ReportDetailModal({ open, setOpen, postReport }) {
  const handleClose = () => setOpen(false)
  const dispatch = useDispatch()

  const [reportedObject, setReportedObject] = useState({})

  let paramPostId = {}
  let postType = ''
  let postId = ''
  let fetchFunction
  let removeFunction

  if (postReport?.userPostId) {
    postType = POST_TYPES.PROFILE_POST
    postId = postReport?.userPostId
    fetchFunction = getUserPostById
    removeFunction = deleteUserPost
    paramPostId = { userPostId: postId }
  }
  else if (postReport?.userPostPhotoId) {
    postType = POST_TYPES.PHOTO_POST
    postId = postReport?.userPostPhotoId
    fetchFunction = getChildPostById
    paramPostId = { ...paramPostId, userPostPhotoId: postId }
  }
  else if (postReport?.userPostVideoId) {
    postType = POST_TYPES.VIDEO_POST
    postId = postReport?.userPostVideoId
    fetchFunction = getChildPostById
    paramPostId = { ...paramPostId, userPostVideoId: postId }
  }
  else if (postReport?.groupPostId) {
    postType = POST_TYPES.GROUP_POST
    postId = postReport?.groupPostId
    fetchFunction = getGroupPostByGroupPostId
    removeFunction = deleteGroupPost
    paramPostId = { ...paramPostId, groupPostId: postId }
  }
  else if (postReport?.groupPostVideoId) {
    postType = POST_TYPES.GROUP_VIDEO_POST
    postId = postReport?.groupPostVideoId
    fetchFunction = getChildGroupPost
    paramPostId = { ...paramPostId, groupPostVideoId: postId }
  }
  else if (postReport?.groupPostPhotoId) {
    postType = POST_TYPES.GROUP_PHOTO_POST
    postId = postReport?.groupPostPhotoId
    fetchFunction = getChildGroupPost
    paramPostId = { ...paramPostId, groupPostPhotoId: postId }
  }
  else if (postReport?.sharePostId) {
    postType = POST_TYPES.SHARE_POST
    postId = postReport?.sharePostId
    fetchFunction = getUserPostById
    removeFunction = deleteSharePost
    paramPostId = { ...paramPostId, sharePostId: postId }
  }
  else if (postReport?.groupSharePostId) {
    postType = POST_TYPES.GROUP_SHARE_POST
    postId = postReport?.groupSharePostId
    fetchFunction = getGroupPostByGroupPostId
    removeFunction = deleteGroupSharePost
    paramPostId = { ...paramPostId, groupSharePostId: postId }
  }

  useEffect(() => {
    (async () => {
      await fetchFunction(postId).then(data => {
        setReportedObject({ ...data, postType: postType })
      })
    })()
  }, [])

  const getUserReportedFn = useCallback(({ page }) => getListReportPost({ ...paramPostId, page }), [])

  const confirm = useConfirm()
  const handleReportPost = () => {
    confirm({
      title: "Xử lý báo cáo",
      allowClose: true,
      description: "Bạn muốn xử lý báo cáo này như thế nào?",
      confirmationText: "Vi phạm",
      cancellationText: "An toàn",
      confirmationButtonProps: {
        variant: "contained",
        color: "error"
      },
      cancellationButtonProps: {
        variant: "contained",
        color: "primary"
      },
    })
      .then(() => {
        handleReport({ 'reportType': 'Post', 'isAccepted': true, ...paramPostId }).then(() => removeFunction(postId))
      })
      .catch(() => {
        handleReport({ 'reportType': 'Post', 'isAccepted': false, ...paramPostId })
      })
      .finally(() => {
        setOpen(false)
        dispatch(triggerReload())
      })
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className='w-screen h-screen bg-white '>
        <div className='h-full'>
          <div className='flex py-1 px-5 gap-10'>
            <IconButton color="warning" onClick={handleClose} >
              <IconArrowBackUp />
            </IconButton>
            <div className='flex items-center gap-2'>
              <Button variant='contained' color='primary' sx={{ height: '30px' }} onClick={handleReportPost} size='small'>Handle Report</Button>
            </div>
          </div>
          <div className='border h-full grid grid-cols-12'>
            <div className='col-span-7 border-r  overflow-y-auto scrollbar-none-track '>
              <div className='pointer-events-none mb-20 mt-4 flex justify-center'>
                <Post postData={reportedObject} />
              </div>
            </div>
            <ListUserReported getUserReportedFn={getUserReportedFn} />
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ReportDetailModal
