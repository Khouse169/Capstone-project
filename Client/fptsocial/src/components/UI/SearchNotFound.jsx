import NotFound from '~/assets/img/not_found.png'

function SearchNotFound({ isNoneData = false }) {
  return <div className=' flex flex-col justify-center items-center'>
    <img src={NotFound} className='size-20' />
    <div className=' capitalize text-center text-gray-500 leading-relaxed'>
      {
        isNoneData ? <>  <p className='font-bold'>Không có dữ liệu</p> </>
          : <>
            <p className='font-bold'>Chúng tôi không tìm thấy kết quả nào</p>
            <p className='font-light'>Đảm bảo tất cả các từ đều đúng chính tả hoặc thử từ khóa khác.</p>
          </>

      }

    </div>
  </div>
}

export default SearchNotFound
