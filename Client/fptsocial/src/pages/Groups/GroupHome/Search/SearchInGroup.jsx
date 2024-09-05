import { IconSearch } from '@tabler/icons-react'
import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import { searchGroupPost } from '~/apis/groupApis'
import { getAllReactByGroupPostId, getAllReactByGroupSharePostId } from '~/apis/groupPostApis'
import InfiniteScroll from '~/components/IntersectionObserver/InfiniteScroll'
import Post from '~/components/ListPost/Post/Post'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import ActivePost from '~/components/Modal/ActivePost/ActivePost'
import SharePost from '~/components/Modal/ActivePost/SharePost'
import UpdatePost from '~/components/Modal/ActivePost/UpdatePost'
import { useDebounceFn } from '~/customHooks/useDebounceFn'
import { selectCurrentActiveGroup } from '~/redux/activeGroup/activeGroupSlice'
import { addCurrentActiveListPost, clearCurrentActiveListPost, selectCurrentActiveListPost, selectTotalPage, updateCurrentActiveListPost } from '~/redux/activeListPost/activeListPostSlice'
import { selectIsShowModalActivePost, selectIsShowModalSharePost, selectIsShowModalUpdatePost } from '~/redux/activePost/activePostSlice'
import { selectIsReload } from '~/redux/ui/uiSlice'
import { POST_TYPES } from '~/utils/constants'

function SearchInGroup() {
  const currentActiveListPost = useSelector(selectCurrentActiveListPost)
  const dispatch = useDispatch()
  const location = useLocation()
  const [page, setPage] = useState(1)
  const totalPage = useSelector(selectTotalPage)
  const currentActiveGroup = useSelector(selectCurrentActiveGroup)
  const [loading, setLoading] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const isInGroupPath = /^\/groups\/\w+\/?.*$/.test(location.pathname)
  const isShowActivePost = useSelector(selectIsShowModalActivePost)
  const isShowUpdatePost = useSelector(selectIsShowModalUpdatePost)
  const isShowSharePost = useSelector(selectIsShowModalSharePost)
  const isReload = useSelector(selectIsReload)

  useEffect(() => {
    dispatch(clearCurrentActiveListPost())
  }, [])

  const handleGetReact = async (postData) => {
    let postType = ''
    if (currentActiveListPost?.isGroupPost || isInGroupPath || currentActiveListPost?.groupId) {
      if (currentActiveListPost?.isShare) postType = POST_TYPES.GROUP_SHARE_POST
      else postType = POST_TYPES.GROUP_POST
    }
    const isGroup = postType == POST_TYPES.GROUP_POST
    const isGroupShare = postType == POST_TYPES.GROUP_SHARE_POST

    const response = await (
      isGroup ? getAllReactByGroupPostId(postData?.groupPostId || postData?.postId)
        : isGroupShare && getAllReactByGroupSharePostId(postData?.groupSharePostId || postData?.postId)
    )
    return response
  }

  useEffect(() => {
    (async () => {
      let response = await handleInputSearchChange()
      if (response.result?.length == 0) {
        dispatch(clearCurrentActiveListPost())
        return
      }
      let dataListPost = response?.result?.map(post =>
        handleGetReact(post).then((status) => ({ ...post, postReactStatus: status }))
      )
      Promise.all(dataListPost)
        .then(results => {
          if (isReload != 0)
            dispatch(updateCurrentActiveListPost(results))
          else
            dispatch(addCurrentActiveListPost({ result: results, totalPage: response?.totalPage }))
        })
        .catch(error => {
          console.error('Error processing posts:', error)
        })

    })()
  }, [page, isReload, searchValue])

  const handleInputSearchChange = async () => {
    if (!searchValue.trim()) {
      dispatch(updateCurrentActiveListPost([]))
      return
    }
    setLoading(true)
    const listPostData = await searchGroupPost({ search: searchValue, groupId: currentActiveGroup?.groupId, page: page })
    setLoading(false)

    // .then(res => {
    //   console.log('🚀 ~ handleInputSearchChange ~ res:', res)

    //   // if (searchValueCurrent == searchValue)
    //   if (searchValue)
    //     dispatch(addCurrentActiveListPost({ result: res.result, totalPage: res.totalPage }))
    //   else
    //     dispatch(updateCurrentActiveListPost(res.result))
    // })
    // .finally(() => {
    //   setLoading(false)
    // })
    return listPostData
  }

  const inputRef = useRef(null)

  const handleIconClick = () => {
    const keyDownEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      keyCode: 13,
      which: 13,
      bubbles: true
    })
    inputRef.current.dispatchEvent(keyDownEvent)
  }

  return (
    <div id='list-group-post'
      className='h-full flex flex-col items-center lg:flex-row lg:justify-center lg:items-start w-full gap-3 bg-fbWhite'>
      {isShowActivePost && <ActivePost />}
      {isShowUpdatePost && <UpdatePost />}
      {isShowSharePost && <SharePost />}

      <div className='relative flex flex-col gap-3'>
        <div className='bg-white p-4'>
          <div className="relative text-gray-600" >
            <input
              ref={inputRef}
              className="w-full bg-fbWhite h-10 px-5 pr-16 rounded-xl text-sm font-light focus:outline-none"
              type="search" placeholder="Search group posts..."
              onKeyDown={(e) => { e.key == 'Enter' && setSearchValue(e.target.value) }}
            />
            <span className='absolute right-2 top-1/2 -translate-y-1/2' onClick={handleIconClick}><IconSearch className='text-orangeFpt' /></span>
          </div>
        </div>
        {loading && <PageLoadingSpinner />}
        <InfiniteScroll
          // className="w-[800px] mx-auto my-10"
          className=""
          fetchMore={() => setPage((prev) => prev + 1)}
          hasMore={page < totalPage}
          endMessage={!searchValue ? 'Type something...' : loading ? 'Loading...' : !currentActiveListPost ? 'Data not found!' : !(page < totalPage) && 'End of results'}
        >
          <div className='flex flex-col items-center gap-3'>
            {currentActiveListPost?.map((post, key) => {
              return <Post
                key={key}
                postData={post} />
            })}
          </div>
        </InfiniteScroll>
      </div>
    </div >
  )
}

export default SearchInGroup
