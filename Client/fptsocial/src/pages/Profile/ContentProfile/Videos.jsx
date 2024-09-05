import { TabContext, TabList } from '@mui/lab';
import { Box, Tab } from '@mui/material';
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { getVideoByUserId } from '~/apis';
import { SEARCH_TYPE } from '~/utils/constants';
import notFoundImg from '~/assets/img/not_found.png'
import { useSelector } from 'react-redux';
import { selectCurrentUser } from '~/redux/user/userSlice';

function Videos({ user }) {
  const [listVideos, setListVideos] = useState([])
  const currentUser = useSelector(selectCurrentUser)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    user &&
      getVideoByUserId({ userId: currentUser?.userId, strangerId: user?.userId, page }).then(data => setListVideos(data?.videos))
  }, [user])

  const navigate = useNavigate()
  const handleLinkTo = (e, event) => {
    event.preventDefault()
    if (e?.userPostVideoId)
      navigate(`/video/${e?.userPostVideoId}?type=video`)
    else if (e?.userPostId)
      navigate(`/media/${e?.userPostId}?type=profile`)
  }
  return (
    <div className='flex justify-center min-h-[300px]'>
      <div className='w-[90%] md:w-[80%] bg-white p-4 rounded-xl shadow-xl'>
        <div className='grid grid-cols-12 gap-1 '>
          {
            listVideos?.map((e, i) => (
              <div
                onClick={(event) => handleLinkTo(e, event)} key={i} className='col-span-12 xs:col-span-6 md:col-span-4 '>
                <video loading="lazy" src={e?.videoUrl} className='object-cover h-full rounded-md border' controls />
              </div>
            ))
          }
        </div>
        {
          listVideos.length == 0 &&
          <div className='w-full flex justify-center'>
            <div className='flex flex-col items-center font-semibold capitalize text-gray-500'>
              <img src={notFoundImg} className='size-20' />
              <span>No data</span>
            </div>
          </div>
        }
      </div>
    </div>
  )
}

export default Videos;
