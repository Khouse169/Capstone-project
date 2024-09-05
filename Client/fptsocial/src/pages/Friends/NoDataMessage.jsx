import contactImg from '~/assets/img/contactChat.png'

function NoDataMessage({ message }) {
  return <div className='flex justify-center'>
    <div className='flex flex-col items-center gap-2'>
      <img src={contactImg} className='size-20' />
      <p className='text-lg text-gray-500/90'>{message}</p>
    </div>
  </div>
}

export default NoDataMessage