import { IconMessage } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { getStatus, searchAll } from '~/apis'
import UserAvatar from '~/components/UI/UserAvatar'
import { SEARCH_TYPE } from '~/utils/constants'
import NotFound from '~/assets/img/not_found.png'
import InfiniteScroll from '~/components/IntersectionObserver/InfiniteScroll'
import { useDispatch } from 'react-redux'
import { addListReactType, addListUserStatus } from '~/redux/sideData/sideDataSlice'
import { getAllReactType } from '~/apis/reactApis'
import Post from '~/components/ListPost/Post/Post'
import ListPost from '~/components/ListPost/ListPost'

function PostSearch() {
  const [searchParams, setSearchParams] = useSearchParams()
  const dispatch = useDispatch()
  const [searchResults, setSearchResults] = useState([])
  const query = searchParams.get('q')
  const { t } = useTranslation()
  useEffect(() => {
    getStatus().then(data => dispatch(addListUserStatus(data)))
    getAllReactType().then(data => dispatch(addListReactType(data)))
  }, [])

  // useEffect(() => {
  //   searchAll({ search: query, type: SEARCH_TYPE.POST })
  //     .then(res => {
  //       setSearchResults(res?.userPosts)
  //     })
  // }, [query])

  return (
    <div className='bg-fbWhite h-full overflow-y-auto scrollbar-none-track flex justify-center'>
      <div className='flex flex-col gap-4 w-[80%] lg:w-[600px] p-8'>
        <ListPost getListPostFn={({ page }) => searchAll({ search: query, type: SEARCH_TYPE.POST, page })} />
      </div>
    </div>
  )
}

export default PostSearch
