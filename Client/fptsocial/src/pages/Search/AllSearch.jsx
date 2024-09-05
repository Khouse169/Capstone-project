import { IconMessage } from '@tabler/icons-react'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import { searchAll } from '~/apis'
import ListPost from '~/components/ListPost/ListPost'
import GroupAvatar from '~/components/UI/GroupAvatar'
import SearchNotFound from '~/components/UI/SearchNotFound'
import UserAvatar from '~/components/UI/UserAvatar'
import { SEARCH_TYPE } from '~/utils/constants'

function SearchAll() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [searchResults, setSearchResults] = useState([])
  const query = searchParams.get('q')
  const { t } = useTranslation()

  useEffect(() => {
    searchAll({ search: query, type: SEARCH_TYPE.ALL, page: 1 })
      .then(res => {
        setSearchResults(res)
      })
  }, [query])

  const getListPostFn = useCallback(({ page }) => searchAll({ search: query, type: SEARCH_TYPE.POST, page }), [])

  return (
    <div className='bg-fbWhite h-full overflow-y-auto scrollbar-none-track flex justify-center'>
      <div className='flex flex-col gap-4 w-[80%] md:w-[600px] pt-8'>
        {
          searchResults?.userProfiles?.map(user => (
            <div key={user?.userId} className='flex gap-2 bg-white py-2 px-3 rounded-md shadow-lg w-full'>
              <Link to={`/profile?id=${user?.userId}`}>
                <UserAvatar avatarSrc={user?.avataUrl} isOther={true} />
              </Link>

              <span className='grow capitalize'>{user?.userName}</span>
              <Link to={`/profile?id=${user?.userId}`} className='flex item-center justify-start bg-blue-50 text-blue-500 p-2 rounded-md cursor-pointer'>
                View profile
              </Link>
            </div>
          ))
        }
        {
          searchResults?.groups?.map(group => (
            <div key={group?.groupId} className='flex gap-2 bg-white py-2 px-3 rounded-md shadow-lg w-full'>
              <Link to={`/groups/${group?.groupId}`}>
                <GroupAvatar avatarSrc={group?.coverImage} />
              </Link>
              <div className='grow'>
                <Link to={`/groups/${group?.groupId}`} className='capitalize hover:underline'>{group?.groupName}</Link>
                <div className='first-letter:uppercase text-sm font-light'>{group?.groupDescription}</div>
              </div>

              <Link to={`/groups/${group?.groupId}`} className=' h-fit bg-blue-50 hover:bg-blue-100 text-blue-500 p-2 rounded-md cursor-pointer'>
                View
              </Link>
            </div>
          ))
        }
        <ListPost getListPostFn={getListPostFn} />
        {
          searchResults?.groups?.length == 0 && searchResults?.userPosts?.length == 0 && searchResults?.userProfiles?.length == 0 && <SearchNotFound />
        }
      </div>
    </div>
  )
}

export default SearchAll
