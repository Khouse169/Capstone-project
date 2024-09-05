import { Pagination } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { getReportType } from '~/apis/report'
import UserAvatar from '~/components/UI/UserAvatar'
import { compareDateTime } from '~/utils/formatters'

function ListUserReported({ getUserReportedFn }) {
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const [reportTypeList, setReportTypeList] = useState([])
  const [userReportedList, setUserReportedList] = useState([])

  useEffect(() => {
    getReportType().then(data => setReportTypeList(data))
  }, [])


  useEffect(() => {
    (async () => {
      await getUserReportedFn({ page: page }).then(data => {
        setUserReportedList(data?.result)
        setTotalPage(data?.totalPage)
      })
    })()
  }, [page])

  const getReportTypeName = (reportTypeId) => {
    const reportType = reportTypeList?.find(item => item?.reportTypeId === reportTypeId)
    return reportType?.reportTypeName
  }

  return <div className='col-span-5 p-2  overflow-y-auto scrollbar-none-track bg-gray-50'>
    <div className='flex flex-col gap-2 '>
      {
        userReportedList?.map((report, index) => (
          <div key={index}
            className='bg-white shadow-lg py-2 px-3 rounded-lg flex flex-col gap-2'>
            <div className='flex gap-2'>
              <UserAvatar avatarSrc={report?.avatarUrl} />
              <div className='flex flex-col'>
                <span className='capitalize'>{report?.userName}</span>
                <span className='text-sm text-gray-600'>
                  Report at:<span className='text-black'> {compareDateTime(report?.createdDate)}</span>
                </span>
              </div>
            </div>
            <div className='text-sm text-gray-500'>
              Reason: <span className='text-base font-bold text-red-700'>{getReportTypeName(report?.reportTypeId)}</span>
            </div>

          </div>
        ))
      }
    </div>
    <nav
      className="flex items-center justify-center flex-column flex-wrap md:flex-row pt-4 mb-14"
      aria-label="Table navigation"
    >
      <Pagination count={totalPage} variant="outlined" shape="rounded" page={page} onChange={(e, v) => setPage(v)} />
    </nav>
  </div>
}

export default ListUserReported
