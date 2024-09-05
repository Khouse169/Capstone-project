import FPTUen from '~/assets/img/FPTUen.png'
import { IconArrowRight } from '@tabler/icons-react';
import { useAuth } from 'oidc-react';
import { toast } from 'react-toastify';


function Step0({ handleNext }) {

  const { signOutRedirect } = useAuth()

  const handleLogout = async () => {
    try {
      await signOutRedirect()
    } catch (error) {
      toast.error('Error during logout')
    }
  }

  return <div className='grid grid-cols-12 h-screen w-screen'>
    <div className='img-bg col-span-12 lg:col-span-8 min-h-[10rem]'></div>
    <div className='col-span-12 lg:col-span-4'>
      <div className='flex flex-col items-center gap-3 px-2 h-full'>
        <div className='flex flex-col items-center gap-2'>
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
        <div className='flex flex-col items-center justify-center gap-2 w-full h-full lg:mt-auto'>
          <span className='text-green-700 font-bold'>First time login ?</span>
          <div
            className='text-white bg-orangeFpt py-2 w-full xs:w-1/2 lg:w-full flex justify-center items-center rounded-md font-bold cursor-pointer'
            onClick={handleNext}
          ><span>Update your profile</span><IconArrowRight className='text-2xl' /></div>
        </div>
        <div onClick={handleLogout} className='flex flex-col items-center justify-center gap-2 w-full h-full lg:mt-auto cursor-pointer'>
          <span className='font-bold text-blue-600'>Log with another account?</span>
        </div>
      </div>
    </div>
  </div>
}

export default Step0;
