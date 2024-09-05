import ListPost from '~/components/ListPost/ListPost'
import NavTopBar from '~/components/NavTopBar/NavTopBar'
import { useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getGroupByUserId } from '~/apis/groupApis'
import GroupSideBar from './GroupsSideBar/GroupSideBar'
import GroupCreate from './GroupsCreate/GroupCreate'
import GroupsDiscover from './GroupsDiscover/GroupDiscover'
import GroupJoins from './GroupsJoins/GroupJoins'
import GroupInvites from './GroupInvites/GroupInvites'


function Groups() {
  const location = useLocation()
  const isCreate = location.pathname === '/groups/create'
  const isDiscover = location.pathname === '/groups' || location.pathname === '/groups/discover'
  const isJoin = location.pathname === '/groups/joins'
  const isInvites = location.pathname === '/groups/invites'
  const [listPost, setListPost] = useState(null)
  const [listPersonalGroup, setListPersonalGroup] = useState({})

  useEffect(() => {
    // getAllPost().then(data => setListPost(data))
    getGroupByUserId().then(data => setListPersonalGroup(data))
  }, [])
  return (
    <>
      <NavTopBar />
      <div className='flex h-[calc(100vh_-_55px)] bg-fbWhite'>
        <GroupSideBar listPersonalGroup={listPersonalGroup} />
        {isCreate && <GroupCreate />}
        {isDiscover && <GroupsDiscover />}
        {isJoin && <GroupJoins />}
        {isInvites && <GroupInvites />}
      </div>
    </>
  )
}

export default Groups
