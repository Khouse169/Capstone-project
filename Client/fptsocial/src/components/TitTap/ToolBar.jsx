// 'use client'
import { useState } from 'react'
import EmojiPicker from 'emoji-picker-react'
import { IconArrowBackUp, IconArrowForwardUp, IconBold, IconItalic, IconList, IconListNumbers, IconMoodHappy, IconPhotoUp, IconQuote, IconStrikethrough, IconUnderline } from '@tabler/icons-react'
import { EDITOR_TYPE } from '~/utils/constants'


const Toolbar = ({ editor, handleOpenChoseFile, postType, isChooseFile }) => {
  const [isOpenEmoji, setIsOpenEmoji] = useState(false)
  if (!editor) {
    return null
  }
  return (
    <div
      className="px-2 py-2 rounded-md flex w-full bg-fbWhite relative"
    >
      {
        postType !== EDITOR_TYPE.COMMENT ? (
          <div className='flex justify-start items-center gap-3 w-full flex-wrap '>
            <button
              type="button"
              onClick={() => {
                editor.chain().focus().toggleBold().run()
              }}
              className={
                editor.isActive('bold')
                  ? 'text-orangeFpt'
                  : 'text-orange-300 hover:text-orangeFpt'
              }
            >
              <IconBold className='w-5 h-5' />
            </button>
            <button
              type="button"
              onClick={() => {
                editor.chain().focus().toggleItalic().run()
              }}
              className={
                editor.isActive('italic')
                  ? 'text-orangeFpt'
                  : 'text-orange-300 hover:text-orangeFpt'
              }
            >
              <IconItalic className='w-5 h-5' />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={editor.isActive('strike')
                ? 'text-orangeFpt'
                : 'text-orange-300 hover:text-orangeFpt'
              }
            >
              <IconStrikethrough className='w-5 h-5' />
            </button>
            <button
              type="button"
              onClick={() => {
                editor.chain().focus().toggleUnderline().run()
              }}
              className={
                editor.isActive('underline')
                  ? 'text-orangeFpt'
                  : 'text-orange-300 hover:text-orangeFpt'
              }
            >
              <IconUnderline className='w-5 h-5' />
            </button>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={editor.isActive('bulletList')
                ? 'text-orangeFpt'
                : 'text-orange-300 hover:text-orangeFpt'
              }
            >
              <IconList className='w-5 h-5' />
            </button>
            <button
              type="button"
              onClick={() => {
                editor.chain().focus().toggleOrderedList().run()
              }}
              className={
                editor.isActive('orderedList')
                  ? 'text-orangeFpt'
                  : 'text-orange-300 hover:text-orangeFpt'
              }
            >
              <IconListNumbers className='w-5 h-5' />
            </button>

            <button
              type="button"
              onClick={handleOpenChoseFile}
              className={`text-orange-300 hover:text-orangeFpt ${isChooseFile && '!text-orangeFpt'}`}
            >
              <IconPhotoUp className='w-5 h-5' />
            </button>

            <div
              className={
                isOpenEmoji
                  ? 'text-orangeFpt cursor-pointer'
                  : 'text-orange-300 hover:text-orangeFpt cursor-pointer'
              }
            >
              <IconMoodHappy className='w-5 h-5' onClick={() => setIsOpenEmoji(!isOpenEmoji)} />
              <EmojiPicker
                open={isOpenEmoji}
                lazyLoadEmojis={true}
                onEmojiClick={(emoji) => {
                  // console.log(emoji)
                  editor?.commands.insertContent(emoji?.emoji)
                }}
                emojiStyle={'facebook'}
                searchDisabled={true}
                height={300}
                width={320}
                suggestedEmojisMode={'recent'}
                skinTonesDisabled={true}
                previewConfig={{
                  showPreview: false
                }}
                // autoFocusSearch={false}
                // allowExpandReactions={false}
                // reactionsDefaultOpen={true}
                className='!absolute bottom-10 shadow-4edges'
              />
            </div>
            <button
              type="button"
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={editor.isActive('blockquote')
                ? 'text-orangeFpt'
                : 'text-orange-300 hover:text-orangeFpt'
              }
            >
              <IconQuote className='w-5 h-5' />
            </button>
            <button
              type="button"
              onClick={() => {
                editor.chain().focus().undo().run()
              }}
              className={
                editor.isActive('undo')
                  ? 'text-orangeFpt'
                  : 'text-orange-300 hover:text-orangeFpt'
              }
            >
              <IconArrowBackUp className='w-5 h-5' />
            </button>
            <button
              type="button"
              onClick={() => {
                editor.chain().focus().redo().run()
              }}
              className={
                editor.isActive('redo')
                  ? 'text-orangeFpt'
                  : 'text-orange-300 hover:text-orangeFpt'
              }
            >
              <IconArrowForwardUp className='w-5 h-5' />
            </button>
          </div>
        )
          : (
            <div className='flex justify-start items-center gap-3 w-full flex-wrap'>
              <button
                type="button"
                onClick={handleOpenChoseFile}
                className={'text-orange-300 hover:text-orangeFpt'}
              >
                <IconPhotoUp className='w-5 h-5' />
              </button>

              <div
                className={
                  isOpenEmoji
                    ? 'text-orangeFpt cursor-pointer'
                    : 'text-orange-300 hover:text-orangeFpt cursor-pointer'
                }
              >
                <IconMoodHappy className='w-5 h-5' onClick={() => setIsOpenEmoji(!isOpenEmoji)} />
                <EmojiPicker
                  open={isOpenEmoji}
                  lazyLoadEmojis={true}
                  onEmojiClick={(emoji) => {
                    // console.log(emoji)
                    editor?.commands.insertContent(emoji?.emoji)
                  }}
                  emojiStyle={'facebook'}
                  searchDisabled={true}
                  height={300}
                  width={320}
                  suggestedEmojisMode={'recent'}
                  skinTonesDisabled={true}
                  previewConfig={{
                    showPreview: false
                  }}
                  // autoFocusSearch={false}
                  // allowExpandReactions={false}
                  // reactionsDefaultOpen={true}
                  className='!absolute shadow-4edges'
                />
              </div>
            </div>
          )
      }
    </div>
  )
}

export default Toolbar