import { useEffect, useRef, useState } from 'react'
import { uploadImage, uploadVideo } from '~/apis'
import { singleFileValidator } from '~/utils/validators'
import { toast } from 'react-toastify'
import PageLoadingSpinner from '../Loading/PageLoadingSpinner'
import { IconFilePlus, IconMoodHappy, IconPhotoPlus, IconPhotoUp, IconSend2, IconX } from '@tabler/icons-react'
import { useConfirm } from 'material-ui-confirm'
import { useTranslation } from 'react-i18next'
import EmojiPicker from 'emoji-picker-react'

const TipTapMes = ({ setContent, content, listMedia, setListMedia, sendMessage }) => {
  const [isOpenEmoji, setIsOpenEmoji] = useState(false)
  const isEmptyComment = (content.trim().length === 0 && listMedia?.length === 0)
  const [isChoseFile, setIsChoseFile] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const confirmFile = useConfirm()
  const { t } = useTranslation()
  const emojiPickerRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setIsOpenEmoji(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  const handleOpenChoseFile = () => setIsChoseFile(!isChoseFile)

  const handleImageUpload = async (event) => {
    const files = Array.from(event.target.files)
    for (const file of files) {
      const error = singleFileValidator(file)
      if (error) {
        toast.error(error)
        return
      }
    }
    try {
      await confirmFile({
        title: (
          <div>Confirm using this file?
            {files.map((file, index) => (
              file.type.includes('image')
                ? <img key={index} src={URL.createObjectURL(file)} alt={`Preview ${index}`} />
                : <video key={index} src={URL.createObjectURL(file)} controls />
            ))}
          </div>
        ),
        description: 'Are you sure you want to add this file? This file will be added to the cloud if you click Confirm and cannot undo.',
        confirmationText: 'Confirm',
        cancellationText: 'Cancel'
      })
      setIsLoading((pre) => true)

      for (const file of files) {
        const formData = new FormData()
        formData.append('file', file)
        const type = file.type.includes('image') ? 'image' : 'video'
        const data = type === 'image'
          ? await uploadImage({ userId: null, data: formData })
          : await uploadVideo({ userId: null, data: formData })

        setListMedia(prev => [...prev, { url: data.url, type, position: prev?.length || 0 }])
      }
    } catch (error) {
      // Handle cancel or error
    } finally {
      setIsLoading(false)
      event.target.value = ''
    }
  }

  const handleRemoveCurrentContent = () => setContent('')

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (!isEmptyComment) {
        sendMessage()
        handleRemoveCurrentContent()
        setIsChoseFile(false)
      }
    }
  }

  const handleSendMessage = () => {
    if (!isEmptyComment) {
      sendMessage()
      handleRemoveCurrentContent()
      setIsChoseFile(false)
    }
  }

  return (
    <div className="w-full px-3">
      <div className='max-h-72 overflow-y-auto scrollbar-none-track'>
        {(isChoseFile || listMedia?.length > 0) && (
          <div className={`relative border border-gray-300/90 rounded-2xl mb-2 overflow-hidden `}>
            {listMedia?.length === 0 && !isLoading && (
              <div
                className='w-full h-12 flex flex-col items-center justify-center text-base font-semibold bg-fbWhite cursor-pointer '
                onClick={() => document.getElementById('fileInput').click()}
              >
                <IconPhotoPlus />
                <span className='text-xs'>{t('standard.newPost.addPhoto')}</span>
              </div>
            )}
            {
              (listMedia?.length > 0 || isLoading) &&
              <div
                id="media"
                className='p-2 flex gap-2 items-center min-h-20'
              >
                {(listMedia.length !== 0) && (
                  <div
                    className='p-3 cursor-pointer hover:bg-orangeFpt hover:text-white rounded-md'
                    onClick={() => { document.getElementById('fileInput').click() }}
                  >
                    <IconFilePlus />
                  </div>
                )}
                <div className='flex gap-2 flex-wrap w-full'>
                  {listMedia?.map((media, index) => (
                    <div key={index} className="relative w-1/5 min-h-10">
                      <div className='absolute -top-1 -right-1 size-6 z-60 bg-white p-1 rounded-full flex justify-center items-center hover:bg-orangeFpt hover:text-white cursor-pointer'
                        onClick={() => setListMedia(prevList => prevList.filter((_, i) => i !== index))}
                      >
                        <IconX />
                      </div>
                      {media.type === 'image' ? (
                        <img
                          src={media.url}
                          className="object-cover w-full h-full"
                          alt={`Media ${index}`}
                        />
                      ) : (
                        <video
                          src={media.url}
                          className="object-cover w-full h-full"
                          controls
                          disablePictureInPicture
                        />
                      )}
                    </div>
                  ))}
                  {isLoading && <div className='w-fit h-10'><PageLoadingSpinner /></div>}
                </div>
              </div>
            }
          </div>
        )}
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t('standard.newPost.writeSt')}
          className="w-full px-3  text-base rounded-md outline-none resize-none bg-transparent border-none focus:ring-0 min-h-[40px] max-h-[120px] overflow-y-auto scrollbar-none-track"
          style={{
            boxShadow: 'none',
            transition: 'all 0.3s ease',
          }}
        />
      </div>

      <input
        type="file"
        id="fileInput"
        multiple
        className='hidden'
        accept="image/*,video/*"
        onChange={handleImageUpload}
      />

      <div
        className="px-4 pb-1 rounded-3xl flex w-full bg-fbWhite"
      >
        <div className='flex justify-start items-center gap-3 w-full flex-wrap'>
          <button
            type="button"
            onClick={handleOpenChoseFile}
            className={`text-orange-300 hover:text-orangeFpt ${isChoseFile && '!text-orangeFpt'}`}
          >
            <IconPhotoUp className='size-7' />
          </button>
          <div
            className={
              isOpenEmoji
                ? 'text-orangeFpt cursor-pointer'
                : 'text-orange-300 hover:text-orangeFpt cursor-pointer'
            }
          >
            <IconMoodHappy className='size-7' onClick={() => setIsOpenEmoji(prev => !prev)} />
            <div ref={emojiPickerRef}>
              <EmojiPicker
                open={isOpenEmoji}
                lazyLoadEmojis={true}
                onEmojiClick={(emoji) => { setContent(prev => prev + emoji?.emoji) }}
                emojiStyle={'native'}
                searchDisabled={true}
                height={300}
                width={320}
                suggestedEmojisMode={'recent'}
                skinTonesDisabled={true}
                previewConfig={{
                  showPreview: false
                }}
                className='!absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 shadow-4edges'
              />
            </div>
          </div>
        </div>
        <div
          onClick={handleSendMessage}
          className='mr-2 interceptor-loading p-1 cursor-pointer'
        >
          <IconSend2 className={`text-orangeFpt rounded-full size-10  p-1 ${isEmptyComment ? 'opacity-50 pointer-events-none' : 'hover:bg-orangeFpt hover:text-white'}`} stroke={2} />
        </div>
      </div>
    </div>
  )
}

export default TipTapMes