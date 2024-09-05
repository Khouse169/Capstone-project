import { CHAT_ENGINE_CONFIG_HEADER, USER_ID } from "~/utils/constants"
import UserAvatar from '../UI/UserAvatar'
import { cleanAndParseHTML, compareDateTime } from '~/utils/formatters'

function ChatItem({ chat, handleListItemClick, handleSelectChat, inPageChat = false }) {
  const titleUser = chat?.people?.find(e => e?.person?.username != USER_ID)
  return (
    <div
      className='p-2 hover:bg-fbWhite rounded-md cursor-pointer interceptor-loading'
      key={chat?.id}
      onClick={() => (inPageChat ? handleSelectChat(chat?.id) : handleListItemClick(chat?.id))}
    >
      <div className='flex gap-2'>
        <div className='relative w-12'>
          <UserAvatar
            avatarSrc={titleUser?.person?.avatar}
            alt={chat?.fullName}
            sx={{ marginRight: 1 }}
          />
          {titleUser?.person?.is_online && (
            <div className='absolute bottom-0 right-0 size-3 border-2 border-white rounded-full bg-green-500'></div>
          )}
        </div>

        <div className='flex flex-col w-full'>
          <div className='flex flex-col'>
            <h3 className="font-semibold capitalize">
              {titleUser?.person?.first_name}
            </h3>
            <div className='text-xs flex justify-between'>
              <div className='text-xs flex gap-1'>
                {
                  chat?.last_message?.sender_username?.length > 0 ? <>
                    <span className='font-semibold capitalize'>
                      {chat?.last_message?.sender?.username == USER_ID ? 'You' : `${chat?.last_message?.sender?.first_name}`}:
                    </span>
                    <span className="text-gray-500/90 w-32 truncate">
                      {cleanAndParseHTML(chat?.last_message?.text)}
                      {chat?.last_message?.text?.length == 0 && 'send file'}
                    </span>
                  </>
                    : <span className='first-letter:capitalize text-gray-500/90'>let&apos;s chatting!</span>
                }
              </div>
              <span className='text-gray-500/90'>
                {chat?.last_message?.sender_username?.length > 0 && compareDateTime(chat?.last_message?.created)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChatItem