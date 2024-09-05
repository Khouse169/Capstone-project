function PageLoadingSpinner() {
  return (
    <div className="flex justify-center items-center h-full">
      <div className='rounded-full overflow-hidden'>
        <div className='size-16 border-4 rounded-full custom-border-gradient border-l-transparent animate-spin'></div>

      </div>
    </div>
  )
}
export default PageLoadingSpinner
