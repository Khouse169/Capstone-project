import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import ActivePost from '../Modal/ActivePost/ActivePost'
import Post from './Post/Post'
import UpdatePost from '../Modal/ActivePost/UpdatePost'
import SharePost from '../Modal/ActivePost/SharePost'
import PageLoadingSpinner from '../Loading/PageLoadingSpinner'
import InfiniteScroll from '../IntersectionObserver/InfiniteScroll'
import { addCurrentActiveListPost, clearCurrentActiveListPost, selectCurrentActiveListPost, selectTotalPage } from '~/redux/activeListPost/activeListPostSlice'
import { selectIsShowModalActivePost, selectIsShowModalSharePost, selectIsShowModalUpdatePost } from '~/redux/activePost/activePostSlice'
import Report from '../Modal/Report/Report'
import { selectIsOpenReport } from '~/redux/report/reportSlice'
import { selectIsReload } from '~/redux/ui/uiSlice'
import { getStatus } from '~/apis'
import { getAllReactType } from '~/apis/reactApis'
import { addListReactType, addListUserStatus } from '~/redux/sideData/sideDataSlice'
import SearchNotFound from '../UI/SearchNotFound'

function ListPost({ getListPostFn, isBan = false, isAdmin = false }) {
  const location = useLocation()
  const currentActiveListPost = useSelector(selectCurrentActiveListPost)
  const [page, setPage] = useState(1)
  const totalPage = useSelector(selectTotalPage)
  const dispatch = useDispatch()
  const isReload = useSelector(selectIsReload)
  const [isLoading, setIsLoading] = useState(true)
  const latestRequestIdRef = useRef(0)
  const isMountedRef = useRef(true)

  const isShowActivePost = useSelector(selectIsShowModalActivePost)
  const isShowUpdatePost = useSelector(selectIsShowModalUpdatePost)
  const isShowSharePost = useSelector(selectIsShowModalSharePost)
  const isShowModalReport = useSelector(selectIsOpenReport)

  useEffect(() => {
    isMountedRef.current = true

    getStatus().then(data => dispatch(addListUserStatus(data)))
    getAllReactType().then(data => dispatch(addListReactType(data)))

    return () => {
      isMountedRef.current = false
    }
  }, [dispatch])

  useEffect(() => {
    setPage(1)
    dispatch(clearCurrentActiveListPost())
    setIsLoading(true)
  }, [location, dispatch, getListPostFn, isBan, isReload])

  useEffect(() => {
    if (getListPostFn) {
      const fetchData = async () => {
        const currentRequestId = ++latestRequestIdRef.current
        try {
          const res = await getListPostFn({ page: 1 })
          if (isMountedRef.current && currentRequestId === latestRequestIdRef.current) {
            dispatch(addCurrentActiveListPost({ result: res?.result || res.userPosts, totalPage: res?.totalPage }))
            setIsLoading(false)
          }
        } catch (error) {
          if (isMountedRef.current && currentRequestId === latestRequestIdRef.current) {
            console.error('Error fetching data:', error)
            setIsLoading(false)
          }
        }
      }
      fetchData()
    }
  }, [getListPostFn, dispatch, isBan, isReload])

  useEffect(() => {
    if (page > 1 && getListPostFn) {
      const fetchMoreData = async () => {
        const currentRequestId = ++latestRequestIdRef.current
        try {
          const res = await getListPostFn({ page })
          if (isMountedRef.current && currentRequestId === latestRequestIdRef.current) {
            dispatch(addCurrentActiveListPost({ result: res?.result || res.userPosts, totalPage: res?.totalPage }))
          }
        } catch (error) {
          if (isMountedRef.current && currentRequestId === latestRequestIdRef.current) {
            console.error('Error fetching more data:', error)
          }
        }
      }
      fetchMoreData()
    }
  }, [page, getListPostFn, dispatch])

  return (
    <div id="post-list" className="relative min-h-[1000px] w-full">
      {isShowActivePost && <ActivePost />}
      {isShowUpdatePost && <UpdatePost />}
      {isShowSharePost && <SharePost />}
      {isShowModalReport && <Report />}

      {isLoading ? (
        <div className='absolute flex items-center top-[100px] left-1/2 -translate-x-1/2 '>
          <PageLoadingSpinner />
        </div>
      ) : currentActiveListPost?.length === 0 ? (
        <SearchNotFound isNoneData={true} />
      ) : (
        <InfiniteScroll
          className=""
          fetchMore={() => setPage((prev) => prev + 1)}
          hasMore={page < totalPage}
          endMessage={'You have seen it all'}
        >
          <div className='flex flex-col items-center gap-5'>
            {currentActiveListPost?.map((post, key) => (
              <Post key={key} postData={post} isBan={isBan} isAdmin={isAdmin} />
            ))}
          </div>
        </InfiniteScroll>
      )}
    </div>
  )
}

export default ListPost