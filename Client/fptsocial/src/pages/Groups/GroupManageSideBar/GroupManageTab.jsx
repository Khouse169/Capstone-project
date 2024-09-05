import { IconChevronDown, IconChevronUp, IconHomeFilled, IconReport, IconStack, IconUsersGroup, IconUserShare } from '@tabler/icons-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

function GroupManageTab({ group, listRequestJoins, listPendingPost }) {
  console.log('🚀 ~ GroupManageTab ~ listPendingPost:', listPendingPost)
  const isMemberRequest = /^\/groups\/[a-zA-Z0-9-]+\/member-requests\/?$/.test(location.pathname)
  const isMemberManage = /^\/groups\/[a-zA-Z0-9-]+\/member-manage\/?$/.test(location.pathname)
  const isPendingPost = /^\/groups\/[a-zA-Z0-9-]+\/pending-posts\/?$/.test(location.pathname)
  const isSetting = /^\/groups\/[a-zA-Z0-9-]+\/settings\/?$/.test(location.pathname)
  const isHomeGroup = /^\/groups\/[a-zA-Z0-9-]+\/?$/.test(location.pathname)
  const [isOpenTools, setIsOpenTools] = useState(true)
  const [isOpenSetting, setIsOpenSetting] = useState(isSetting)

  return (
    <div className='text-sm'>
      <div className='border-b'>
        <Link to={`/groups/${group?.groupId}`}
          className={`w-full flex items-center gap-2 font-semibold ${isHomeGroup ? 'text-blue-500 bg-blue-100' : 'hover:bg-fbWhite'}   
          py-3 px-2 rounded-lg`}>
          <IconHomeFilled />
          Group home
        </Link>
        {/* <div className='w-full flex items-center gap-2 font-semibold py-3 px-2 rounded-lg hover:bg-fbWhite'>
          <IconStack />
          Overview
        </div> */}
      </div>
      <div className='text-gray-500'>
        <div className='flex flex-col'>
          <div className='w-full flex justify-between items-center gap-2 font-bold py-3 px-2 rounded-lg cursor-pointer hover:bg-fbWhite'
            onClick={() => setIsOpenTools(!isOpenTools)}
          >
            <span className=' '>Admin tools</span>
            {isOpenTools ? <IconChevronUp /> : <IconChevronDown />}
          </div>
          {isOpenTools && (
            <div>
              <Link to={`/groups/${group?.groupId}/member-requests`}
                className={`w-full flex items-center gap-2 py-3 px-2 rounded-lg 
                ${isMemberRequest ? 'bg-blue-100 text-blue-500' : 'hover:bg-fbWhite text-black'}`}>
                <IconUserShare stroke={1} />
                <div className='flex flex-col gap-1'>
                  <span className='font-semibold'>Member join requests</span>
                  <span className='text-gray-500/90'>{listRequestJoins?.length} request</span>
                </div>
              </Link>
              <Link to={`/groups/${group?.groupId}/pending-posts`}
                className={`w-full flex items-center gap-2 py-3 px-2 rounded-lg 
                ${isPendingPost ? 'bg-blue-100 text-blue-500' : 'hover:bg-fbWhite text-black'}`}>
                <IconReport stroke={1} />
                <div className='flex flex-col gap-1'>
                  <span className='font-semibold'>Pending post</span>
                  <span className='text-gray-500/90'>{listPendingPost?.length} posts</span>
                </div>
              </Link>
              <Link to={`/groups/${group?.groupId}/member-manage`}
                className={`w-full flex items-center gap-2 py-3 px-2 rounded-lg 
                ${isMemberManage ? 'bg-blue-100 text-blue-500' : 'hover:bg-fbWhite  text-black'}`}>
                <IconUsersGroup stroke={1} />
                <div className='flex flex-col gap-1'>
                  <span className='font-semibold'>Member manager</span>
                </div>
              </Link>
            </div>
          )}
        </div>

        <div className='flex flex-col'>
          <div className='w-full flex justify-between items-center gap-2 font-bold py-3 px-2 rounded-lg cursor-pointer hover:bg-fbWhite'
            onClick={() => setIsOpenSetting(!isOpenSetting)
            }
          >
            <span className=''>Settings</span>
            {isOpenSetting ? <IconChevronUp /> : <IconChevronDown />}
          </div>
          {
            isOpenSetting && (
              <div style={{
                pointerEvents: group?.isAdmin ? 'initial' : 'none'
              }}
              >
                <Link to={`/groups/${group?.groupId}/settings`}
                  className={`w-full flex items-center gap-2 py-3 px-2 rounded-lg 
                ${isSetting ? 'bg-blue-100 text-blue-500' : 'hover:bg-fbWhite text-black'}`}>
                  <IconUserShare stroke={1} />
                  <div className='flex flex-col gap-1'>
                    <span className='font-semibold'>Group settings</span>
                    <span className='text-gray-500/90'>Manage group information and more</span>
                  </div>
                </Link>
                {/* <div className='w-full flex items-center gap-2 font-bold py-3 px-2 rounded-lg hover:bg-fbWhite'>
                  <IconStack />
                  Overview
                </div>
                <div className='w-full flex items-center gap-2 font-bold py-3 px-2 rounded-lg hover:bg-fbWhite'>
                  <IconStack />
                  Overview
                </div> */}
              </div>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default GroupManageTab
