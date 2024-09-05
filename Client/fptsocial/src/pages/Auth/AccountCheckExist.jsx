import { useAuth } from 'oidc-react'
import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { checkUserExist } from '~/apis'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import { addUser, getUserByUserId } from '~/redux/user/userSlice'
import { JWT_PROFILE } from '~/utils/constants'

function AccountCheckExist() {

  const { signOutRedirect } = useAuth()

  const handleLogout = async () => {
    try {
      await signOutRedirect()
    } catch (error) {
      toast.error('Error during logout')
    }
  }

  const profileFeId = JWT_PROFILE
  const dispatch = useDispatch()
  const navigate = useNavigate()
  useEffect(() => {
    checkUserExist().then((resData) => {
      if (resData?.data?.enumcode === 4) {
        if (!resData?.data?.isAdmin)
          navigate('/firstlogin')
        else if (resData?.data?.isAdmin)
          navigate('/updateadmin')
      }
      else if (resData?.data?.enumcode === 7) {
        if (resData?.data?.isAdmin) {
          dispatch(addUser(profileFeId))
          navigate('/dashboard')
        }
        else {
          toast.promise(
            dispatch(getUserByUserId()),
            {
              pending: 'Checking...',
              success: 'Success!',
            },
          )
            .then(res => {
              if (!res.error) {
                navigate('/')
                toast.success('Welcome to FPT Social!')
              }
            })
        }
      }
    }).catch((error) => {
      if (error?.response?.data?.statusCode == 'U06')
        handleLogout()
    })
  }, [])
  return (
    <div className='w-screen h-screen flex items-center justify-center'>
      <PageLoadingSpinner />
    </div>
  )

}

export default AccountCheckExist
