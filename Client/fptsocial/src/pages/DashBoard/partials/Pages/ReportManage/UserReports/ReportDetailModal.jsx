import { Button, IconButton, Modal } from '@mui/material'
import { IconArrowBackUp } from '@tabler/icons-react'
import { useCallback, useEffect, useState } from 'react'
import { handleReport } from '~/apis/report'
import { deactiveUserByUserId, getListReportUser } from '~/apis/adminApis/reportsApis'
import { useConfirm } from 'material-ui-confirm'
import { useDispatch } from 'react-redux'
import { triggerReload } from '~/redux/ui/uiSlice'
import ListUserReported from '../ListUserReported'
import { getOtherUserPost } from '~/apis/postApis'
import ListPost from '~/components/ListPost/ListPost'

function ReportProfileDetailModal({ open, setOpen, userId }) {
  const handleClose = () => setOpen(false)
  const dispatch = useDispatch()

  const [reportedObject, setReportedObject] = useState({})
  const getUserReportedFn = useCallback(({ page }) => getListReportUser({ page, userId: userId }), [])

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
        handleReport({ 'reportType': 'User', 'isAccepted': true, userId: userId }).then(() => deactiveUserByUserId(userId))
      })
      .catch(() => {
        handleReport({ 'reportType': 'User', 'isAccepted': false, userId: userId })
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
          <div className='border h-full grid grid-cols-12 '>
            <div className='col-span-7 border-r  overflow-y-auto scrollbar-none-track bg-fbWhite'>
              <div className=' mb-20 mt-4 flex justify-center'>
                <ListPost getListPostFn={({ page, pageSize }) => getOtherUserPost({ userId: userId, page, pageSize })} isBan={true} isAdmin={true} />
              </div>
            </div>
            <ListUserReported getUserReportedFn={getUserReportedFn} />
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default ReportProfileDetailModal
