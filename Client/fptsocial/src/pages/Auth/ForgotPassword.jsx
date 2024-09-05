import { Button, Modal, TextField } from '@mui/material'
import { IconArrowRight, IconLogin2 } from '@tabler/icons-react'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { createAccount, resetPassword } from '~/apis'
import FPTUen from '~/assets/img/FPTUen.png'
import IconGoogle from '~/assets/svg/iconGoogle'
import CopyToClipBoard from '~/components/UI/CopyClipboard'
import { logoutCurrentUser, selectCurrentUser } from '~/redux/user/userSlice'
import { EMAIL_MESSAGE, EMAIL_RULE, FIELD_REQUIRED_MESSAGE, WHITESPACE_MESSAGE, WHITESPACE_RULE } from '~/utils/validators'

function ForgotPassword() {
  const { register, control, getValues, reset, setValue, watch, handleSubmit, trigger, formState: { errors, isValid } } = useForm()
  const currentUser = useSelector(selectCurrentUser)
  const dispatch = useDispatch()
  useEffect(() => {
    currentUser &&
      dispatch(logoutCurrentUser())
  }, [])

  const [open, setOpen] = useState(false)
  const [accountData, setAccountData] = useState(null)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const registerAccount = (data) => {
    const submitData = {
      "username": data?.email,
    }
    resetPassword(submitData).then(data => {
      reset()
      handleOpen()
      setAccountData(data)
    })
  }
  return (
    // <div className={`bg-gradient-to-r from-orange-100 to-orangeFpt ${''} w-screen h-screen flex flex-col items-center justify-center overflow-hidden`}>
    //   <div className='relative min-w-[16rem] min-h-[25rem] h-fit w-[80%] md:w-[70%] lg:w-[55%] bg-white rounded-2xl shadow-4edges '>
    <div className='grid grid-cols-12 h-screen'>
      <div className='img-bg col-span-12 lg:col-span-7 min-h-[10rem] '></div>
      <div className='col-span-12 lg:col-span-5 '>
        <div className='flex flex-col items-center gap-3 h-full custom-gradient p-4 '>
          <div className='flex flex-col items-center justify-center gap-2 w-full h-full lg:mt-auto rounded-lg bg-white'>
            <div className='flex flex-col items-center gap-1'>
              <div className='flex flex-col items-center gap-1'>
                <img
                  src={FPTUen}
                  alt="home-img"
                  className="w-[50%] "
                />
                <span className='font-bold text-2xl text-[rgb(242,113,36)] font-serif relative'>
                  Société Place
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 absolute -top-3 -right-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                  </svg>
                </span>
              </div>
              <span className='font-bold text-gray-600 text-xl mt-5'>
                Reset password
              </span>
            </div>
            <form className="flex flex-col h-full justify-between gap-4  p-2 rounded-lg" onSubmit={handleSubmit(registerAccount)}>
              <div className="flex flex-col justify-center h-full gap-4">
                <div className="">
                  <TextField
                    variant="standard"
                    label="Email"
                    color="primary"
                    focused
                    // defaultValue={group?.groupName}
                    fullWidth
                    {...register('email', {
                      required: FIELD_REQUIRED_MESSAGE,
                      pattern: {
                        value: EMAIL_RULE,
                        message: EMAIL_MESSAGE
                      }
                    })}
                    error={!!errors['email']}
                    helperText={errors['email']?.message}
                  />
                </div>
              </div>

              <div className="">
                <Button className='interceptor-loading w-full' variant="contained" color='primary' type='submit'>
                  Reset Password
                </Button>
              </div>
            </form>
            <div
              className=' py-2 w-full xs:w-1/2 lg:w-full flex justify-center items-center rounded-md '
            >
              <span className='text-gray-600 font-semibold'>Already have an account?</span>
              <Link to={'/login'} className='text-blue-500 font-bold cursor-pointer hover:bg-fbWhite px-1 rounded-md' >&nbsp;Sign in</Link>
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-md '>
          <span className='flex justify-center text-lg font-bold bg-orangeFpt text-white rounded-t-md py-2'>Password Reset Requested</span>
          <div className='flex flex-col py-2 px-3'>
            <div className='flex flex-col gap-2 mt-2 font-semibold '>
              <div className=' '>
                <span>We&apos;ve sent a password reset link to</span>
                <span className='text-orangeFpt/90 mx-1'>{accountData?.username}</span>
              </div>
            </div>
            <div className='bg-blue-50 border-l-4 border-blue-500 text-blue-700 p-4 mb-4 text-xs mt-2'>
              <p className='font-bold'>Important:</p>
              <p>Make sure to check your spam folder if you don&apos;t see the email in your inbox.</p>
            </div>
            <div
              className=' py-2 w-full xs:w-1/2 lg:w-full flex  items-center rounded-md '
            >
              <span className='text-gray-600 font-semibold basis-1/2'>Did you receive?</span>
              <Link to={'/'} className='text-[#1976d2] text-lg font-bold cursor-pointer hover:bg-fbWhite px-1 rounded-md ' >&nbsp;Sign In</Link>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default ForgotPassword