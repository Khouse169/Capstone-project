import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import FPTUen from '~/assets/img/FPTUen.png'
import { IconCaretLeftFilled, IconSearch } from '@tabler/icons-react'
import { searchAll } from '~/apis'
import { useDebounceFn } from '~/customHooks/useDebounceFn'
import UserAvatar from '~/components/UI/UserAvatar'
import GroupAvatar from '~/components/UI/GroupAvatar'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import { useTranslation } from 'react-i18next'

function LeftTopBar() {
  const [isSearch, setIsSearch] = useState(false)
  const { t } = useTranslation()
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState(null)
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q')
  // const [searchHistoryData, setSearchHistoryData] = useState([])
  const [searchData, setSearchData] = useState([])
  const refModal = useRef()
  const checkClickOutSide = (e) => {
    if (isSearch && !refModal.current.contains(e.target)) {
      setIsSearch(!isSearch)
    }
  }

  useEffect(() => {
    document.addEventListener('click', checkClickOutSide)
    return () => document.removeEventListener('click', checkClickOutSide)
  }, [isSearch])

  const handleClickSearch = () => {
    if (isSearch) return
    setIsSearch(!isSearch)
  }

  const handleInputSearchChange = (event) => {
    const searchValue = event.target?.value?.trim()
    if (!searchValue) {
      setSearchData([])
      return
    }

    // const searchPath = `?${createSearchParams({ 'q[title]': searchValue })}`

    setIsLoading(true)
    searchAll({ search: searchValue })
      .then(res => {
        setSearchData([...res.userProfiles, ...res.groups])
        // setSearchData([...res.userProfiles])
      })
      .finally(() => {
        setIsLoading(false)
      })
  }
  const debounceSearchAll = useDebounceFn(handleInputSearchChange, 1000)
  const navigate = useNavigate()
  const handlePressEnter = (e) => {
    // console.log('🚀 ~ handlePressEnter ~ e:', e)
    if (e.key == 'Enter' && !!e.target?.value?.trim())
      navigate(`/search/?q=${e.target?.value?.trim()}`)
  }

  return <div id='left-top-bar'
    ref={refModal}
    className="flex gap-1 md:gap-5 justify-around items-center"
  >
    {!isSearch &&
      <Link to={'/home'} className="flex items-center">
        <img
          src={FPTUen}
          // src='https://is1-ssl.mzstatic.com/image/thumb/Purple126/v4/25/a3/fd/25a3fd67-a758-8e6f-99e2-c0c2f629d04c/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/246x0w.webp'
          alt="home-img"
          // className="w-[45px] rounded-full"
          className="h-[55px]"
        />
      </Link>
    }
    {
      isSearch && (
        <div className='absolute top-0 left-0 h-fit w-full sm:w-[400px] bg-white shadow-4edges rounded-lg z-50'>
          <div className='flex items-center px-7 gap-5 pt-2 pb-4'>
            <div className='p-2 bg-orangeFpt text-white rounded-full cursor-pointer'
              onClick={() => setIsSearch(!isSearch)}>
              <IconCaretLeftFilled className='size-6' />
            </div>

            <div
              className="p-2 w-full flex items-center bg-fbWhite text-xs text-gray-600 rounded-3xl"
              onClick={handleClickSearch}
            >
              <div className="" >
                <IconSearch className='size-5 text-orangeFpt' />
              </div>

              <input
                autoFocus
                defaultValue={searchQuery?.trim() || query}
                type="text"
                className="w-full h-[24px] bg-fbWhite p-2 text-base focus:outline-none"
                placeholder="Search..."
                onChange={(e) => {
                  debounceSearchAll(e)
                  setSearchQuery(e.target.value)
                }}
                onKeyDown={handlePressEnter}
              />
            </div>
          </div>
          <div id='search-data'
            className='flex justify-center'>
            <div className='w-[90%] flex flex-col items-center'>
              {/* {textSearch.length == 0 && (
                <div className='w-full flex  justify-between'>
                  <span className='text-md font-semibold font-sans p-2'>Recent</span>
                  <span className='text-md font-semibold font-sans text-[rgb(0,100,209)] cursor-pointer hover:bg-fbWhite p-2'>Edit</span>
                </div>
              )} */}
              <div className='w-full flex flex-col items-center'>
                {
                  searchData?.length === 0 ? (
                    <>
                      {
                        (searchQuery?.length == 0 || !searchQuery) ? <div className='font-semibold font-mb text-gray-500'>{t('standard.search.writeSt')}</div>
                          : (isLoading)
                            ? <PageLoadingSpinner />
                            : <div className='font-semibold font-mb text-gray-500'>{t('standard.search.noData')}</div>
                      }
                    </>
                  ) : (
                    searchData?.slice(0, 7)?.map(searchResult => {
                      let isGroup = !!searchResult?.groupId

                      return <Link
                        to={isGroup ? `/groups/${searchResult.groupId}` : `/profile?id=${searchResult.userId}`}
                        key={isGroup ? searchResult?.groupId : searchResult?.userId}
                        className='h-[60px] w-full rounded-3xl flex items-center gap-3 group hover:bg-orangeFpt hover:text-white cursor-pointer p-2'
                      >
                        <div className='basis-2/12'>
                          {
                            isGroup ? <GroupAvatar avatarSrc={searchResult?.coverImage} />
                              : <UserAvatar avatarSrc={searchResult?.avataUrl} isOther="true" />
                          }
                        </div>
                        <div className='basis-9/12 flex flex-col capitalize'>
                          <span className='font-semibold '>{isGroup ? searchResult?.groupName : searchResult?.userName}</span>
                          <span className='text-sm text-gray-500/90 group-hover:text-white'>{isGroup ? t('standard.search.group') : t('standard.search.user')}</span>
                        </div>
                      </Link>
                    }
                    )
                  )
                }
                {
                  searchData.length > 0 &&
                  <Link to={`/search/?q=${searchQuery}`}
                    className='text-orangeFpt p-2 hover:bg-blue-50 rounded-md'
                  >{t('standard.search.viewAll')}
                  </Link>
                }
              </div>
            </div>
          </div>

        </div>
      )
    }
    <div className='relative flex items-center justify-start sm:justify-between'>
      <div id="search-box"
        className=" p-2 h-fit w-fit lg:h-9 lg:w-[240px] flex items-center bg-fbWhite text-xs text-gray-600 rounded-3xl"
        onClick={handleClickSearch}
      >
        <div className={`p-1 left-6 ${isSearch && 'hidden w-0'}`}
        >
          <IconSearch className='size-5 text-orangeFpt' />
        </div>

        <input
          defaultValue={searchQuery?.trim() || query}
          type="text"
          className={`hidden md:!block ${isSearch && '!block '} w-[196px] h-[24px] bg-fbWhite p-2 text-base focus:outline-none `}
          placeholder="Search..."
        />
      </div>
    </div>
  </div>
}

export default LeftTopBar
