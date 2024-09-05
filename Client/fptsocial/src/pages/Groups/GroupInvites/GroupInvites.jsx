import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getInvitedGroup, requestJoinGroup } from '~/apis/groupApis';
import SearchNotFound from '~/components/UI/SearchNotFound';
import UserAvatar from '~/components/UI/UserAvatar';
import { selectCurrentUser } from '~/redux/user/userSlice';

function GroupInvites() {
  const [listGroupJoins, setListGroupJoins] = useState([])
  const currentUser = useSelector(selectCurrentUser)
  const [reload, setReload] = useState(true)

  useEffect(() => {
    // getAllPost().then(data => setListPost(data))
    getInvitedGroup().then(data => setListGroupJoins(data))
  }, [reload])


  const handleRequestJointGroup = (group, i) => {
    const submitData = {
      'userId': currentUser?.userId,
      'groupId': group?.groupId
    }
    requestJoinGroup(submitData).then((data) => {
      toast.success('Send request')
      setReload(!reload)
      // const newListData = cloneDeep(listSuggestionGroup)
      // newListData[i] = { ...group, isRequest: data?.isRequest }
      // setListSuggestionGroup(newListData)
    })
  }
  return (
    <div className='w-full h-full overflow-y-auto scrollbar-none-track'>
      <div className='p-4'>
        <div className='mb-4'>
          <span className='text-xl font-bold'>Group invitations</span>
        </div>
        <div className='grid grid-cols-12 gap-3'>
          {listGroupJoins?.length > 0 && (
            listGroupJoins?.map(group => (
              <div key={group?.groupId} className='bg-white col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3 h-fit rounded-md flex flex-col'>
                <Link to={`/groups/${group?.groupId}`}>
                  <img
                    className='w-full h-[200px] object-cover rounded-t-md'
                    src={group?.coverImage}
                  />
                </Link>
                <div className='p-3 h-full flex flex-col gap-3'>
                  <div>
                    <Link to={`/groups/${group?.groupId}`} className='font-bold capitalize hover:underline'>{group?.groupName}</Link>
                    <div className='flex gap-2'>
                      <p className='text-sm text-gray-500'>Invited by:</p>
                      <div className='flex gap-2 items-center'>
                        <Link to={`/profile?id=${group?.invatedBy}`}><UserAvatar avatarSrc={group?.invatedByAvata} size='1.5' /></Link>
                        <Link to={`/profile?id=${group?.invatedBy}`} className='capitalize text-xs hover:underline'>{group?.invatedByName}</Link>
                      </div>
                    </div>
                  </div>
                  <div className=''>
                    {
                      <Button variant='contained' fullWidth
                        onClick={() => handleRequestJointGroup(group)}
                      >
                        Join group
                      </Button>
                    }
                  </div>
                </div>
              </div>
            ))
          )
          }
        </div>
        {
          listGroupJoins?.length == 0 && <SearchNotFound isNoneData={true} />
        }
      </div>

    </div>
  )
}

export default GroupInvites;
