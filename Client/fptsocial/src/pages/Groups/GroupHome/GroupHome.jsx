import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Tab } from '@mui/material'
import { IconSearch } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { getListFriendInvited } from '~/apis/groupApis'
import UserAvatar from '~/components/UI/UserAvatar'
import { handleCoverImg } from '~/utils/formatters'
import GroupHomeDiscussions from './GroupHomeDiscussions/GroupHomeDiscussions'
import SearchInGroup from './Search/SearchInGroup'
import GroupMember from './GroupMember/GroupMember'
import StickyHeader from './StickyHeader'
import HeaderButton from './HearderButton'
import GroupMedias from './GroupMedias/GroupMedias'
import { useTranslation } from 'react-i18next'

function GroupHome({ group }) {
  const { t } = useTranslation()
  const [listPost, setListPost] = useState([])
  const isPostDetail = /^\/groups\/[a-zA-Z0-9-]+\/post\/[a-zA-Z0-9-]+\/?$/.test(location.pathname)
  const { postId } = useParams()

  const [groupContentTabs, setGroupContentTabs] = useState('discussion')
  const backgroundStyle = handleCoverImg(group?.coverImage)

  return (
    <div className="relative overflow-y-auto scrollbar-none-track overflow-x-hidden w-full">
      <div className="">
        <div id='top-profile'
          className='bg-white shadow-md w-full flex flex-col items-center'
        >
          <div
            id="holderCover"
            className="w-full lg:w-[940px] aspect-[74/27] rounded-md bg-cover bg-center bg-no-repeat"
            style={backgroundStyle}
          >
          </div>
          <div id=''
            className='w-full flex justify-center pb-4 border-b'
          >
            <div className='w-full lg:w-[50%] flex flex-col lg:flex-row items-center lg:items-end justify-center gap-4 px-4'>
              <div id='name-friend'
                className='w-full flex flex-col items-center lg:items-start justify-end mb-4 gap-1 px-4'
              >
                <Link to={`/groups/${group?.groupId}`} className='text-gray-900 font-bold text-3xl capitalize hover:underline'>{group?.groupName}</Link>
                <div className='flex gap-3'>
                  <span className='text-gray-500/90 font-bold'>{group?.groupSettings?.find(e => e?.groupSettingName?.toLowerCase() == 'group status')?.groupStatusName}</span>
                  <span className='text-start'>&middot;</span>
                  <span className='text-gray-500/90 font-bold'>{group?.memberCount} {t('standard.group.member')}</span>
                </div>
                <div className="flex w-full justify-between items-center">
                  <div className='flex items-center [&>img:not(:first-child)]:-ml-4'>
                    {group?.groupMember?.map((member, i) => (
                      <Link to={`/profile?id=${member?.userId}`} key={i}
                        className={i != 0 ? '-ml-2 border rounded-full border-white' : ''}
                      >
                        <UserAvatar isOther={true} avatarSrc={member?.avata} />
                      </Link>
                    ))}
                  </div>
                  <HeaderButton group={group} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <StickyHeader group={group} />

        <div className="relative z-0">
          <div
            id='content-profile'
            className='flex items-center lg:flex-row lg:justify-center lg:items-start w-full gap-3 bg-fbWhite'
          >
            <Box sx={{
              width: '100%',
              minHeight: '500px',
              typography: 'body1',
              '.MuiTabs-flexContainer': { backgroundColor: 'white', display: 'flex', justifyContent: 'center' },
              '.MuiButtonBase-root': { display: 'flex', justifyContent: 'center' }
            }}>
              <TabContext
                value={groupContentTabs}
              >
                <div>
                  <TabList onChange={(e, v) => setGroupContentTabs(v)} >
                    <Tab iconPosition="start" label={t('standard.group.discus')} value="discussion" />
                    <Tab iconPosition="start" label={t('standard.group.member')} value="members" />
                    <Tab iconPosition="start" label={t('standard.group.file')} value="medias" />
                    <Tab iconPosition="start" label={<IconSearch />} value="search" />
                  </TabList>
                </div>
                <TabPanel value="discussion">
                  <GroupHomeDiscussions group={group} isPostDetail={isPostDetail} />
                </TabPanel>
                <TabPanel value="members">
                  <GroupMember group={group} />
                </TabPanel>
                <TabPanel value="medias">
                  <GroupMedias group={group} />
                </TabPanel>
                <TabPanel value="search"><SearchInGroup /></TabPanel>
              </TabContext>
            </Box>
          </div>
        </div>

      </div>
    </div >
  )
}

export default GroupHome
