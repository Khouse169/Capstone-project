import { Button, Modal, Popover } from '@mui/material'
import { IconChartArrowsVertical, IconDotsVertical, IconEdit, IconKarate, IconUserCheck, IconUserPlus, IconUserX, IconX } from '@tabler/icons-react'
import { useConfirm } from 'material-ui-confirm';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { sendFriend, updateFriendStatus } from '~/apis';
import UserAvatar from '~/components/UI/UserAvatar'
import { triggerReload } from '~/redux/ui/uiSlice';
import { selectCurrentUser } from '~/redux/user/userSlice';
import { ADMIN, CENSOR, FRONTEND_ROOT } from '~/utils/constants'
import connectionSignalR from '~/utils/signalRConnection';

function Member({ listMember, roleType, setReload }) {
  const dispatch = useDispatch()
  const { t } = useTranslation()
  const currentUser = useSelector(selectCurrentUser)

  const handleAddFriend = async (reviverId) => {
    try {
      const response = await sendFriend({ userId: currentUser?.userId, friendId: reviverId })
      if (response) {
        const signalRData = {
          MsgCode: 'User-001',
          Receiver: reviverId,
          Url: `${FRONTEND_ROOT}/profile?id=${currentUser?.userId}`,
          AdditionsMsd: '',
          ActionId: 'true'
        }
        await connectionSignalR.invoke('SendNotify', JSON.stringify(signalRData))
      }
      dispatch(triggerReload())
    } catch (err) {
      console.error('Error while starting connection: ', err)
    }
  }

  const handleResponse = (data_) => {
    const data = {
      userId: currentUser?.userId,
      ...data_
    }
    updateFriendStatus(data)
      .then(() => setReload(prev => !prev))
  }

  const confirmUnfriend = useConfirm()
  const openDeleteModal = () =>
    confirmUnfriend({
      title: 'Unfriend this account?',
      description: 'Are you sure want to remove this account from friend list?',
      confirmationText: 'Not anymore',
      cancellationText: 'Continue friend forever'
    }).then(() =>
      handleResponse({
        confirm: false,
        cancel: false,
        reject: true
      })
    )
      .catch(() => { })

  return (
    <div className='flex flex-col w-[90%] md:w-[70%] bg-white rounded-lg border-b-2'>
      <div className='capitalize font-semibold px-2 py-1'>
        {roleType}
      </div>
      <div className='flex flex-col gap-4'>
        {listMember?.length === 0 && <span className='p-4'>The group does not have {roleType}</span>}
        {
          listMember?.map(member => (
            <div key={member?.userId} className='flex justify-between items-center bg-white p-4 rounded-lg'>
              <Link to={`/profile?id=${member?.userId}`} className='flex gap-2 items-center'>
                <UserAvatar avatarSrc={member?.avata} isOther={true} />
                <div className='flex flex-col'>
                  <span className={`font-semibold capitalize hover:underline ${member?.userId === currentUser?.userId ? 'text-orangeFpt' : ''}`}>{member?.memberName}</span>
                  <span
                    className={`font-semibold text-xs
                      ${member?.groupRoleName?.toLowerCase() === 'admin' ? 'text-red-700' : 'text-gray-500/90 '}`}>
                    {member?.groupRoleName}</span>
                </div>
              </Link>
              <div className='flex items-center gap-2'>
                {member?.userId === currentUser?.userId ? (
                  <div className="flex flex-col justify-end mb-4 cursor-pointer"></div>
                ) : member?.isFriend ? (
                  <Button size='small' variant='contained' className="interceptor-loading !text-xs"
                    startIcon={<IconUserCheck stroke={3} />} onClick={openDeleteModal}>
                    {t('standard.profile.friend')}
                  </Button>
                ) : member?.sendFriendRequest ? (
                  <Button size='small' className="interceptor-loading !text-xs"
                    onClick={() => handleAddFriend(member?.userId)} >
                    {t('standard.profile.addFriend')}
                  </Button>
                ) : (
                  <Button size='small' color='warning' className="interceptor-loading !text-xs"
                    onClick={() => handleResponse({ friendId: member?.userId, confirm: false, cancle: true, reject: false })}
                  >
                    {t('standard.profile.cancelRequest')}
                  </Button>
                )
                }
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Member