import { Button, Pagination } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getReportPost } from '~/apis/adminApis/reportsApis'
import blogIcon from '~/assets/img/blog.png'
import viewDetail from '~/assets/img/viewdetail.png'
import ActivePost from '~/components/Modal/ActivePost/ActivePost'
import { selectIsShowModalActivePost } from '~/redux/activePost/activePostSlice'
import ReportDetailModal from './ReportDetailModal'
import { selectIsReload } from '~/redux/ui/uiSlice'
import SearchNotFound from '~/components/UI/SearchNotFound'

function PostReports() {
  const [listPostReport, setListPostReport] = useState([])
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const isReload = useSelector(selectIsReload)
  const isOpenActivePost = useSelector(selectIsShowModalActivePost)
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const [postReportDetail, setPostReportDetail] = useState(null)

  useEffect(() => {
    getReportPost({ page: page }).then(data => {
      setListPostReport(data?.result)
      setTotalPage(data?.totalPage)
    })
  }, [page, isReload])

  const handleViewDetailReport = (report) => {
    setPostReportDetail(report)
    handleOpen()
  }

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg h-full p-2 flex flex-col justify-between">
      {isOpenActivePost && <ActivePost isReportPost={true} />}
      {open && <ReportDetailModal postReport={postReportDetail} open={open} setOpen={setOpen}
        page={page} setPage={setPage} totalPage={totalPage} />}
      <table className="w-full text-sm text-center text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-fbWhite">
          <tr>
            <th scope="col" className="px-6 py-3">
              No.
            </th>
            <th scope="col" className="px-6 py-3">
              Reported Post
            </th>
            <th scope="col" className="px-6 py-3">
              Number of reports
            </th>
            <th className="px-6 py-3">
              View detail
            </th>
          </tr>
        </thead>

        <tbody>
          {
            listPostReport?.map((report, index) => (
              <tr key={index} className="bg-white border-b hover:bg-gray-50 h-[100px]">
                <td className="px-6 py-4">
                  {index + 1 + (page - 1) * 10}
                </td>
                <td className="px-6 py-4">
                  <div className='flex flex-col items-center cursor-pointer'
                    onClick={() => handleViewDetailReport(report)}
                  >
                    <img src={blogIcon} className='size-10' alt="Blog Icon" />
                    <span className='font-semibold text-xs capitalize'>Click to view</span>
                  </div>
                </td>
                <td className="px-6 py-4">{report?.numberReporter} reports</td>
                <td className="px-6 py-4">
                  <div className='flex justify-center gap-2' onClick={() => handleViewDetailReport(report)}>
                    <img src={viewDetail} className='w-10 h-10 cursor-pointer hover:scale-105' alt="View Detail" />
                  </div>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
      {
        listPostReport?.length == 0 && <SearchNotFound isNoneData={true} />
      }

      <nav
        className="flex items-center justify-center flex-column flex-wrap md:flex-row pt-4"
        aria-label="Table navigation"
      >
        <Pagination count={totalPage} variant="outlined" shape="rounded" page={page} onChange={(e, v) => setPage(v)} />
      </nav>
    </div>
  )
}

export default PostReports