import { IconArticle, IconTallymark4, IconUserFilled, IconUsersGroup } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, NavLink, useLocation, useSearchParams } from 'react-router-dom'
import { searchAll } from '~/apis'
import NavTopBar from '~/components/NavTopBar/NavTopBar'
import UserAvatar from '~/components/UI/UserAvatar'
import UserSearch from './UserSearch'
import GroupSearch from './GroupSearch'
import PostSearch from './PostSearch'
import SearchAll from './AllSearch'

function Search() {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const [searchResults, setSearchResults] = useState([])
  const query = searchParams.get('q')

  const { t } = useTranslation()
  useEffect(() => {
    searchAll({ search: query })
      .then(res => {
        setSearchResults([...res?.userProfiles || [], ...res?.groups || [], ...res?.userPosts || []])
      })
  }, [query])

  return (
    <>
      <NavTopBar />
      <div className={`h-[calc(100vh_-_55px)] w-screen bg-white border-r-2 shadow-lg flex overflow-y-auto scrollbar-none-track font-semibold`}>
        <div className="mx-3 mt-8 mb-5  w-[250px]">
          <div
            className=" flex flex-col gap-1 items-start mb-8 border-b-2 border-gray-300"
          >
            <span className='text-2xl pb-2 border-b-2 w-full'>{t('standard.search.searchResult')}</span>
            <NavLink
              to={`/search/?q=${query}`}
              end
              className={({ isActive }) =>
                `group w-full px-2 rounded-md py-3 hover:bg-fbWhite-500 flex items-center gap-3 cursor-pointer ${isActive ? 'bg-fbWhite' : ''}`
              }
            >
              {({ isActive }) => (
                <>
                  <IconTallymark4 className={`size-8 p-1 rounded-full bg-fbWhite group-hover:text-white group-hover:bg-orangeFpt
            ${isActive ? 'text-white bg-orangeFpt' : ''}`} />
                  <span className="capitalize">{t('standard.search.all')}</span>
                </>
              )}
            </NavLink>
            <NavLink
              to={`/search/post/?q=${query}`}
              className={({ isActive }) =>
                `group w-full h-[52px] px-2 rounded-md py-3 hover:bg-fbWhite-500 flex items-center gap-3 ${isActive ? 'bg-fbWhite' : ''}`
              }
            >
              {({ isActive }) => (
                <>
                  <IconArticle className={`size-8 p-1 rounded-full bg-fbWhite group-hover:text-white group-hover:bg-orangeFpt
            ${isActive ? 'text-white bg-orangeFpt' : ''}`} />
                  <span>{t('standard.search.post')}</span>
                </>
              )}
            </NavLink>

            <NavLink
              to={`/search/user/?q=${query}`}
              className={({ isActive }) =>
                `group w-full h-[52px] px-2 rounded-md py-3 hover:bg-fbWhite-500 flex items-center gap-3 cursor-pointer ${isActive ? 'bg-fbWhite' : ''}`
              }
            >
              {({ isActive }) => (
                <>
                  <IconUserFilled className={`size-8 p-1 rounded-full bg-fbWhite group-hover:text-white group-hover:bg-orangeFpt
            ${isActive ? 'text-white bg-orangeFpt' : ''}`} />
                  <span>{t('standard.search.user')}</span>
                </>
              )}
            </NavLink>

            <NavLink
              to={`/search/group/?q=${query}`}
              className={({ isActive }) =>
                `group w-full h-[52px] px-2 rounded-md py-3 hover:bg-fbWhite-500 flex items-center gap-3 cursor-pointer ${isActive ? 'bg-fbWhite' : ''}`
              }
            >
              {({ isActive }) => (
                <>
                  <IconUsersGroup className={`size-8 p-1 rounded-full bg-fbWhite group-hover:text-white group-hover:bg-orangeFpt
            ${isActive ? 'text-white bg-orangeFpt' : ''}`} />
                  <span>{t('standard.search.group')}</span>
                </>
              )}
            </NavLink>
          </div>
        </div>

        <div className='w-full'>
          {
            location.pathname == ('/search/') && <SearchAll />
          }
          {
            location.pathname.includes('user') && <UserSearch />
          }
          {
            location.pathname.includes('group') && <GroupSearch />
          }
          {
            location.pathname.includes('post') && <PostSearch />
          }
        </div>
      </div>
    </>

  )
}

export default Search
