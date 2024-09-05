import { Button, Modal, Popover } from '@mui/material'
import { IconChartArrowsVertical, IconDotsVertical, IconKarate, IconX } from '@tabler/icons-react'
import { useState } from 'react'
import { useSelector } from 'react-redux'
import UserAvatar from '~/components/UI/UserAvatar'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { ADMIN, CENSOR } from '~/utils/constants'

function ListMemberByRole({ listMember, roleType, currentUserType, handleUpdateMember, listGroupRole }) {
  const currentUser = useSelector(selectCurrentUser)
  const [anchorEl, setAnchorEl] = useState({})
  const [isOpenModal, setIsOpenModal] = useState(false)
  const [selectedMember, setSelectedMember] = useState(null)

  const handleClick = (event, memberId) => {
    setAnchorEl(prev => ({ ...prev, [memberId]: event.currentTarget }))
  }

  const handleClose = (memberId) => {
    setAnchorEl(prev => ({ ...prev, [memberId]: null }))
  }

  const handleOpenModal = (member) => {
    setSelectedMember(member)
    setIsOpenModal(true)
  }

  return (
    <div className='flex flex-col w-[90%] md:w-[70%] bg-white rounded-lg'>
      <div className='capitalize font-semibold px-2 py-1'>
        {roleType}
      </div>
      <div className='flex flex-col gap-4'>
        {listMember?.length === 0 && <span className='p-4'>The group does not have {roleType}</span>}
        {
          listMember?.map(member => (
            <div key={member?.userId} className='flex justify-between items-center bg-white p-4 rounded-lg'>
              <div className='flex gap-2 items-center'>
                <UserAvatar avatarSrc={member?.avata} isOther={true} />
                <div className='flex flex-col'>
                  <span className={`font-semibold capitalize ${currentUser?.userId == member?.userId && 'text-orangeFpt'}`}>{member?.memberName}</span>
                  <span
                    className={`font-semibold text-sm 
                      ${member?.groupRoleName?.toLowerCase() === 'admin' ? 'text-red-700/90' : 'text-gray-500/90'}`}>
                    {member?.groupRoleName}</span>
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <IconDotsVertical className='text-orangeFpt cursor-pointer hover:bg-orange-100 rounded-full size-8 p-1'
                  onClick={(e) => handleClick(e, member.userId)} />
              </div>
              <Popover
                open={Boolean(anchorEl[member.userId])}
                anchorEl={anchorEl[member.userId]}
                onClose={() => handleClose(member.userId)}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right'
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right'
                }}
              >
                <div className=' p-2'>
                  {currentUserType === ADMIN &&
                    <div
                      className='interceptor-loading flex gap-1 items-center font-semibold py-1 px-2 cursor-pointer text-orangeFpt
                       hover:text-white hover:bg-orangeFpt rounded-lg'
                      onClick={() => handleOpenModal(member)}
                    >
                      <IconChartArrowsVertical />Promote user
                    </div>
                  }
                  {

                    <div
                      onClick={() => handleUpdateMember(2, member)}
                      className='interceptor-loading flex gap-1 items-center font-semibold py-1 px-2 cursor-pointer text-orangeFpt
                   hover:text-white hover:bg-orangeFpt rounded-lg'
                      style={{
                        opacity: currentUserType == CENSOR && (member?.groupRoleName?.toLowerCase() == ADMIN || member?.groupRoleName?.toLowerCase() == CENSOR) ? '0.5' : 'initial',
                        pointerEvents: currentUserType == CENSOR && (member?.groupRoleName?.toLowerCase() == ADMIN || member?.groupRoleName?.toLowerCase() == CENSOR) ? 'none' : 'initial'
                      }}
                    >
                      <IconKarate />Kick member
                    </div>
                  }
                </div>
              </Popover>
            </div>
          ))
        }
      </div>
      <Modal
        open={isOpenModal}
        onClose={() => setIsOpenModal(false)}
      >
        <div className='flex flex-col items-center gap-3  absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2
            bg-white border-gray-300 shadow-md rounded-md'>
          <div className='h-[40px] w-full flex justify-between items-center px-4'>
            <div></div>
            <span className='font-bold font-sans'>Choose role</span>
            <div className='cursor-pointer' onClick={() => setIsOpenModal(false)}>
              <IconX className='text-white bg-orangeFpt rounded-full' />
            </div>
          </div>
          <div className='p-4 flex flex-col gap-2'>
            {
              listGroupRole?.map(role => (
                <div key={role?.groupRoleId}
                  className='bg-fbWhite p-2 rounded-lg hover:text-white hover:bg-orangeFpt hover:scale-[1.05] cursor-pointer'
                  onClick={() => {
                    setIsOpenModal(false)
                    handleUpdateMember(1, selectedMember, role)
                  }}
                >
                  <div className='font-semibold'>{role?.groupRoleName}</div>
                  <div>{
                    role?.groupRoleName?.toLowerCase() === ADMIN ? 'Manages all aspects, settings, and users of the platform with full control.'
                      : role?.groupRoleName?.toLowerCase() === CENSOR ? 'Oversees user activities, and manages content moderation.'
                        : 'Participates in community activities, accesses content, and engages with other users.'
                  }
                  </div>
                </div>)
              )
            }
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ListMemberByRole