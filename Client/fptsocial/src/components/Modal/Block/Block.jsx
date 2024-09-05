// import React from 'react'
import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { IconX } from '@tabler/icons-react'
import { triggerReload } from '~/redux/ui/uiSlice'
import { Button, Modal } from '@mui/material'
import { clearBlock, selectBlockData, selectIsOpenBlock } from '~/redux/block/blockSlice'
import { blockUser } from '~/apis'
import { useNavigate } from 'react-router-dom'


function Block() {
  const currentUser = useSelector(selectCurrentUser)
  const blockData = useSelector(selectBlockData)
  const dispatch = useDispatch()
  const isOpenModalBlock = useSelector(selectIsOpenBlock)
  console.log('🚀 ~ Block ~ isOpenModalBlock:', isOpenModalBlock)

  useEffect(() => {
  }, [])
  const navigate = useNavigate()
  const handleBlock = () => {
    let submitData = {
      "userId": currentUser?.userId,
      "blockUserId": blockData?.userId
    }
    toast.promise(
      blockUser(submitData),
      {
        pending: 'Processing...',
        success: 'Blocked!'
      }
    ).then(() => {
      dispatch(clearBlock())
      navigate('/homepage')
    })
  }
  return (


    <Modal
      open={isOpenModalBlock}
      onClose={() => dispatch(clearBlock())}
    >
      <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
        <div className='w-full xs:w-[420px] md:w-[500px] bg-white shadow-4edges rounded-lg '>
          <div className='h-[60px] py-2 px-3 font-bold flex justify-between items-center border-b text-xl'>
            <span></span>
            <span className='font-bold font-sans text-lg capitalize text-orangeFpt'>
              Block {blockData?.firstName + ' ' + blockData?.lastName}
            </span>
            <div className='cursor-pointer' onClick={() => dispatch(clearBlock())}>
              <IconX className='text-white bg-orangeFpt rounded-full' />
            </div>
          </div>
          <div className='flex flex-col gap-1 py-2 px-2 border-b font-light'>
            <span className='first-letter:capitalize font-normal'>{blockData?.firstName} will not be able to:</span>
            <ul>
              <li>- View posts on your timeline</li>
              <li>- Tag you</li>
              <li>- Invite you to join an event or group</li>
              <li>- Message for you</li>
              <li>- Add you as a friend</li>
            </ul>
            <span className='font-normal'>If you are friends, blocking {blockData?.firstName} will also unfriend.</span>
          </div>
          <div className='flex gap-2 justify-end px-3 py-1'>
            <Button>Cancel</Button>
            <Button variant='contained' size='small' color='warning' onClick={handleBlock}>Confirm</Button>
          </div>
        </div >
      </div >
    </Modal>

  )
}

export default Block