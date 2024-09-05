import { TabContext, TabList } from '@mui/lab'
import { Box, Tab } from '@mui/material'
import { useEffect, useState } from "react"
import { Link, useNavigate } from 'react-router-dom'
import { POST_TYPES, SEARCH_TYPE } from '~/utils/constants'
import notFoundImg from '~/assets/img/not_found.png'
import { useDispatch } from 'react-redux'
import InfiniteScroll from '~/components/IntersectionObserver/InfiniteScroll'
import { getImageInGroup, getVideoInGroup } from '~/apis/groupApis'
import { clearAndHireCurrentActivePost } from '~/redux/activePost/activePostSlice'
import { useTranslation } from 'react-i18next'

function GroupMedias({ group }) {
  const { t } = useTranslation()
  const [mediaList, setMediaList] = useState([])
  const [value, setValue] = useState('1')
  const dispatch = useDispatch()
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  let getMediasFn
  if (value == 1)
    getMediasFn = getImageInGroup
  else if (value == 2)
    getMediasFn = getVideoInGroup

  useEffect(() => {
    setPage(1)
    setHasMore(true)
    setMediaList([])
  }, [value])

  const handleChange = (event, newValue) => {
    setValue(newValue)
  }

  useEffect(() => {
    if (group) {
      getMediasFn({ groupId: group?.groupId, page: page }).then(data => {
        if (data?.imageInGroupFPTList?.length == 0 || data?.videoInGroupFPTList?.length == 0) {
          setHasMore(false)
        }
        setMediaList((prev) => [...prev, ...(value == 1 ? data?.imageInGroupFPTList : data?.videoInGroupFPTList) || []])
      })
    }
  }, [group, page, value])

  const navigate = useNavigate()
  const handleLinkTo = (e, event) => {
    event.preventDefault()
    dispatch(clearAndHireCurrentActivePost())
    if (e?.groupPostPhotoId)
      navigate(`/photo/${e?.groupPostPhotoId}?type=${POST_TYPES.GROUP_PHOTO_POST}`)
    else if (e?.groupPostVideoId)
      navigate(`/media/${e?.groupPostVideoId}?type=${POST_TYPES.GROUP_VIDEO_POST}`)
    else
      navigate(`/media/${e?.groupPostId}?type=${POST_TYPES.GROUP_POST}`)
  }

  return (
    <div className='flex justify-center '>
      <div className='w-[90%] md:w-[80%] bg-white p-4 rounded-xl shadow-xl'>
        <Box sx={{
          marginBottom: '20px',
          '.MuiTabs-scroller': {
            display: 'flex',
          },
          '.MuiButtonBase-root': { fontWeight: '600', fontSize: '0.75rem' }
        }}>
          <TabContext value={value}>
            <TabList onChange={handleChange}>
              <Tab label={t('standard.profile.photos')} value="1" />
              <Tab label={t('standard.profile.videos')} value="2" />
            </TabList>
          </TabContext>
        </Box>
        {
          mediaList.length == 0 &&
          <div className='w-full flex justify-center'>
            <div className='flex flex-col items-center font-semibold capitalize text-gray-500'>
              <img loading="lazy" src={notFoundImg} className='size-20' />
              <span>No data</span>
            </div>
          </div>
        }
        <InfiniteScroll
          className={'min-h-[650px]'}
          fetchMore={() => setPage(pre => (pre + 1))}
          hasMore={hasMore}
        >
          <div className='grid grid-cols-12 gap-1 '>

            {
              mediaList?.map((e, i) => (
                <div
                  onClick={(event) => handleLinkTo(e, event)} key={i} className='col-span-12 xs:col-span-6 md:col-span-4 lg:col-span-3 cursor-pointer'>
                  {
                    value == 1
                      ? <img src={e?.urlImage} className='object-cover h-full rounded-md border w-full' />
                      : <video src={e?.urlVideo} className='object-cover h-full rounded-md border w-full' controls />
                  }
                </div>
              ))
            }
          </div>
        </InfiniteScroll>

      </div>
    </div>
  )
}

export default GroupMedias
