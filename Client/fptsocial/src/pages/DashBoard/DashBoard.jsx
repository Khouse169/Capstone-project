import { useEffect, useState } from 'react'
import DashboardCard01 from './partials/dashboard/DashboardCard01'
import DashboardCard02 from './partials/dashboard/DashboardCard02'
import DashboardCard03 from './partials/dashboard/DashboardCard03'
import DashboardCard07 from './partials/dashboard/DashboardCard07'
import Sidebar from './partials/Sidebar'
import Header from './partials/Header'
import Datepicker from '~/components/Datepicker'
import { useLocation } from 'react-router-dom'
import UsersManage from './partials/Pages/UserMange/UsersManage'
import ReportManage from './partials/Pages/ReportManage/ReportManage'
import SystemSetting from './partials/Pages/SystemSetting/SystemSetting'
import { getDataForAdmin } from '~/apis/adminApis/manageApis'
import friendImg from '~/assets/img/friend.png'
import groupImg from '~/assets/img/groups.png'
import postImg from '~/assets/img/chat.png'
import banImg from '~/assets/img/banUser.png'
import GroupManage from './partials/Pages/GroupManage/GroupManage'

function Dashboard() {

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const { pathname } = location
  const [adminData, setAdminData] = useState({})

  useEffect(() => {
    getDataForAdmin().then(data => setAdminData(data))
  }, [])

  return (
    <div className="flex h-screen overflow-hidden">

      {/* Sidebar */}
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

      {/* Content area */}
      <div className="relative flex flex-col flex-1 overflow-y-auto overflow-x-hidden">

        {/*  Site header */}
        <Header sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <main className="grow">
          {
            pathname == '/dashboard' && <div className="px-4 sm:px-6 lg:px-8 py-8 w-full max-w-9xl mx-auto">

              {/* Dashboard actions */}


              <div className='flex justify-center'>
                <div className='flex gap-8 items-center'>
                  <div className='flex gap-2 items-center'>
                    <img src={friendImg} className='size-14' />
                    <span className='text-gray-500/90'>{adminData?.numberOfUser} users</span>
                  </div>
                  <div className='flex gap-2 items-center'>
                    <img src={groupImg} className='size-14' />
                    <span className='text-gray-500/90'>{adminData?.numberOfGroup} groups</span>
                  </div>
                  <div className='flex gap-2 items-center'>
                    <img src={postImg} className='size-14' />
                    <span className='text-gray-500/90'>{adminData?.numberOfPost} posts</span>
                  </div>
                  <div className='flex gap-2 items-center'>
                    <img src={banImg} className='size-14' />
                    <span className='text-gray-500/90'>{adminData?.numberOfInactiveUser} banned users</span>
                  </div>

                </div>
              </div>


              {/* Cards */}
              <div className="grid grid-cols-12 gap-6">
                {/* <DashboardCard01 /> */}
                {/* <DashboardCard02 /> */}
                {/* <DashboardCard03 /> */}
                {/* <DashboardCard07 /> */}
              </div>

            </div>
          }
          {
            pathname.includes('settings') && <SystemSetting />
          }
          {
            pathname.includes('/dashboard/manage/users') && <UsersManage />
          }
          {
            pathname.includes('/dashboard/manage/groups') && <GroupManage />
          }
          {
            pathname.includes('/reports/') && <ReportManage />
          }
        </main>
      </div>
    </div>
  )
}

export default Dashboard