
import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import GroupAvatar from '~/components/UI/GroupAvatar'
import { getGroupPostIdPendingByGroupId, getRequestJoin } from '~/apis/groupApis'
import GroupManageTab from './GroupManageTab'
import { Link } from 'react-router-dom'
import { Button, Drawer } from '@mui/material'
import { IconAppsFilled } from '@tabler/icons-react'


function GroupManageSideBar({ group }) {

  const [manageTab, setManageTab] = useState('manage')
  const [listRequestJoins, setListRequestJoins] = useState([])
  const [listPendingPost, setListPendingPost] = useState([])

  useEffect(() => {
    getRequestJoin(group?.groupId).then(data => setListRequestJoins(data?.requestJoinGroups))
    getGroupPostIdPendingByGroupId({ groupId: group?.groupId }).then(data => setListPendingPost(data))
  }, [group])
  const [open, setOpen] = useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  return (
    <>
      <div className='absolute top-2 left-2 z-[500]  '>
        <IconAppsFilled className='size-12 p-2 bg-orangeFpt border-3 border-white shadow-lg text-white cursor-pointer rounded-full' onClick={toggleDrawer(true)} />
      </div>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        <div className="min-w-[360px] flex flex-col overflow-y-auto scrollbar-none-track border-r-2 bg-white">
          <div className="flex items-center gap-3 border-b p-3 text-sm">
            <Link to={`/groups/${group?.groupId}`}>
              <GroupAvatar avatarSrc={group?.coverImage} size={12} />
            </Link>
            <div className='flex flex-col gap-1 font-semibold capitalize'>
              <span>
                {group?.groupName}
              </span>
              <div className='flex text-gray-500 gap-2'>
                <span className='text-gray-500 font-thin'>{group?.groupSettings?.find(e => e?.groupSettingName?.toLowerCase() == 'group status')?.groupStatusName}.</span>
                <span className=''>{group?.memberCount || 0} member</span>
              </div>
            </div>
          </div>
          <div className="px-2">
            <Box sx={{
              width: '100%',
              typography: 'body1',
              '.MuiTabs-flexContainer': {
                backgroundColor: 'white'
                , display: 'flex'
                , justifyContent: 'center'
                , fontWeight: '800'
              },
              '.MuiButtonBase-root': { display: 'flex', justifyContent: 'center', flexBasis: '50%', fontWeight: '700', textTransform: 'capitalize' }
            }}>
              <TabContext value={manageTab}>
                <div>
                  <TabList onChange={(e, v) => setManageTab(v)} >
                    {/* <Tab iconPosition="start" label="Chat" value="chat" /> */}
                    <Tab iconPosition="start" label="Manage" value="manage" />
                  </TabList>
                </div>
                <TabPanel value="chat">
                  chat
                </TabPanel>
                <TabPanel value="manage" sx={{ padding: 0 }}>
                  <GroupManageTab listRequestJoins={listRequestJoins} listPendingPost={listPendingPost} group={group} />
                </TabPanel>
              </TabContext>
            </Box>
          </div>
        </div>
      </Drawer>
    </>
  )
}

export default GroupManageSideBar
