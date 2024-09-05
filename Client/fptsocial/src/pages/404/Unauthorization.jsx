import { IconLockFilled } from '@tabler/icons-react';
import { Link } from 'react-router-dom';

function Unauthorization() {
  return <section className="bg-white h-screen dark:bg-gray-900">
    <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6 ">
      <div className="mx-auto max-w-screen-sm text-center">
        <h1 className="mb-4  text-blue-500 flex justify-center"><IconLockFilled className='size-32' /></h1>
        <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl">Access Denied</p>
        <p className="mb-4 text-lg text-gray-500">You do not have the necessary permissions to view this page. Please ensure that you are logged in with the correct account and have the appropriate access rights.</p>
        <Link to={'/homepage'} className="inline-flex text-white bg-blue-500 hover:bg-blue-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center my-4">Back to Homepage</Link>
      </div>
    </div>
  </section>
}

export default Unauthorization;
