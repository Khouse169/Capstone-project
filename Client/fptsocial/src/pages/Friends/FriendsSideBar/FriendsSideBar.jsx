import { IconUserPlus, IconUserShare, IconUsersGroup } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

function FriendsSideBar({ isRequests, isSuggestions, isFriendList, isSendedRequests }) {
  const { t } = useTranslation()
  return (
    <div className="max-h-[calc(100vh_-_55px)] w-[380px] flex flex-col overflow-y-auto scrollbar-none-track border-r shadow-lg">
      <div className="p-3">
        <span className='text-2xl font-bold'>Friends</span>
        <div
          className="flex flex-col items-start mb-8"
        >
          <Link to={'/friends/requests'}
            className={`w-full hover:text-white hover:bg-fbWhite ${isRequests && 'text-white bg-fbWhite'} flex items-center rounded-md gap-3 p-2 cursor-pointer`}>
            <IconUserShare className='text-white bg-orangeFpt size-9 p-1 rounded-full' />
            <span className="font-semibold text-gray-900 ">{t('standard.friend.request')}</span>
          </Link>
          <Link to={'/friends/suggestions'}
            className={`w-full hover:text-white hover:bg-fbWhite ${isSuggestions && 'text-white bg-fbWhite'} flex items-center rounded-md gap-3 p-2 cursor-pointer`}>
            <IconUserPlus className='text-white bg-orangeFpt size-9 p-1 rounded-full' />
            <span className="font-semibold text-gray-900 ">{t('standard.friend.suggest')}</span>
          </Link>
          <Link to={'/friends/list'}
            className={`w-full hover:text-white hover:bg-fbWhite ${isFriendList && 'text-white bg-fbWhite'} flex items-center rounded-md gap-3 p-2 cursor-pointer`}>
            <IconUsersGroup className='text-white bg-orangeFpt size-9 p-1 rounded-full' />
            <span className="font-semibold text-gray-900 ">{t('standard.friend.listFriend')}</span>
          </Link>
          <Link to={'/friends/sendrequests'}
            className={`w-full hover:text-white hover:bg-fbWhite ${isSendedRequests && 'text-white bg-fbWhite'} flex items-center rounded-md gap-3 p-2 cursor-pointer`}>
            <IconUsersGroup className='text-white bg-orangeFpt size-9 p-1 rounded-full' />
            <span className="font-semibold text-gray-900 ">{t('standard.friend.yourRequest')}</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default FriendsSideBar
