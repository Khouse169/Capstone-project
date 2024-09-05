import React from "react"
import { useLocation } from 'react-router-dom'
import PostReports from './PostReports/PostReports'
import UserReports from './UserReports/UserReports'
import GroupReports from './GroupReports/GroupReports'
import CommentReports from './CommentReports'

function ReportManage() {
  const location = useLocation()
  const { pathname } = location

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg py-3 px-4 h-full">
      {
        pathname.includes('/reports/users') && <UserReports />
      }
      {
        pathname.includes('/reports/posts') && <PostReports />
      }
      {
        pathname.includes('/reports/groups') && <GroupReports />
      }
      {
        pathname.includes('/reports/comments') && <CommentReports />
      }

    </div>

  )
}

export default ReportManage
