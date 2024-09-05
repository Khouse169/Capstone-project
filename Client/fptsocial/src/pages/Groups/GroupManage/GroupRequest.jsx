import { Button } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { getRequestJoin, memberJoinStatus } from '~/apis/groupApis'
import SearchNotFound from '~/components/UI/SearchNotFound'
import UserAvatar from '~/components/UI/UserAvatar'
import { selectIsReload, triggerReload } from '~/redux/ui/uiSlice'
import { selectCurrentUser } from '~/redux/user/userSlice'

function GroupRequest({ group }) {
  const [listMemberRequest, setListMemberRequest] = useState([])
  const currentUser = useSelector(selectCurrentUser)
  const isReload = useSelector(selectIsReload)
  const dispatch = useDispatch()

  useEffect(() => {
    getRequestJoin(group?.groupId).then(data => setListMemberRequest(data?.requestJoinGroups))
  }, [group, isReload])

  const handleApproveJoinRequest = (reqId) => {
    const submitData = {
      'managerId': currentUser?.userId,
      'userId': reqId,
      'groupId': group?.groupId,
      'isJoin': true
    }
    memberJoinStatus(submitData).then(() => dispatch(triggerReload()))
  }

  const handleDeclineJoinRequest = (reqId) => {
    const submitData = {
      'managerId': currentUser?.userId,
      'userId': reqId,
      'groupId': group?.groupId,
      'isJoin': false
    }
    memberJoinStatus(submitData).then(() => dispatch(triggerReload()))
  }


  return (
    <div className='bg-fbWhite w-full '>
      <div className='h-[50px] p-6 bg-white flex justify-center items-center'>
        <h1 className='text-2xl font-semibold text-orangeFpt'>
          Group request
        </h1>
      </div>
      <div className='flex flex-col items-center mt-4'>
        <div className='flex flex-col gap-4 w-[90%] md:w-[70%]'>
          {
            listMemberRequest?.map(request => (
              <div key={request?.userId} className='flex justify-between items-center bg-white p-4 rounded-lg'>
                <div className='flex gap-2 items-center'>
                  <UserAvatar avatarSrc={request?.userAvata} isOther={true} />
                  <Link to={`/profile?id=${request?.userId}`} className='capitalize hover:underline'>{request?.userName}</Link>
                </div>
                <div className='flex items-center gap-2'>
                  <Button className='interceptor-loading' variant="contained" onClick={() => handleApproveJoinRequest(request?.userId)}>
                    Approve
                  </Button>
                  <Button className='interceptor-loading' variant="contained" color='warning'
                    onClick={() => handleDeclineJoinRequest(request?.userId)}>
                    Decline
                  </Button>
                </div>
              </div>
            ))
          }
          {
            listMemberRequest?.length == 0 && <SearchNotFound isNoneData />
          }
        </div>
      </div>
    </div>
  )
}

export default GroupRequest
