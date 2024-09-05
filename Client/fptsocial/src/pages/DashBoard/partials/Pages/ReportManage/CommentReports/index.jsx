import { Avatar, Button, Pagination } from '@mui/material';
import { useEffect, useState } from 'react';
import { getReportComment, getReportGroup } from '~/apis/adminApis/reportsApis';
import { useSelector } from 'react-redux';
import { selectIsReload } from '~/redux/ui/uiSlice';
import SearchNotFound from '~/components/UI/SearchNotFound';
import GroupAvatar from '~/components/UI/GroupAvatar';
import DetailCommentReport from './_id';
import { cleanAndParseHTML } from '~/utils/formatters';
import viewDetail from '~/assets/img/viewdetail.png';

function CommentReports() {
  const [dataReportedList, setDataReportedList] = useState([])
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const [open, setOpen] = useState(false)
  const [commentReportedDetail, setCommentReportedDetail] = useState({})
  const isReload = useSelector(selectIsReload)

  useEffect(() => {
    getReportComment({ page: page }).then(data => {
      setDataReportedList(data?.result)
      setTotalPage(data?.totalPage)
    })
  }, [page, isReload])

  const handleViewDetailReport = (data) => {
    setCommentReportedDetail(data)
    setOpen(true)
  }

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg h-full p-2 flex flex-col justify-between">
      {open && <DetailCommentReport reportedComment={commentReportedDetail} open={open} setOpen={setOpen} />}
      <table className="w-full text-sm text-left text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-fbWhite">
          <tr>
            <th scope="col" className="px-6 py-3">
              No.
            </th>
            <th scope="col" className="px-6 py-3">
              Reported Comment
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
            dataReportedList?.map((report, index) => (
              <tr key={index} className="bg-white border-b hover:bg-gray-50 h-[100px]">
                <td className="px-6 py-4">
                  {index + 1 + (page - 1) * 10}
                </td>
                <td className="px-6 py-4">
                  <div className='flex items-center gap-2 cursor-pointer' onClick={() => handleViewDetailReport(report)}>
                    <span className='font-semibold capitalize text-black'>{cleanAndParseHTML(report?.content)}</span>
                    <div className='max-w-[300px]'>
                      {(() => {
                        const mediaContent = cleanAndParseHTML(report?.content, true)
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
        dataReportedList?.length == 0 && <SearchNotFound isNoneData={true} />
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

export default CommentReports