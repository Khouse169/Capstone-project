import { IconPlus } from '@tabler/icons-react'
import { Link, useLocation } from 'react-router-dom'
import compassIcon from '~/assets/img/compass.png'
import groupIcon from '~/assets/img/group.png'
import inviteIcon from '~/assets/img/invite.png'

function GroupSideBar({ listPersonalGroup }) {
  const location = useLocation()
  const isCreate = location.pathname === '/groups/create'
  const isInvites = location.pathname === '/groups/invites'
  const isDiscover = location.pathname === '/groups' || location.pathname === '/groups/discover'
  const isJoin = location.pathname === '/groups/joins'
  return (
    <div className="max-h-[calc(100vh_-_55px)] w-[250px] flex flex-col overflow-y-auto scrollbar-none-track border-r-2 shadow-xl bg-white">
      <div className="mx-3 mt-8 mb-5">
        <div id="explore"
          className="flex flex-col items-start gap-1 mb-8"
        >
          <Link to={'/groups/discover'}
            className={`flex items-center gap-3 cursor-pointer w-full p-2 rounded-md hover:text-white hover:bg-orangeFpt ${isDiscover && 'text-white bg-orangeFpt'}`}>
            <img src={compassIcon} className='size-6' />
            <span className="font-semibold">Discover</span>
          </Link>

          <Link to={'/groups/joins'}
            className={`flex items-center gap-3 cursor-pointer w-full p-2 rounded-md hover:text-white hover:bg-orangeFpt ${isJoin && 'text-white bg-orangeFpt'}`}>
            <img src={groupIcon} className='size-6' />
            <span className="font-semibold">Your Group</span>
          </Link>
          <Link to={'/groups/invites'}
            className={`flex items-center gap-3 cursor-pointer w-full p-2 rounded-md hover:text-white hover:bg-orangeFpt ${isInvites && 'text-white bg-orangeFpt'}`}>
            <img src={inviteIcon} className='size-6' />
            <span className="font-semibold">Group invites</span>
          </Link>
          <Link to={'/groups/create'}
            className={`flex items-center gap-1 bg-blue-50 cursor-pointer text-blue-500 bg- p-2 rounded-md w-full hover:text-white hover:bg-orangeFpt ${isCreate && 'text-white bg-orangeFpt'}`}>
            <IconPlus />
            <span className="">Create New Group</span>
          </Link>
        </div>

        <div id="group-owner"
          className="flex flex-col items-start mb-5"
        >
          {
            listPersonalGroup?.listGroupAdmin?.length !== 0 &&
            <>
              <span className="text-gray-500 mb-1">Groups you manage</span>
              {
                listPersonalGroup?.listGroupAdmin?.map(e => (
                  <Link key={e?.groupId} to={`/groups/${e?.groupId}`} className=" flex items-center gap-3 capitalize cursor-pointer w-full p-2 rounded-md hover:text-white hover:bg-orangeFpt">
                    <img
                      src={e?.coverImage}
                      alt="group-img"
                      className="rounded-md aspect-square object-cover w-10"
                    />
                    <span className="font-semibold">{e?.groupName}</span>
                  </Link>
                ))
              }
            </>
          }
        </div>

        <div id="group-joins"
          className="flex flex-col items-start mb-5"
        >
          {
            listPersonalGroup?.listGroupMember?.length !== 0 &&
            <>
              <span className="text-gray-500 mb-1">Groups you join</span>
              {
                listPersonalGroup?.listGroupMember?.map(e => (
                  <Link key={e?.groupId} to={`/groups/${e?.groupId}`} className=" flex items-center gap-3 capitalize cursor-pointer w-full p-2 rounded-md hover:text-white hover:bg-orangeFpt">
                    <img
                      src={e?.coverImage}
                      alt="group-img"
                      className="rounded-md aspect-square object-cover w-10"
                    />
                    <span className="font-semibold">{e?.groupName}</span>
                  </Link>
                ))
              }
            </>
          }

        </div>
      </div>


    </div>
  )
}

export default GroupSideBar;
