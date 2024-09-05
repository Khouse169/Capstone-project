import { Box, Button, Checkbox, FormControlLabel, Menu, MenuItem, Modal } from '@mui/material'
import { IconDoorExit, IconDotsVertical, IconMessageReport, IconPlus, IconSearch, IconUsersPlus, IconX } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { cancelRequestJoin, deleteGroup, getListFriendInvited, invitesFriend, leftGroup, requestJoinGroup } from '~/apis/groupApis'
import UserAvatar from '~/components/UI/UserAvatar'
import { triggerReload } from '~/redux/ui/uiSlice'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { useConfirm } from 'material-ui-confirm'
import { addReport, openModalReport } from '~/redux/report/reportSlice'
import { REPORT_TYPES } from '~/utils/constants'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import connectionSignalR from '~/utils/signalRConnection'

function HeaderButton({ group }) {
  const { t } = useTranslation()
  const currentUser = useSelector(selectCurrentUser)
  const [listFriend, setListFriend] = useState([])
  const navigate = useNavigate()

  const { watch, getValues, setValue, control, handleSubmit } = useForm()

  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const dispatch = useDispatch()

  const [anchorEl2, setAnchorEl2] = useState(null)
  const open2 = Boolean(anchorEl2)
  const handleClick2 = (event) => {
    setAnchorEl2(event.currentTarget)
  }
  const handleClose2 = () => {
    setAnchorEl2(null)
  }
  useEffect(() => {
    group &&
      getListFriendInvited(group?.groupId).then(data => setListFriend(data))
  }, [group])


  const sendInvitesFriend = (data) => {
    const submitData = {
      'userId': currentUser?.userId,
      'memberId': data?.inviteFriends?.map(e => e?.userId),
      'groupId': group?.groupId
    }
    invitesFriend(submitData).then(() => {
      if (data) {
        data?.inviteFriends?.map(friend => {
          const signalRData = {
            MsgCode: 'User-008',
            Receiver: `${friend?.userId}`,
            Url: `/groups/${group?.groupId}`,
            AdditionsMsd: ''
          }
          connectionSignalR.invoke('SendNotify', JSON.stringify(signalRData))
        })
      }
    }).then(
      () => {
        dispatch(triggerReload())
        handleClose()
        setValue('inviteFriends', [])
        toast.success('Friends invited!')
      }
    )
  }

  const handleRequestJointGroup = () => {
    const submitData = {
      'userId': currentUser?.userId,
      'groupId': group?.groupId
    }
    requestJoinGroup(submitData).then(() => dispatch(triggerReload()))
  }
  const handleCancelRequestJoinGroup = () => {
    const submitData = {
      'userId': null,
      'groupId': group?.groupId
    }
    cancelRequestJoin(submitData).then(() => dispatch(triggerReload()))
  }
  const confirmFile = useConfirm()
  const handleLeaveGroup = () => {
    const adminCount = group?.groupMember?.reduce((count, member) => {
      return member?.groupRoleName === "Admin" ? count + 1 : count
    }, 0)
    if (adminCount == 1 && group?.isAdmin && group?.memberCount > 1) {
      confirmFile({
        title: (
          <div className="flex flex-col gap-4 p-4 bg-gray-50 rounded-lg shadow-sm">
            <div className="font-bold text-xl text-red-600 border-b-2 border-red-200 pb-2">
              Warning
            </div>
            <div className="text-sm text-gray-700 space-y-2">
              <p>
                You are the last admin in the group. Before proceeding, please take the following action:
              </p>
              <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3 rounded-r-md">
                <p className="font-semibold">Important:</p>
                <p>Promote other users to become admins before making any changes.</p>
              </div>
              <p className="italic text-gray-600">
                This ensures continued management and prevents accidental loss of admin control.
              </p>
            </div>
          </div>
        ),
        description: (''),
        confirmationButtonProps: { color: 'warning', variant: 'contained' },
        confirmationText: 'Understand',
        cancellationText: 'Cancel'
      }).then(() => {
        navigate(`/groups/${group?.groupId}/member-manage`)
      })
    }
    else
      confirmFile({
        title: (
          <div className="flex flex-col gap-4 p-4 bg-gray-50 rounded-lg shadow-sm">
            <div className="font-bold text-xl text-red-600 border-b-2 border-red-200 pb-2">
              Warning: Leaving Group?
            </div>
            <div className="text-sm text-gray-700 space-y-2">
              <p>
                All content, settings, and members associated with this group will be permanently removed. This includes:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Posts</li>
                <li>Files</li>
                <li>Calendar events</li>
                <li>Other group data</li>
              </ul>
              {group?.memberCount === 1 && (
                <p className="mt-4 text-red-600 font-semibold bg-red-100 p-3 rounded-md">
                  You are the last member. Leaving the group also means deleting the group!
                </p>
              )}
            </div>
          </div>
        ),
        description: (''),
        confirmationButtonProps: { color: 'error', variant: 'contained' },
        confirmationText: 'Leave',
        cancellationText: 'Cancel'
      }).then(() => {
        const submitData = {
          'userId': currentUser?.userId,
          'groupId': group?.groupId,
        }
        if (group?.memberCount == 1) {
          const submitData = {
            'userId': currentUser?.userId,
            'groupId': group?.groupId,
          }
          deleteGroup(submitData).then(() => toast.success('Group deleted!')).then(() => navigate('/groups'))
        }
        else {
          leftGroup(submitData).then(() => toast.success(' Leave group successfully!')).then(() => {
            navigate(`/groups`)
            dispatch(triggerReload())
          })
        }
      }).catch(() => { })
  }


  return <div>
    <div className='flex gap-3 h-[40px]'>
      {
        group?.isJoin
          ? <div className='flex gap-2'>
            <Button className='!interceptor-loading' variant="contained" size="medium" startIcon={<IconPlus />} onClick={handleOpen}>
              {t('standard.group.invite')}
            </Button>
            <Button className='!interceptor-loading' variant="contained" size="medium" startIcon={<IconDoorExit />} color='warning'
              onClick={handleLeaveGroup}>
              {t('standard.group.leave')}
            </Button>
          </div>
          : group?.isRequest
            ? <Button className='interceptor-loading' variant="contained" color="warning" size="medium" startIcon={<IconUsersPlus />} onClick={handleCancelRequestJoinGroup}>
              {t('standard.profile.cancelRequest')}
            </Button>
            : <Button className='interceptor-loading' variant="contained" color="success" size="medium" startIcon={<IconUsersPlus />} onClick={handleRequestJointGroup}>
              {t('standard.group.join')}
            </Button>
      }
      <div
        className="rounded-md size-[40px] flex justify-center items-center bg-fbWhite cursor-pointer p-2"
        onClick={handleClick2}
      ><IconDotsVertical /></div>
      <Menu
        anchorEl={anchorEl2}
        id="account-menu"
        open={open2}
        onClose={handleClose2}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem
          onClick={() => {
            dispatch(addReport({ reportData: group, reportType: REPORT_TYPES.PROFILE }))
            dispatch(openModalReport())
            handleClose2()
          }}
          sx={{ gap: '5px' }}>
          <IconMessageReport /> Report
        </MenuItem>

      </Menu>
    </div>

    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="w-[600px] absolute left-1/2 top-1/2 bg-white
        -translate-x-1/2 -translate-y-1/2 rounded-lg">
        {/* <form > */}
        <form onSubmit={handleSubmit(sendInvitesFriend)} >
          <div className='flex flex-col'>
            <div className='h-[60px] flex justify-between items-center px-2 border-b '>
              <span></span>
              <span className='text-xl font-bold'>Invite your friends</span>
              <IconX
                onClick={handleClose}
                className='bg-orangeFpt text-white rounded-full  cursor-pointer hover:bg-orange-700' />
            </div>

            <div className='md:max-h-[350px] flex overflow-y-auto scrollbar-none-track'>
              <div className='flex items-center h-[40] py-2 gap-2 basis-8/12'>
                <div className='flex flex-col gap-2 w-full px-2'>
                  {/* <div className="relative text-gray-600" >
                    <input className="w-full bg-fbWhite h-10 px-5 pr-16 rounded-xl text-sm font-light focus:outline-none"
                      type="search" placeholder="Search friend" />
                    <span className='absolute right-2 top-1/2 -translate-y-1/2'><IconSearch /></span>
                  </div> */}
                  <Controller
                    name="inviteFriends"
                    control={control}
                    defaultValue={[]}
                    render={({ field: { value, onChange } }) => (
                      <Box>
                        {listFriend.map((e) => (
                          <FormControlLabel
                            className=' hover:bg-fbWhite p-1 rounded-lg'
                            key={e?.userId}
                            control={
                              <Checkbox
                                checked={value.some(friend => friend.userId === e.userId)}
                                onChange={(event) => {
                                  if (event.target.checked) {
                                    onChange([...value, e])
                                  } else {
                                    onChange(value.filter((friend) => friend.userId !== e.userId))
                                  }
                                }}
                              />
                            }
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              width: '100%',
                              margin: '0'
                            }}
                            label={
                              <div className="flex items-center gap-2">
                                <UserAvatar avatarSrc={e?.avata} isOther={true} />
                                <span className='capitalize font-semibold'>{e?.userName}</span>
                              </div>
                            }
                            labelPlacement="start"
                          />
                        ))}
                      </Box>
                    )}
                  />
                </div>
              </div>
              <div className='basis-4/12 bg-fbWhite flex flex-col w-full gap-2'>
                <span className='p-2 text-sm font-semibold'>{watch('inviteFriends')?.length ?? 0} friend selected</span>
                {
                  watch('inviteFriends')?.map(friend => (
                    <div key={friend?.userId} className="flex items-center justify-between gap-2 px-2">
                      <div className="flex items-center gap-2">
                        <UserAvatar avatarSrc={friend?.avata} isOther={true} />
                        <span className='capitalize'>{friend?.userName}</span>
                      </div>
                      <IconX
                        className='text-white size-5 rounded-full cursor-pointer bg-orangeFpt hover:bg-orange-700'
                        onClick={() => setValue('inviteFriends', getValues('inviteFriends')?.filter(e => e.userId !== friend?.userId))}
                      />
                    </div>
                  ))
                }
              </div>
            </div>

            <div className='h-[60px] px-4 flex justify-end items-center gap-2 border-t'>
              <Button variant="contained" color='inherit' onClick={handleClose}>Cancel</Button>
              <Button type='submit' variant="contained" color='warning' className="interceptor-loading">Send invites</Button>
            </div>
          </div >
        </form >
      </div>
    </Modal>
  </div>
}

export default HeaderButton
