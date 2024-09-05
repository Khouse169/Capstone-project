import { Button, IconButton, Modal } from '@mui/material'
import { IconArrowBackUp } from '@tabler/icons-react'
import { useCallback, useEffect, useState } from 'react'
import { handleReport } from '~/apis/report'
import { getListReportComment, getListReportGroup, getListReportUser } from '~/apis/adminApis/reportsApis'
import { useConfirm } from 'material-ui-confirm'
import { useDispatch } from 'react-redux'
import { triggerReload } from '~/redux/ui/uiSlice'
import ListUserReported from '../ListUserReported'
import { POST_TYPES } from '~/utils/constants'
import { cleanAndParseHTML } from '~/utils/formatters'
import { deleteCommentSharePost, deleteCommentUserPhotoPost, deleteCommentUserPost, deleteCommentUserVideoPost } from '~/apis/postApis'
import { deleteCommentGroupPhotoPost, deleteCommentGroupPost, deleteCommentGroupSharePost } from '~/apis/groupPostApis'
import UserAvatar from '~/components/UI/UserAvatar'

function DetailCommentReport({ open, setOpen, reportedComment }) {
  const handleClose = () => setOpen(false)
  const dispatch = useDispatch()

  const [reportedObject, setReportedObject] = useState({})

  let paramComment = {}
  let commentId = ''
  // let fetchFunction
  let removeFunction

  if (reportedComment?.commentId) {
    commentId = reportedComment?.commentId
    // fetchFunction = getUserPostById
    removeFunction = deleteCommentUserPost
    paramComment = { commentId: commentId }
  }
  else if (reportedComment?.commentPhotoPostId) {
    // postType = POST_TYPES.PHOTO_POST
    commentId = reportedComment?.commentPhotoPostId
    removeFunction = deleteCommentUserPhotoPost
    paramComment = { commentPhotoPostId: commentId }
  }
  else if (reportedComment?.commentVideoPostId) {
    // postType = POST_TYPES.VIDEO_POST
    commentId = reportedComment?.commentVideoPostId
    // fetchFunction = getChildPostById
    removeFunction = deleteCommentUserVideoPost
    paramComment = { commentVideoPostId: commentId }
  }
  else if (reportedComment?.commentGroupPostId) {
    // postType = POST_TYPES.GROUP_POST
    commentId = reportedComment?.commentGroupPostId
    // fetchFunction = getGroupPostByGroupPostId
    removeFunction = deleteCommentGroupPost
    paramComment = { commentGroupPostId: commentId }
  }
  else if (reportedComment?.commentGroupVideoPostId) {
    // postType = POST_TYPES.GROUP_VIDEO_POST
    commentId = reportedComment?.commentGroupVideoPostId
    // fetchFunction = getChildGroupPost
    paramComment = { commentGroupVideoPostId: commentId }
  }
  else if (reportedComment?.commentPhotoGroupPostId) {
    // postType = POST_TYPES.GROUP_PHOTO_POST
    commentId = reportedComment?.commentPhotoGroupPostId
    // fetchFunction = getChildGroupPost
    removeFunction = deleteCommentGroupPhotoPost
    paramComment = { commentPhotoGroupPostId: commentId }
  }
  else if (reportedComment?.commentSharePostId) {
    // postType = POST_TYPES.SHARE_POST
    commentId = reportedComment?.commentSharePostId
    // fetchFunction = getUserPostById
    removeFunction = deleteCommentSharePost
    paramComment = { commentSharePostId: commentId }
  }
  else if (reportedComment?.commentGroupSharePostId) {
    // postType = POST_TYPES.GROUP_SHARE_POST
    commentId = reportedComment?.commentGroupSharePostId
    // fetchFunction = getGroupPostByGroupPostId
    removeFunction = deleteCommentGroupSharePost
    paramComment = { commentGroupSharePostId: commentId }
  }
  useEffect(() => {
    (async () => {
      // await fetchFunction(commentId).then(data => {
      //   setReportedObject({ ...data, postType: postType })
      // })
    })()
  }, [])

  const getUserReportedFn = useCallback(({ page }) => getListReportComment({ page, ...paramComment }), [])

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
        handleReport({ 'reportType': 'Comment', 'isAccepted': true, ...paramComment }).then(() => removeFunction(commentId))
      })
      .catch(() => {
        handleReport({ 'reportType': 'Comment', 'isAccepted': false, ...paramComment })
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
                <div>
                  <UserAvatar avatarSrc={reportedComment?.reportedAvatarUrl} />
                </div>
                <div className='flex items-center gap-2 cursor-pointer' >
                  <span className='font-semibold capitalize text-black'>{cleanAndParseHTML(reportedComment?.content)}</span>
                  <div className='max-w-[300px]'>
                    {(() => {
                      const mediaContent = cleanAndParseHTML(reportedComment?.content, true)
                      if (Array.isArray(mediaContent) && mediaContent.length > 0) {
                        const firstMedia = mediaContent[0]
                        if (firstMedia.type === 'image') {
                          return <img src={firstMedia.url} alt="Report content" />
                        } else if (firstMedia.type === 'video') {
                          return <video src={firstMedia.url} controls />
                        }
                      }
                      return null
                    })()}
                  </div>
                </div>
              </div>
            </div>
            <ListUserReported getUserReportedFn={getUserReportedFn} />
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default DetailCommentReport
