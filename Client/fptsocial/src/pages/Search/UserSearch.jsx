import { IconMessage } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { searchAll } from '~/apis'
import InfiniteScroll from '~/components/IntersectionObserver/InfiniteScroll'
import SearchNotFound from '~/components/UI/SearchNotFound'
import UserAvatar from '~/components/UI/UserAvatar'
import { SEARCH_TYPE } from '~/utils/constants'

function UserSearch() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [page, setPage] = useState(1)
  const [totalPage, setTotalPage] = useState(2)
  const [searchResults, setSearchResults] = useState([])
  const query = searchParams.get('q')
  const { t } = useTranslation()
  useEffect(() => {
    searchAll({ search: query, type: SEARCH_TYPE.USER, page: page })
      .then(res => {
        setSearchResults([...searchResults, ...res.userProfiles])
        setTotalPage(res?.totalPage)
      })
  }, [query, page])
  return (
    <div className='bg-fbWhite h-full overflow-y-auto scrollbar-none-track flex justify-center'>
      <div className='w-[80%] lg:w-[600px] p-8'>
        <InfiniteScroll
          className={'flex flex-col gap-4 w-full'}
          fetchMore={() => setPage((prev) => prev + 1)}
          hasMore={page < totalPage}>
          {
            searchResults?.map(user => (
              <div key={user?.userId} className='flex w-full gap-2 items-center bg-white py-2 px-3 rounded-md shadow-lg'>
                <Link to={`/profile?id=${user?.userId}`}>
                  <UserAvatar avatarSrc={user?.avataUrl} isOther={true} />
                </Link>

                <Link to={`/profile?id=${user?.userId}`} className='grow capitalize hover:underline'>{user?.userName}</Link>
                <Link to={`/profile?id=${user?.userId}`} className='flex item-center justify-start bg-blue-50 text-blue-500 p-2 rounded-md cursor-pointer'>
                  View profile
                </Link>
              </div>
            ))
          }
        </InfiniteScroll>

        {
          searchResults.length == 0 && <SearchNotFound />
        }
      </div>
    </div>
  )
}

export default UserSearch
