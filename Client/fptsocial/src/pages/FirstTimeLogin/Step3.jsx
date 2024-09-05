import { useConfirm } from 'material-ui-confirm'
import { toast } from 'react-toastify'
import { uploadImage } from '~/apis'
import { handleCoverImg } from '~/utils/formatters'
import { singleFileValidator } from '~/utils/validators'

function Step3({ register, setValue, getValues, watch }) {
  // console.log(handleCoverImg(watch('coverImage')));

  const confirmFile = useConfirm()

  const handleUploadFile = (e, type) => {
    const fileData = new FormData()
    const file = e.target.files[0]
    const error = singleFileValidator(file)
    if (error) {
      toast.error(error)
      return
    }
    fileData.append('file', file)
    const url = URL.createObjectURL(file)
    confirmFile({
      title: (<div>Confirm using this file?<img src={url} /></div>),
      description: ('Are you sure you want to add this file? This file will be add into cloud if you click Confirm and cannot undo? '),
      confirmationText: 'Confirm',
      cancellationText: 'Cancel'
    }).then(() => {
      uploadImage({ userId: null, data: fileData }).then(data => setValue(type == 'avatar' ? 'avataphoto' : 'coverImage', data?.url))
    }).catch(() => { })
    e.target.value = ''
  }

  return (
    <div className='flex flex-col h-full'>
      <div className='h-[50px] flex items-center px-5 border-b '>
        <span className='text-xl font-bold'>Avatar & cover</span>
      </div>
      <div className='px-4 pb-10 text-md font-semibold font-semibold' >
        <div className='grid grid-cols-12 gap-x-5 py-4'>
          <div className='col-span-12 xl:col-span-4 flex flex-col'>
            <div className='flex justify-between items-center '>
              <span className='text-xl font-bold'>Avatar</span>
              <input type='file' id='avataphoto' className='hidden' accept="image/*"
                onChange={(e) => handleUploadFile(e, 'avatar')}
              />
              <input type='text' className='hidden' {...register('avataphoto')} />
              <label htmlFor='avataphoto' className='text-white px-4 py-2 rounded-md cursor-pointer bg-blue-500 hover:bg-blue-700'>Upload file</label>
            </div>
            <div className='flex justify-center items-center pt-2'>
              <div className='w-[8rem] xl:w-[10rem] bg-white rounded-[50%] aspect-square flex justify-center items-center'>
                <img
                  id="holderAvatar"
                  src={watch('avataphoto')}
                  className="rounded-[50%] aspect-square object-cover w-[95%]"
                />
              </div>
            </div>
          </div>

          <div className='col-span-12 xl:col-span-8 flex flex-col '>
            <div className='flex justify-between items-center '>
              <span className='text-xl font-bold'>Cover </span>
              <input type='file' id='coverImage' className='hidden' accept="image/*"
                onChange={(e) => handleUploadFile(e, 'cover')} />

              <input type='text' className='hidden' {...register('coverImage')} />
              <label htmlFor='coverImage' className='text-white px-4 py-2 rounded-md cursor-pointer bg-blue-500 hover:bg-blue-700'>Upload file</label>
            </div>
            <div className='flex justify-center items-center pt-2'>
              <div id='holderCover'
                className="w-full lg:w-[940px] aspect-[74/27] rounded-md object-contain"
                style={handleCoverImg(watch('coverImage'))}
              >
                {/* <img
                  id="holderAvatar"
                  src={watch('coverImage')}
                  className="w-full lg:w-[940px] aspect-[74/27] rounded-md object-cover"
                /> */}
              </div>
            </div>
          </div>

        </div>
      </div >
    </div >
  )
}

export default Step3
