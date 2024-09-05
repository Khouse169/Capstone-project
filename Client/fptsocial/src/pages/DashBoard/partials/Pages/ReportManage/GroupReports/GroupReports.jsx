import { Avatar, Button, Pagination } from '@mui/material';
import { useEffect, useState } from 'react';
import { getListReportUser, getReportGroup, getReportUser } from '~/apis/adminApis/reportsApis';
import { useSelector } from 'react-redux';
import { selectIsReload } from '~/redux/ui/uiSlice';
import SearchNotFound from '~/components/UI/SearchNotFound';
import DetailReportedGroup from './_id';
import GroupAvatar from '~/components/UI/GroupAvatar';
import viewDetail from '~/assets/img/viewdetail.png'

function GroupReports() {
  const [dataReportedList, setDataReportedList] = useState([])
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const [open, setOpen] = useState(false)
  const [profileReportedDetail, setProfileReportedDetail] = useState('')
  const isReload = useSelector(selectIsReload)

  useEffect(() => {
    getReportGroup({ page: page }).then(data => {
      setDataReportedList(data?.result)
      setTotalPage(data?.totalPage)
    })
  }, [page, isReload])

  const handleViewDetailReport = (data) => {
    setProfileReportedDetail(data?.groupReportedId)
    setOpen(true)
  }

  const getOrderNumber = (index) => {
    return (page - 1) * 10 + index + 1;
  }

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg h-full p-2 flex flex-col justify-between">
      {open && <DetailReportedGroup groupId={profileReportedDetail} open={open} setOpen={setOpen} />}
      <table className="w-full text-sm text-center text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-fbWhite">
          <tr>
            <th scope="col" className="px-6 py-3">
              Order
            </th>
            <th scope="col" className="px-6 py-3">
              Reported group
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
          {dataReportedList?.map((report, index) => (
            <tr key={index} className="bg-white border-b hover:bg-gray-50 h-[100px]">
              <td className="px-6 py-4 font-medium">
                {getOrderNumber(index)}
              </td>
              <td className="px-6 py-4">
                <div className='flex items-center justify-center gap-2 cursor-pointer hover:shadow-lg p-4 rounded-md' onClick={() => handleViewDetailReport(report)}>
                  <GroupAvatar avatarSrc={report?.groupCoverImage} />
                  <span className='font-semibold capitalize text-black'>{report?.groupName}</span>
                </div>
              </td>
              <td className="px-6 py-4">{report?.numberReporter} reports</td>
              <td className="px-6 py-4">
                <div className='flex justify-center gap-2' onClick={() => handleViewDetailReport(report)}>
                  <img src={viewDetail} className='w-10 h-10 cursor-pointer hover:scale-105' alt="View Detail" />
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {dataReportedList?.length === 0 && <SearchNotFound isNoneData={true} />}

      <nav
        className="flex items-center justify-center flex-column flex-wrap md:flex-row pt-4"
        aria-label="Table navigation"
      >
        <Pagination count={totalPage} variant="outlined" shape="rounded" page={page} onChange={(e, v) => setPage(v)} />
      </nav>
    </div>
  )
}

export default GroupReports;