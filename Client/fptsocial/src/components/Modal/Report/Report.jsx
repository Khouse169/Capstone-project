// import React from 'react'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { IconX } from '@tabler/icons-react'
import { POST_TYPES, REPORT_TYPES } from '~/utils/constants'
import { triggerReload } from '~/redux/ui/uiSlice'
import { Modal } from '@mui/material'
import { clearReport, selectIsOpenReport, selectReportData, selectReportType } from '~/redux/report/reportSlice'
import { createReportComment, createReportPost, createReportProfile, getReportType } from '~/apis/report'


function Report() {
  const currentUser = useSelector(selectCurrentUser)
  const reportData = useSelector(selectReportData)
  console.log('🚀 ~ Report ~ reportData:', reportData)
  const reportType = useSelector(selectReportType)

  const [listReportType, setListReportType] = useState(null)

  const dispatch = useDispatch()
  const isOpenModalReport = useSelector(selectIsOpenReport)

  const isPost = reportType == REPORT_TYPES.POST
  const isProfile = reportType == REPORT_TYPES.PROFILE
  const isComment = reportType == REPORT_TYPES.COMMENT

  const isProfilePost = reportData?.type == POST_TYPES.PROFILE_POST
  const isPhoto = reportData?.type == POST_TYPES.PHOTO_POST
  const isVideo = reportData?.type == POST_TYPES.VIDEO_POST
  const isShare = reportData?.type == POST_TYPES.SHARE_POST
  const isGroup = reportData?.type == POST_TYPES.GROUP_POST
  const isGroupPhoto = reportData?.type == POST_TYPES.GROUP_PHOTO_POST
  const isGroupVideo = reportData?.type == POST_TYPES.GROUP_VIDEO_POST
  const isGroupShare = reportData?.type == POST_TYPES.GROUP_SHARE_POST

  useEffect(() => {
    getReportType().then(data => setListReportType(data))
  }, [])

  useEffect(() => {
  }, [])

  const handleReport = (typeId) => {
    let submitData = {}
    if (isPost) {
      submitData = {
        'reportById': currentUser?.userId,
        'groupPostId': isGroup ? (reportData?.postId || reportData?.groupPostId) : null,
        'userPostId': isProfilePost ? (reportData?.postId || reportData?.userPostId) : null,
        'userPostPhotoId': isPhoto ? (reportData?.userPostMediaId || reportData?.userPostPhotoId) : null,
        'reportTypeId': typeId,
        'userPostVideoId': isVideo ? (reportData?.userPostMediaId || reportData?.userPostVideoId) : null,
        'groupPostVideoId': isGroupVideo ? (reportData?.groupPostMediaId || reportData?.groupPostVideoId) : null,
        'groupPostPhotoId': isGroupPhoto ? (reportData?.groupPostMediaId || reportData?.groupPostPhotoId) : null
      }
    } else if (isProfile) {
      submitData = {
        'reportTypeId': typeId,
        'groupId': reportData?.groupId ?? null,
        'userId': reportData?.userId ?? null,
        'reportById': currentUser?.userId
      }
    } else if (isComment) {
      submitData = {
        reportTypeId: typeId,
        commentId: reportData?.commentId ?? null,
        commentPhotoPostId: reportData?.commentPhotoPostId ?? null,
        commentVideoPostId: reportData?.commentVideoPostId ?? null,
        commentGroupPostId: reportData?.commentGroupPostId ?? null,
        commentPhotoGroupPostId: reportData?.commentPhotoGroupPostId ?? null,
        commentGroupVideoPostId: reportData?.commentGroupVideoPostId ?? null,
        commentSharePostId: reportData?.commentSharePostId ?? null,
        commentGroupSharePostId: reportData?.commentGroupSharePostId ?? null,
        content: reportData?.content,
        reportById: currentUser?.userId
      }
    }
    toast.promise(
      isProfile ? createReportProfile(submitData)
        : isPost ? createReportPost(submitData)
          : isComment && createReportComment(submitData)
      ,
      { pending: 'Posting...' }
    ).then(() => {
      // dispatch(triggerReload())
      dispatch(clearReport())
      toast.success('Reported!')
    })
  }
  return (
    <div id="new-post"
      className="w-full sm:w-[500px] flex flex-col gap-2 border border-gray-300 p-4 rounded-lg shadow-lg bg-white"
    >

      <Modal
        open={isOpenModalReport}
        onClose={() => dispatch(clearReport())}
      >
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="w-full max-w-[500px] bg-white shadow-lg rounded-lg overflow-hidden transform transition-all">
            <div className="h-16 px-4 flex justify-between items-center border-b border-gray-200">
              <span></span>
              <span className="font-bold text-xl capitalize text-gray-800">
                Report
              </span>
              <button
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                onClick={() => dispatch(clearReport())}
              >
                <IconX className="text-gray-600 hover:text-red-600" />
              </button>
            </div>
            <div className="p-4 max-h-[70vh] overflow-y-auto">
              {listReportType?.map(report => (
                <div
                  key={report?.reportTypeId}
                  className="py-3 px-4 mb-2 cursor-pointer rounded-lg bg-gray-50 hover:bg-orangeFpt hover:text-white transition-all duration-200 ease-in-out transform hover:scale-[1.02]"
                  onClick={() => handleReport(report?.reportTypeId)}
                >
                  <div className="first-letter:uppercase">{report?.reportTypeName}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Report