import { Link } from 'react-router-dom'
import { IconLockFilled } from '@tabler/icons-react'

function NotAvailable() {
  return <section className="bg-white h-screen dark:bg-gray-900">
    <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6 ">
      <div className="mx-auto max-w-screen-sm text-center">
        <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 text-blue-500 flex justify-center"><IconLockFilled /></h1>
        <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl">This content isn&apos;t available right now</p>
        <p className="mb-4 text-lg text-gray-500">When this happens, it&apos;s usually because the owner only shared it with a small group of people, changed who can see it or it&apos;s been deleted.</p>
        <Link to={'/homepage'} className="inline-flex text-white bg-blue-500 hover:bg-blue-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center my-4">Back to Homepage</Link>
      </div>
    </div>
  </section>
}

export default NotAvailable
