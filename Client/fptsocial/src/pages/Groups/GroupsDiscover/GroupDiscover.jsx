import { Button } from '@mui/material';
import { cloneDeep } from 'lodash';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { cancelRequestJoin, requestJoinGroup, suggestionGroup } from '~/apis/groupApis';
import SearchNotFound from '~/components/UI/SearchNotFound';
import { selectCurrentUser } from '~/redux/user/userSlice';

function GroupsDiscover() {
  const currentUser = useSelector(selectCurrentUser)
  const [listSuggestionGroup, setListSuggestionGroup] = useState([])
  const navigate = useNavigate()
  useEffect(() => {
    suggestionGroup({ userId: currentUser?.userId }).then(data => setListSuggestionGroup(data?.suggestGroupDTOs))
  }, [])

  const handleRequestJointGroup = (group, i) => {
    const submitData = {
      'userId': currentUser?.userId,
      'groupId': group?.groupId
    }
    requestJoinGroup(submitData).then((data) => {
      toast.success('Send request')
      const newListData = cloneDeep(listSuggestionGroup)
      newListData[i] = { ...group, isRequest: data?.isRequest }
      setListSuggestionGroup(newListData)
    })
  }

  const handleCancelRequestJoinGroup = (group, i) => {
    const submitData = {
      'userId': currentUser?.userId,
      'groupId': group?.groupId
    }
    cancelRequestJoin(submitData).then((data) => {
      toast.success('Cancel request')
      const newListData = cloneDeep(listSuggestionGroup)
      newListData[i] = { ...group, isRequest: data?.isRequest }
      setListSuggestionGroup(newListData)
    })
  }

  return (
    <div className='w-full h-full overflow-y-auto scrollbar-none-track'>
      <div className='p-4'>
        <div className='mb-4'>
          <span className='text-xl font-bold'>Group suggestions</span>
        </div>
        <div className='grid grid-cols-12 gap-3'>
          {
            listSuggestionGroup?.map((suggestion, i) => (
              <div key={suggestion?.groupId} className='bg-white col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3  rounded-md flex flex-col'>
                <Link to={`/groups/${suggestion?.groupId}`}>
                  <img
                    className='w-full h-[200px] object-cover rounded-t-md'
                    src={suggestion?.coverImage}
                  />
                </Link>
                <div className='p-3 h-full flex flex-col'>
                  <div>
                    <Link to={`/groups/${suggestion?.groupId}`} className='font-bold capitalize hover:underline'>{suggestion?.groupName}</Link>
                    <div>
                      <span className='text-gray-500 text-sm'>{suggestion?.numberOfMember} members</span>
                    </div>
                  </div>
                  <div className=' flex flex-col gap-2 h-full justify-end items-center'>
                    {
                      suggestion?.isRequest ? <Button color='warning' variant='contained' fullWidth onClick={() => handleCancelRequestJoinGroup(suggestion, i)}>Cancel group</Button>
                        : <Button variant='contained' fullWidth
                          onClick={() => handleRequestJointGroup(suggestion, i)}
                        >
                          Join group
                        </Button>
                    }

                  </div>
                </div>
              </div>
            ))
          }
        </div>
        {
          listSuggestionGroup?.length == 0 && <SearchNotFound isNoneData={true} />
        }
      </div>

    </div >
  )
}

export default GroupsDiscover;
