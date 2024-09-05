import { Button } from '@mui/material'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getGroupRole, getListMemberByRole, getRequestJoin, memberJoinStatus, updateOrRemoveMember } from '~/apis/groupApis'
import UserAvatar from '~/components/UI/UserAvatar'
import { triggerReload } from '~/redux/ui/uiSlice'
import { selectCurrentUser } from '~/redux/user/userSlice'
import ListMemberByRole from './ListMemberByRole'
import { ADMIN, CENSOR, MEMBER } from '~/utils/constants'
import { useConfirm } from 'material-ui-confirm'
import { useNavigate } from 'react-router-dom'

function GroupManageMember({ group }) {
  const navigate = useNavigate()
  const currentUser = useSelector(selectCurrentUser)
  const dispatch = useDispatch()
  const [listMemberByRole, setListMemberByRole] = useState()
  const [listGroupRole, setListGroupRole] = useState([])
  const [currentUserType, setCurrentUserType] = useState('')

  useEffect(() => {
    getListMemberByRole(group?.groupId).then(data => setListMemberByRole(data))
    getGroupRole().then(data => setListGroupRole(data))
  }, [group])
  useEffect(() => {
    if (listMemberByRole)
      setCurrentUserType(listMemberByRole?.groupAdmin?.some(e => e?.userId == currentUser?.userId) ? ADMIN :
        listMemberByRole?.groupMangager?.some(e => e?.userId == currentUser?.userId) ? CENSOR : MEMBER
      )
  }, [listMemberByRole])

  const confirmFile = useConfirm()
  const handleUpdateMember = (type, user, role) => {
    const adminCount = group?.groupMember?.reduce((count, member) => {
      return member?.groupRoleName === "Admin" ? count + 1 : count
    }, 0)
    if (adminCount == 1 && user?.userId == currentUser?.userId)
      return confirmFile({
        title: (
          <div className="flex items-center gap-2 text-xl font-bold text-red-600">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span>Warning!</span>
          </div>
        ),
        description: (
          <div className="mt-3 text-sm text-gray-700">
            {group?.memberCount == 1 ? (
              <div className="space-y-2">
                <p className="font-semibold">You are the last admin/member in the group.</p>
                <p>If you want to delete the group:</p>
                <ol className="list-decimal list-inside ml-2">
                  <li>Go to the group settings</li>
                  <li>Select the delete option</li>
                </ol>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="font-semibold">You are the last admin in the group.</p>
                <p className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3">
                  Please promote other users to become admins before proceeding!
                </p>
              </div>
            )}
          </div>
        ),
        confirmationText: 'Understand',
        cancellationText: 'Cancel'
      }).then(() => {
        group?.memberCount == 1 && navigate(`/groups/${group?.groupId}/settings`)
      }).catch(() => { })
    else
      return confirmFile({
        title: (
          <div className={`text-lg font-semibold ${type == 1 ? 'text-blue-600' : 'text-red-600'}`}>
            {type == 1 ? (
              <span>
                Promote <span className="font-bold capitalize">{user?.memberName}</span> to{' '}
                <span className="font-bold text-indigo-700">{role?.groupRoleName}</span>
              </span>
            ) : (
              <span>
                Remove <span className="font-bold capitalize">{user?.memberName}</span> from group?
              </span>
            )}
          </div>
        ),
        description: (
          <div className="mt-2 text-sm text-gray-600">
            {type == 1 ? (
              <div>
                <p>Are you sure you want to promote this member to become a <span className="font-semibold text-indigo-600">{role?.groupRoleName}</span> of this group?</p>
                <p className="mt-2 text-xs italic">This action will grant additional permissions to the user.</p>
              </div>
            ) : (
              <div>
                <p>Are you sure you want to remove this member from the group?</p>
                <p className="mt-2 text-xs italic text-red-500">This action cannot be undone.</p>
              </div>
            )}
          </div>
        ),
        confirmationText: 'Confirm',
        cancellationText: 'Cancel'
      }).then(() => {
        const submitData = {
          'userId': currentUser?.userId,
          'groupId': user?.groupId,
          'memberId': user?.userId,
          'groupRoleId': type == 1 ? role?.groupRoleId : null,
          'action': type
        }
        updateOrRemoveMember(submitData).then(() => dispatch(triggerReload()))
      }).catch(() => { })
  }

  return (
    <div className='bg-fbWhite w-full '>
      <div className='h-[50px] p-6 bg-white flex justify-center items-center'>
        <h1 className='text-2xl font-semibold text-orangeFpt'>
          Manage members
        </h1>
      </div>
      <div className='flex h-[calc(100vh_-_100px)] flex-col gap-3 items-center mt-4 overflow-y-auto scrollbar-none-track'>
        <ListMemberByRole listMember={listMemberByRole?.groupAdmin} roleType={ADMIN}
          currentUserType={currentUserType} handleUpdateMember={handleUpdateMember} listGroupRole={listGroupRole} />
        <ListMemberByRole listMember={listMemberByRole?.groupMangager} roleType={CENSOR}
          currentUserType={currentUserType} handleUpdateMember={handleUpdateMember} listGroupRole={listGroupRole} />
        <ListMemberByRole listMember={listMemberByRole?.groupMember} roleType={MEMBER}
          currentUserType={currentUserType} handleUpdateMember={handleUpdateMember} listGroupRole={listGroupRole} />
      </div>
    </div>
  )
}

export default GroupManageMember
