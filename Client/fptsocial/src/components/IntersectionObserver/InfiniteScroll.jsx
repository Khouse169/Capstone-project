import { useEffect, useRef } from 'react'
import PageLoadingSpinner from '../Loading/PageLoadingSpinner'
import { IconMoodSurprised } from '@tabler/icons-react'

const InfiniteScroll = ({
  children,
  fetchMore,
  hasMore,
  endMessage,
  className
}) => {
  const pageEndRef = useRef(null)
  useEffect(() => {
    if (hasMore) {
      const observer = new IntersectionObserver((entries) => {
        // console.log(entries[0].isIntersecting);
        if (entries[0].isIntersecting) {
          hasMore && fetchMore()
        }
      })
      if (pageEndRef.current) {
        observer.observe(pageEndRef.current)
      }
      return () => {
        if (pageEndRef.current) {
          observer.unobserve(pageEndRef.current)
        }
      }
    }
  }, [hasMore])

  return (
    <div className='flex flex-col w-full items-center'>
      <div className={className}>
        {children}
      </div>
      <div ref={pageEndRef} className='my-4 flex justify-center'>
        {hasMore ? <div className=''><PageLoadingSpinner /></div>
          : <div className='font-semibold text-orangeFpt flex '>
            {endMessage}
          </div>
        }
      </div>
    </div>
  )
}

export default InfiniteScroll

