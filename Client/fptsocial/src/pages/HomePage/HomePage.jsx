import { useEffect, useState } from 'react'
import ListPost from '~/components/ListPost/ListPost'
import NavTopBar from '~/components/NavTopBar/NavTopBar'
import HomeLeftSideBar from './HomeLeftSideBar/HomeLeftSideBar'
import HomeRightSideBar from './HomeRightSideBar/HomeRightSideBar'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import NewPost from '~/components/Modal/NewPost/NewPost'
import { selectIsReload, selectIsShowHomeLeftSideBar } from '~/redux/ui/uiSlice'
import { POST_TYPES } from '~/utils/constants'
import { getAllPost, getUserPostByUserId } from '~/apis/postApis'
import { addCurrentActiveListPost } from '~/redux/activeListPost/activeListPostSlice'

function HomePage() {
  const user = useSelector(selectCurrentUser)
  const isShowHomeLeftSideBar = useSelector(selectIsShowHomeLeftSideBar)

  return (
    <>
      <NavTopBar />
      <div className={`flex bg-fbWhite ${!isShowHomeLeftSideBar && 'justify-center'} lg:justify-between h-[calc(100vh_-_55px)] overflow-hidden`}>
        <HomeLeftSideBar isShowHomeLeftSideBar={isShowHomeLeftSideBar} user={user} />
        {
          !isShowHomeLeftSideBar && <>
            <div className='h-[calc(100vh_-_55px)] basis-11/12 md:basis-9/12 xl:basis-7/12 overflow-y-auto scrollbar-none-track
              flex flex-col items-center gap-4'>
              <NewPost postType={POST_TYPES.PROFILE_POST} />
              <ListPost getListPostFn={getAllPost} />
            </div>
            <HomeRightSideBar />
          </>
        }
      </div>
    </>


  )
}

export default HomePage