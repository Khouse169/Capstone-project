import { useState } from "react"
import { useParams } from 'react-router-dom';
import ChatWindow from "~/components/ChatPagesComponents/ChatWindow";
import Sidebar from "~/components/ChatPagesComponents/Sidebar";
import NavTopBar from '~/components/NavTopBar/NavTopBar';

function ChatPages() {
  const [allMessages, setAllMessages] = useState({})
  const [chats, setChats] = useState([])
  const { chatId } = useParams()

  const handleNewMessage = (chatId, message) => {
    setAllMessages((prevMessages) => ({
      ...prevMessages,
      [chatId]: [...(prevMessages[chatId] || []), message],
    }))
  }

  return (<>
    <NavTopBar />
    <div className='h-[calc(100vh_-_55px)] flex'>
      <Sidebar
        chatId={chatId}
        allMessages={allMessages}
        chats={chats}
        setChats={setChats}
      />
      <main className='grow flex flex-col h-full justify-between'
      >
        {chatId ? (
          <ChatWindow
            chatId={chatId}
            inChatPage
            onNewMessage={handleNewMessage}
            chats={chats}
          />
        ) : (
          <div className='flex justify-center items-center grow h-10'
          >
            <div >
              Select a chat to start messaging
            </div>
          </div>
        )}
      </main>
    </div>
  </>

  )
}

export default ChatPages
