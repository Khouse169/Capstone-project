import { Avatar, Button, Pagination } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsReload, triggerReload } from '~/redux/ui/uiSlice';
import SearchNotFound from '~/components/UI/SearchNotFound';
import { getAllGroupForAdmin, getAllUserForAdmin } from '~/apis/adminApis/manageApis';
import moment from 'moment';
import { useConfirm } from 'material-ui-confirm';
import { activeUserByUserId, deactiveUserByUserId } from '~/apis/adminApis/reportsApis';
import UserAvatar from '~/components/UI/UserAvatar';
import GroupAvatar from '~/components/UI/GroupAvatar';
import { deleteGroup } from '~/apis/groupApis';

function GroupManage() {
  const [groupList, setGroupList] = useState([])
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const isReload = useSelector(selectIsReload)
  const dispatch = useDispatch()

  useEffect(() => {
    getAllGroupForAdmin({ page: page }).then(data => {
      setGroupList(data?.result)
      setTotalPage(data?.totalPage)
    })
  }, [page, isReload])

  const getOrderNumber = (index) => {
    return (page - 1) * 10 + index + 1;
  }

  const confirm = useConfirm()
  const handleDeleteGroup = (group) => {
    confirm({
      title: <div className="uppercase font-bold text-red-600 p-1 flex gap-2 items-center">
        Delete Group
        <div className='flex gap-2 items-center'>
          <GroupAvatar avatarSrc={group?.coverImage} />
          <span className='font-semibold capitalize text-gray-500/90 text-base'>{group?.groupName}</span>
        </div>
      </div>,
      allowClose: true,
      description: `Are you sure you want to delete this group? This action cannot be undone. All members will be removed from this group.`,
      confirmationText: 'Delete',
      cancellationText: "Cancel",
      confirmationButtonProps: {
        variant: "contained",
        color: "warning"
      },
      cancellationButtonProps: {
        variant: "outlined",
        color: "primary"
      },
    })
      .then(() => {
        deleteGroup({ "groupId": group?.groupId })
          .then(() => dispatch(triggerReload()))
      })
      .catch(() => {
        // User cancelled the action
      });
  };

  return (
    <div className="relative overflow-y-auto shadow-md sm:rounded-lg h-full flex flex-col  p-4">
      {/* {open && <userProfileDetailModal userId={profileuseredDetail} open={open} setOpen={setOpen} />} */}
      <h3 className='text-xl font-bold text-orangeFpt mb-4'>Groups Management</h3>
      <table className="w-full text-sm text-center text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-fbWhite">
          <tr>
            <th scope="col" className="px-6 py-3"></th>
            <th scope="col" className="px-6 py-3">
              Group
            </th>
            <th scope="col" className="px-6 py-3">
              Number of members
            </th>
            <th className="px-6 py-3">
              Action
            </th>
          </tr>
        </thead>

        <tbody>
          {groupList?.map((group, index) => (
            <tr key={index} className="bg-white border-b hover:bg-gray-50">
              <td className="px-6 py-4 font-medium">
                {getOrderNumber(index)}
              </td>
              <td className="px-6 py-4">
                <div className='flex items-center gap-3 cursor-pointer hover:shadow-lg p-4 rounded-md' >
                  <GroupAvatar avatarSrc={group?.coverImage} />
                  <div className='flex flex-col gap-1 items-start'>
                    <span className='font-semibold capitalize text-black'>{group?.groupName}</span>
                    <span className='font-semibold text-xs'>Created : {moment(group?.createdAt).format('LLL')}</span>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className='font-bold text-xs'>{group?.numberOfMember} members</span>
              </td>
              <td className="px-6 py-4">
                <div className='flex justify-center gap-2' >
                  <Button variant='contained' color='warning'
                    onClick={() => {
                      handleDeleteGroup(group)
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {groupList?.length === 0 && <SearchNotFound isNoneData={true} />}

      <nav
        className="flex items-center justify-center flex-column flex-wrap md:flex-row pt-4"
        aria-label="Table navigation"
      >
        <Pagination count={totalPage} variant="outlined" shape="rounded" page={page} onChange={(e, v) => setPage(v)} />
      </nav>
    </div>
  )
}

export default GroupManage;