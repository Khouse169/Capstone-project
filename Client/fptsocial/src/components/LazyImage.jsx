import { useEffect, useRef, useState } from 'react'

const LazyImage = ({
  placeholderSrc,
  placeholderClassName,
  placeholderStyle,
  dataSrc,
  alt,
  className,
  style
}) => {
  const [isLoading, setIsLoading] = useState(true)
  const [view, setView] = useState('')
  const placeholderRef = useRef()

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      console.log(entries[0].isIntersecting)
      // console.log('🚀 ~ placeholderRef:', placeholderRef)

      if (entries[0].isIntersecting) {
        setView(dataSrc)
        // observer.unobserve(placeholderRef.current)
      }
    })

    if (placeholderRef && placeholderRef.current) {
      observer.observe(placeholderRef.current)
    }
  }, [dataSrc])

  return (
    <>
      {/* {isLoading && (
        <img
          src={placeholderSrc}
          alt=""
          className={placeholderClassName}
          style={placeholderStyle}
          ref={placeholderRef}
        />
      )} */}
      <img
        ref={placeholderRef}
        src={view}
        className={className}
        style={style}
        alt={alt}
      // onLoad={() => setIsLoading(false)}
      />
    </>
  )
}

export default LazyImage