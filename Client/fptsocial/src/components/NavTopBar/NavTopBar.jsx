import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import LeftTopBar from './NavTopBarItems/LeftTopBar'
import RightTopBar from './NavTopBarItems/RightTopBar/RightTopBar'
import connectionSignalR from '~/utils/signalRConnection'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { addLatestNotification } from '~/redux/notification/notificationSlice'

function NavTopBar() {
  // const newNotification = useSelector(selectLatestNotification)
  // const newNotification = useSelector(selectLatestNotification)
  const dispatch = useDispatch()

  useEffect(() => {
    const connect = async () => {
      if (connectionSignalR.state === 'Disconnected') {
        console.log('🚀 ~ connect ~ connectionSignalR.state:', connectionSignalR.state)
        try {
          await connectionSignalR.start()
          console.log('SignalR connect successfully')
          connectionSignalR.on('ReceiveNotification', message => {
            // console.log('mes', message)
            if (!message.includes('connected success!'))
              toast.info('You have a new notification', { position: 'top-right' })
            connectionSignalR.on('listReceiveNotification', message => {
              // console.log('mes lis', message, Object.keys(JSON.parse(message)).length) 
              dispatch(addLatestNotification(JSON.parse(message)))
            })
          })
          connectionSignalR.on('listReceiveNotification', message => {
            // console.log('mes lis', message, Object.keys(JSON.parse(message)).length)
            dispatch(addLatestNotification(JSON.parse(message)))
          })
        } catch (err) {
          console.error(err.toString())
        }
      }

    }
    connect()
    // return () => {
    //   const disConnect = async () => {
    //     try {
    //       // connectionSignalR.off('ReceiveNotification')
    //       await connectionSignalR.stop()
    //       console.log('SignalR disconnect successfully')
    //     } catch (err) {
    //       console.error(err.toString())
    //     }
    //   }
    //   disConnect()
    // }
  }, [])

  // useEffect(() => {
  //   // newNotification && toast.success('You have a new notification')
  // }, [newNotification])

  return (
    <>
      {/* <div className="fixed top-0 h-[55px] w-full flex items-center
      custom-gradient
      border-b shadow-sm z-50"> */}
      <div className="fixed top-0 h-[55px] w-full flex items-center
      bg-white
      border-b shadow-md z-50">
        <div
          className="mx-3 flex w-full justify-evenly xs:justify-between items-center">
          <LeftTopBar />
          <RightTopBar />
        </div>
      </div>
      <div className="h-[55px]" />
    </>
  )
}

export default NavTopBar