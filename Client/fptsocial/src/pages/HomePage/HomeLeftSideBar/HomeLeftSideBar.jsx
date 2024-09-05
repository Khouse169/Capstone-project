// import React from 'react'

import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { getGroupByUserId } from '~/apis/groupApis'
import GroupAvatar from '~/components/UI/GroupAvatar'
import { selectCurrentUser } from '~/redux/user/userSlice'
import friendIcon from '~/assets/img/friend.png'
// import groupIcon from '~/assets/img/groups.png'
import groupIcon from '~/assets/img/group.png'
import frogIcon from '~/assets/img/frog.png'
import feedIcon from '~/assets/img/chathome.png'
import UserAvatar from '~/components/UI/UserAvatar'
import { useTranslation } from 'react-i18next'

function HomeLeftSideBar({ user, isShowHomeLeftSideBar }) {
  const [isMore, setIsMore] = useState(false)
  const [listGroup, setListGroup] = useState([])
  const currentUser = useSelector(selectCurrentUser)
  useEffect(() => {
    getGroupByUserId().then(data => setListGroup([...data?.listGroupAdmin || [], ...data?.listGroupMember || []]))
  }, [])
  const { t } = useTranslation()


  return (
    <div className={`h-[calc(100vh_-_55px)] bg-white ${!isShowHomeLeftSideBar && 'hidden'} border-r shadow-inner lg:!flex lg:basis-2/12 flex-col overflow-y-auto scrollbar-none-track font-semibold`}>
      <div className="mx-3 mt-8 mb-5">
        <div id="explore"
          className=" flex flex-col items-start mb-8 border-b-2 border-gray-300"
        >
          <Link to={`/profile?id=${currentUser?.userId}`}
            className="w-full px-2 rounded-md py-3 hover:bg-orangeFpt hover:text-white flex items-center gap-3 cursor-pointer">
            <UserAvatar size='1.75' isOther={false} />
            <span className="capitalize">{user?.firstName + ' ' + user?.lastName}</span>
          </Link>
          <Link to={'/friends'} className="w-full h-[52px] px-2 rounded-md py-3 hover:bg-orangeFpt hover:text-white flex items-center gap-3 cursor-pointer">
            <img src={friendIcon} className='size-7' />
            <span className="">{t('standard.home.sidebar.friends')}</span>
          </Link>

          <Link to={'/groups'}
            className="w-full h-[52px] px-2 rounded-md py-3 hover:bg-orangeFpt hover:text-white flex items-center gap-3 cursor-pointer">
            <img src={groupIcon} className='size-7' />
            <span className="">{t('standard.home.sidebar.groups')}</span>
          </Link>
          <Link to={'/chats-page'} className="w-full h-[52px] px-2 rounded-md py-3 hover:bg-orangeFpt hover:text-white flex items-center gap-3 cursor-pointer ">
            <img src={feedIcon} className='size-7' />
            <span className="">{t('standard.home.sidebar.feeds')}</span>
          </Link>
          <Link to={'/chatbot'}
            className="w-full h-[52px] px-2 rounded-md py-3 hover:bg-orangeFpt hover:text-white flex items-center gap-3 cursor-pointer">
            <img src={frogIcon} className='size-7' />
            <span className="">{t('standard.home.sidebar.chatbot')}</span>
          </Link>
        </div>

        <div id="group"
          className="flex flex-col items-start mb-5"
        >
          <p className="text-gray-500">{t('standard.home.sidebar.your_shortcut')}</p>
          {
            listGroup?.map(group => (
              <Link
                to={`/groups/${group?.groupId}`}
                key={group?.groupId}
                className="w-full px-2 rounded-md py-3 hover:bg-orangeFpt hover:text-white flex items-center gap-3 cursor-pointer">
                <GroupAvatar
                  avatarSrc={group?.coverImage}
                  className="rounded-md aspect-square object-cover w-8"
                />

                <span className=" capitalize">{group?.groupName}</span>
              </Link>
            ))
          }


          {/* <a
            onClick={() => setIsMore(!isMore)}
            className="w-full px-2 rounded-md py-3 hover:bg-orangeFpt hover:text-white flex items-center gap-3 cursor-pointer">
            {!isMore ?
              (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                <path fillRule="evenodd" d="M12.53 16.28a.75.75 0 0 1-1.06 0l-7.5-7.5a.75.75 0 0 1 1.06-1.06L12 14.69l6.97-6.97a.75.75 0 1 1 1.06 1.06l-7.5 7.5Z" clipRule="evenodd" />
              </svg>)
              :
              (<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                <path fillRule="evenodd" d="M11.47 7.72a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06L12 9.31l-6.97 6.97a.75.75 0 0 1-1.06-1.06l7.5-7.5Z" clipRule="evenodd" />
              </svg>
              )
            }
            <span className="">{isMore ? 'Hide' : 'More'}</span>
          </a> */}
        </div>
      </div>


    </div>
  )
}

export default HomeLeftSideBar