import ProfilePosts from './ProfilePosts'
import About from './About'
import { Box, Tab, Tabs } from '@mui/material'
import { IconArticle, IconFriends, IconMovie, IconPhoto, IconUserCircle } from '@tabler/icons-react'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { useEffect, useState } from 'react'
import FriendProfile from './FriendProfile'
import { useTranslation } from 'react-i18next'
import Photos from './Photos'
import Videos from './Videos'


function ContentProfile({ user, blockedUserList }) {
  const [value, setValue] = useState('1')
  const { t } = useTranslation()
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }
  useEffect(() => {
    setValue('1')
  }, [user])

  return (
    <div
      id='content-profile'
      className='flex flex-col items-center lg:flex-row lg:justify-center lg:items-start w-full gap-3 bg-fbWhite'
    >
      <Box sx={{
        width: '100%',
        typography: 'body1',
        '.MuiTabs-root': { position: 'sticky', top: '60px', zIndex: 1 },
        '.MuiTabs-flexContainer': { backgroundColor: 'white', display: 'flex', justifyContent: 'center' },
        '.MuiButtonBase-root': { display: 'flex', justifyContent: 'center' }
      }}>
        <TabContext value={value}>
          <div>
            <TabList onChange={handleChange} >
              <Tab icon={<IconArticle stroke={2} />} iconPosition="start" label={t('standard.profile.posts')} value="1" />
              <Tab icon={<IconUserCircle stroke={2} />} iconPosition="start" label={t('standard.profile.about')} value="2" />
              <Tab icon={<IconFriends stroke={2} />} iconPosition="start" label={t('standard.profile.friends')} value="3" />
              <Tab icon={<IconPhoto stroke={2} />} iconPosition="start" label={t('standard.profile.photos')} value="4" />
              <Tab icon={<IconMovie stroke={2} />} iconPosition="start" label={t('standard.profile.videos')} value="5" />
            </TabList>
          </div>
          <TabPanel value="1">
            <ProfilePosts user={user} />
          </TabPanel>
          <TabPanel value="2">
            <About user={user} />
          </TabPanel>
          <TabPanel value="3"><FriendProfile user={user} blockedUserList={blockedUserList} /></TabPanel>
          <TabPanel value="4"><Photos user={user} /></TabPanel>
          <TabPanel value="5"><Videos user={user} /></TabPanel>
        </TabContext>
      </Box>
    </div>
  );
}

export default ContentProfile