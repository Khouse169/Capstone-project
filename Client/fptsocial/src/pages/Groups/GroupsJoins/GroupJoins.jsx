import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getGroupByUserId } from '~/apis/groupApis';
import SearchNotFound from '~/components/UI/SearchNotFound';

function GroupJoins() {
  const [listGroupJoins, setListGroupJoins] = useState([])

  useEffect(() => {
    // getAllPost().then(data => setListPost(data))
    getGroupByUserId().then(data => setListGroupJoins([...data?.listGroupAdmin || [], ...data?.listGroupMember || []]))
  }, [])
  return (
    <div className='w-full h-full overflow-y-auto scrollbar-none-track'>
      <div className='p-4'>
        <div className='mb-4'>
          <span className='text-xl font-bold'>All the groups you have joined</span>
        </div>
        <div className='grid grid-cols-12 gap-3'>
          {
            listGroupJoins?.map(group => (
              <div key={group?.groupId} className='bg-white col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-3 h-[300px] rounded-md flex flex-col'>
                <Link to={`/groups/${group?.groupId}`}>
                  <img
                    className='w-full h-[200px] object-cover rounded-t-md'
                    src={group?.coverImage}
                  />
                </Link>
                <div className='p-3 h-full flex flex-col'>
                  <div>
                    <Link to={`/groups/${group?.groupId}`} className='font-bold capitalize hover:underline'>{group?.groupName}</Link>
                    <div>
                      {/* <span className='text-gray-500 text-sm'>{group?.numberOfMember} members</span> */}
                    </div>
                  </div>
                  <div className=' flex flex-col gap-2 h-full justify-end items-center'>
                    <div className='text-blue-500 bg-blue-100 hover:bg-blue-200 cursor-pointer w-full flex justify-center rounded-md'
                    // onClick={() => handleRequestJointGroup(group?.groupId)}
                    >
                      <Link to={`/groups/${group?.groupId}`} className='my-2 font-bold'>View group</Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          }
        </div>
        {
          listGroupJoins?.length == 0 && <SearchNotFound isNoneData={true} />
        }
      </div>

    </div>
  )
}

export default GroupJoins;
