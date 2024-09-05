import { useState, useEffect, useRef } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'
import NavTopBar from '~/components/NavTopBar/NavTopBar'
import { cleanAndParseHTML } from '~/utils/formatters'

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { role: 'model', parts: [{ text: 'Xin chào! Hãy hỏi tôi bất cứ điều gì bạn muốn hoặc chọn một câu hỏi gợi ý bên dưới :D' }] }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const chatRef = useRef(null)
  const chatInstanceRef = useRef(null)

  const API_KEY = 'AIzaSyBgoM0OOYUQ_i8oXpKWhdgsjz3TdQ0W6rA'
  const genAI = new GoogleGenerativeAI(API_KEY)
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
  const generationConfig = {
    temperature: 0.7,
    topK: 40,
    topP: 0.95,
    maxOutputTokens: 8192,
  }

  const suggestedQuestions = [
    "Giới thiệu cho tôi về dự án của nhóm G3_SEP490",
    "Thành viên nhóm dự án gồm nhưng ai? Thực hiện bao nhiêu ngày?",
    "Có bao nhiều Use case ? Bảng phân công công việc các thành viên như thế nào?",
    "Kiến trúc phần mềm ai làm và nó tên là gì mô tả giúp?",
    "Có thuật toán gì nổi trội không? Bạn đánh giá thế nào?",
    "Bạn đánh giá về thời gian và độ khó của đồ án, theo cấp độ sinh viên ngành CNTT bạn cho bao nhiêu điểm?"
  ]

  const ulStyle = {
    listStyleType: 'disc',
    listStylePosition: 'inside',
    marginLeft: '1em',
    marginBottom: '1em'
  }

  const liStyle = {
    marginBottom: '0.5em'
  }

  const convertToHtml = (text) => {
    const lines = text.split('\n')
    const result = []
    let listItems = []
    let inList = false

    const processInlineStyles = (line) => {
      return line.split(/(\*\*.*?\*\*)/).map((part, index) => {
        if (part.startsWith('**') && part.endsWith('**')) {
          return <strong key={index}>{part.slice(2, -2)}</strong>
        }
        return part
      })
    }

    lines.forEach((line, index) => {
      if (line.trim() === '') {
        if (inList) {
          result.push(<ul key={`ul-${index}`} style={ulStyle}>{listItems}</ul>)
          listItems = []
          inList = false
        }
        return
      }

      if (line.startsWith('* ')) {
        inList = true
        listItems.push(<li key={`li-${index}`} style={liStyle}>{processInlineStyles(line.slice(2))}</li>)
      } else {
        if (inList) {
          result.push(<ul key={`ul-${index}`} style={ulStyle}>{listItems}</ul>)
          listItems = []
          inList = false
        }

        if (line.endsWith(':')) {
          result.push(<h2 key={`h2-${index}`} className="text-xl font-bold mb-2">{processInlineStyles(line.slice(0, -1))}</h2>)
        } else {
          result.push(<p key={`p-${index}`} className="mb-2">{processInlineStyles(line)}</p>)
        }
      }
    })

    if (inList) {
      result.push(<ul key={`ul-last`} style={ulStyle}>{listItems}</ul>)
    }

    return result
  }

  useEffect(() => {
    const initChat = async () => {
      try {
        const file1 = await fetch('/src/assets/documents/report7.txt').then(res => res.text())
        const initialHistory = [
          {
            role: "user",
            parts: [
              { text: file1 },
            ],
          },
        ]

        chatInstanceRef.current = model.startChat({
          history: initialHistory,
          generationConfig
        })
      } catch (error) {
        console.error('Error initializing chat:', error)
      }
    }

    initChat()
  }, [])

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [messages])

  const handleSuggestedQuestionClick = (question) => {
    setInput(question)
    handleSubmit({ preventDefault: () => { } }, question)
  }

  const handleSubmit = async (e, suggestedQuestion = null) => {
    e.preventDefault()
    const questionToSend = suggestedQuestion || input
    if (!questionToSend.trim()) return
    const newUserMessage = { role: 'user', parts: [{ text: questionToSend }] }
    setMessages(prev => [...prev, newUserMessage])
    setInput('')
    setIsLoading(true)

    try {
      const result = await chatInstanceRef.current.sendMessage(questionToSend)
      const response = result.response
      const newModelMessage = { role: 'model', parts: [{ text: response.text() }] }
      setMessages(prev => [...prev, newModelMessage])
    } catch (error) {
      setMessages(prev => [...prev, { role: 'error', parts: [{ text: 'Đã xảy ra lỗi. Vui lòng thử lại.' }] }])
    }

    setIsLoading(false)
  }

  return (
    <>
      <NavTopBar />
      <div className="h-[calc(100vh_-_55px)] flex flex-col bg-gradient-to-b from-blue-100 to-purple-100">
        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-none-track" ref={chatRef}>
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-2xl shadow-md ${message.role === 'user'
                  ? 'bg-blue-500 text-white'
                  : message.role === 'error'
                    ? 'bg-red-500 text-white'
                    : 'bg-white text-gray-800'
                  }`}
              >
                <div className="text-sm md:text-base">{convertToHtml(message.parts[0].text)}</div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orangeFpt"></div>
            </div>
          )}
        </div>
        <div className="p-4 bg-white">
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestedQuestionClick(question)}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm hover:bg-blue-200 transition-colors duration-300"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
          <form onSubmit={handleSubmit} className="flex rounded-full overflow-hidden border-2 border-blue-300 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent transition duration-300">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 px-6 py-3 focus:outline-none text-gray-700"
              placeholder="Nhập tin nhắn của bạn..."
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-3 hover:bg-blue-600 transition-colors duration-300 focus:outline-none disabled:opacity-50"
              disabled={isLoading}
            >
              Gửi
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

export default Chatbot