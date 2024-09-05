import { Button } from '@mui/material'
import { useConfirm } from 'material-ui-confirm'
import { useDispatch } from 'react-redux'
import { handleReport } from '~/apis/report'
import { triggerReload } from '~/redux/ui/uiSlice'

const ReportHandler = ({ param, removeFunction, setOpen }) => {
  const confirm = useConfirm()
  const dispatch = useDispatch()

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
        handleReport({ 'reportType': 'User', 'isAccepted': true, ...param })
          .then(() => removeFunction())
      })
      .catch(() => {
        handleReport({ 'reportType': 'User', 'isAccepted': false, ...param })
      })
      .finally(() => {
        setOpen(false)
        dispatch(triggerReload())
      })
  }

  return (
    <Button variant='contained' color='primary' sx={{ height: '30px' }} onClick={handleReportPost} size='small'>Handle Report</Button>
  )
}

export default ReportHandler