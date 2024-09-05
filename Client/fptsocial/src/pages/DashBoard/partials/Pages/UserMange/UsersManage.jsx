import { Avatar, Button, Pagination } from '@mui/material';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { selectIsReload, triggerReload } from '~/redux/ui/uiSlice';
import SearchNotFound from '~/components/UI/SearchNotFound';
import { getAllUserForAdmin } from '~/apis/adminApis/manageApis';
import moment from 'moment';
import { useConfirm } from 'material-ui-confirm';
import { activeUserByUserId, deactiveUserByUserId } from '~/apis/adminApis/reportsApis';
import UserAvatar from '~/components/UI/UserAvatar';

function UserManage() {
  const [userList, setUserList] = useState([])
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(1)
  const isReload = useSelector(selectIsReload)
  const dispatch = useDispatch()

  useEffect(() => {
    getAllUserForAdmin({ page: page }).then(data => {
      setUserList(data?.result)
      setTotalPage(data?.totalPage)
    })
  }, [page, isReload])

  const getOrderNumber = (index) => {
    return (page - 1) * 10 + index + 1;
  }

  const confirm = useConfirm()
  const handleStatusUser = (isActive, user) => {
    confirm({
      title: <div className={`uppercase font-bold ${isActive ? 'text-red-600' : 'text-green-600'} p-1 flex gap-2 items-center`}>
        {isActive ? 'Ban Account' : 'Activate Account'}
        <div className='flex gap-2 items-center'>
          <UserAvatar avatarSrc={user?.avatarUrl} />
          <span className='font-semibold capitalize text-gray-500/90 text-base'>{user?.name}</span>
        </div>
      </div>,
      allowClose: true,
      description: isActive
        ? `Are you sure you want to ban the user account ? This account will not be able to log in or use any services until it is reactivated.`
        : `Are you sure you want to activate the user account ? This account will be able to log in and use services normally.`,
      confirmationText: isActive ? 'Ban' : 'Active',
      cancellationText: "Cancel",
      confirmationButtonProps: {
        variant: "contained",
        color: isActive ? "error" : "success"
      },
      cancellationButtonProps: {
        variant: "outlined",
        color: "primary"
      },
    })
      .then(() => {
        isActive ? deactiveUserByUserId(user?.userId).then(() => dispatch(triggerReload()))
          : activeUserByUserId(user?.userId).then(() => dispatch(triggerReload()))
      })
      .catch(() => {
      })
      .finally(() => {
      })
  }


  return (
    <div className="relative overflow-y-auto shadow-md sm:rounded-lg h-full flex flex-col  p-4">
      {/* {open && <userProfileDetailModal userId={profileuseredDetail} open={open} setOpen={setOpen} />} */}
      <h3 className='text-xl font-bold text-orangeFpt mb-4'>Users Management</h3>
      <table className="w-full text-sm text-center text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-fbWhite">
          <tr>
            <th scope="col" className="px-6 py-3"></th>
            <th scope="col" className="px-6 py-3">
              User
            </th>
            <th scope="col" className="px-6 py-3">
              Email
            </th>
            <th className="px-6 py-3">
              Action
            </th>
          </tr>
        </thead>

        <tbody>
          {userList?.map((user, index) => (
            <tr key={index} className="bg-white border-b hover:bg-gray-50">
              <td className="px-6 py-4 font-medium">
                {getOrderNumber(index)}
              </td>
              <td className="px-6 py-4">
                <div className='flex items-center gap-3 cursor-pointer hover:shadow-lg p-4 rounded-md' >
                  <Avatar src={user?.avatarUrl} />
                  <div className='flex flex-col gap-1 items-start'>
                    <span className='font-semibold capitalize text-black'>{user?.name}</span>
                    <span className='font-semibold text-xs'>Join : {moment(user?.createdAt).format('LLL')}</span>
                    {user?.isActive
                      ? <span className='font-bold text-xs text-green-600'>Active</span>
                      : <span className='font-bold text-xs text-red-600'>Ban</span>}
                  </div>
                </div>
              </td>
              <td className="px-6 py-4">{user?.email}</td>
              <td className="px-6 py-4">
                <div className='flex justify-center gap-2' >
                  <Button variant='contained' color={user?.isActive ? 'error' : 'success'}
                    onClick={() => {
                      handleStatusUser(user?.isActive, user)
                    }}
                  >
                    {user?.isActive ? 'Disable' : 'Active'}
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {userList?.length === 0 && <SearchNotFound isNoneData={true} />}

      <nav
        className="flex items-center justify-center flex-column flex-wrap md:flex-row pt-4"
        aria-label="Table navigation"
      >
        <Pagination count={totalPage} variant="outlined" shape="rounded" page={page} onChange={(e, v) => setPage(v)} />
      </nav>
    </div>
  )
}

export default UserManage;