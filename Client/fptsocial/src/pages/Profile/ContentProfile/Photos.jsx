import { TabContext, TabList } from '@mui/lab'
import { Box, Tab } from '@mui/material'
import React, { useEffect, useState } from "react"
import { Link, useNavigate } from 'react-router-dom'
import { getImageByUserId } from '~/apis'
import { SEARCH_TYPE } from '~/utils/constants'
import notFoundImg from '~/assets/img/not_found.png'
import { useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import InfiniteScroll from '~/components/IntersectionObserver/InfiniteScroll'

function Photos({ user }) {
  const [listPhotos, setListPhotos] = useState([])
  const currentUser = useSelector(selectCurrentUser)
  const [filterType, setFilterType] = useState(SEARCH_TYPE.ALL)
  const [value, setValue] = useState('1')
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    setPage(1)
    setHasMore(true)
    setListPhotos([])
  }, [filterType])

  const handleChange = (event, newValue) => {
    if (newValue == '1')
      setFilterType(SEARCH_TYPE.ALL)
    else if (newValue == '2')
      setFilterType(SEARCH_TYPE.POST)
    else if (newValue == '3')
      setFilterType(SEARCH_TYPE.AVATAR)
    else if (newValue == '4')
      setFilterType(SEARCH_TYPE.COVER)
    setValue(newValue)
  }

  useEffect(() => {
    user &&
      getImageByUserId({ userId: currentUser?.userId, type: filterType, page: page, strangerId: user?.userId }).then(data => {
        if (data?.photos?.length == 0) {
          setHasMore(false)
        }
        setListPhotos((prev) => [...prev, ...data?.photos || []])
      })
  }, [filterType, user, page])

  const navigate = useNavigate()
  const handleLinkTo = (e) => {
    if (e?.userPostPhotoId)
      navigate(`/photo/${e?.userPostPhotoId}?type=photo`)
    else if (e?.userPostId)
      navigate(`/media/${e?.userPostId}?type=profile`)
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
              <Tab label="All" value="1" />
              <Tab label="Post" value="2" />
              <Tab label="Avatar" value="3" />
              <Tab label="Cover" value="4" />
            </TabList>
          </TabContext>
        </Box>
        {
          listPhotos.length == 0 &&
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
              listPhotos?.map((e, i) => (
                <div
                  onClick={() => handleLinkTo(e)} key={i} className='col-span-12 xs:col-span-6 md:col-span-4 lg:col-span-3 cursor-pointer'>
                  <img src={e?.photoUrl} className='object-cover h-full rounded-md border w-full' />
                </div>
              ))
            }
          </div>
        </InfiniteScroll>

      </div>
    </div>
  )
}

export default Photos
