import { IconFileDescription, IconUsersGroup } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { getListMemberGroup } from '~/apis/groupApis'
import Member from './Member'

function GroupMember({ group }) {
  const [listGroupMember, setListGroupMember] = useState([])
  const [reload, setReload] = useState(false)
  useEffect(() => {
    group &&
      getListMemberGroup(group?.groupId).then(data => setListGroupMember(data))
  }, [group, reload])

  return <div className='flex justify-center h-full'>
    <div
      className='w-[90%] md:w-[600px] h-fit rounded-md flex flex-col gap-5 '>
      <div className='flex flex-col p-4 gap-3 bg-white shadow-lg rounded-lg'>
        <h3 className='text-xl font-bold'>About</h3>
        <div className='flex flex-col gap-2'>
          <div className='flex gap-2'><IconUsersGroup stroke={1} /><span className='text-gray-500/90'>{group?.groupName}</span></div>
          <div className='flex gap-2'><IconFileDescription stroke={1} /><span className='text-gray-500/90'>{group?.groupDescription}</span></div>
        </div>
      </div>
      <div className='flex  flex-col gap-3 items-center mt-4  bg-white shadow-lg rounded-lg'>
        <div className='border-b w-full p-2 text-sm font-semibold text-gray-500/90 text-center'>
          {group?.memberCount || 0} members
        </div>
        <Member listMember={listGroupMember?.groupAdmin} roleType={'Admin'} setReload={setReload} />
        <Member listMember={listGroupMember?.groupMangager} roleType={'Manager'} setReload={setReload} />
        <Member listMember={listGroupMember?.groupMember} roleType={'Member'} setReload={setReload} />
      </div>
    </div>
  </div>
}

export default GroupMember
