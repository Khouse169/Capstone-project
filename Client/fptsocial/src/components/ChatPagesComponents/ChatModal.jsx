import React, { useState } from "react";
import { Modal, Box, Typography, TextField, Button } from "@mui/material";
import { API_ROOT, CHAT_ENGINE_CONFIG_HEADER, CHAT_KEY, USER_ID } from "~/utils/constants";
import authorizedAxiosInstance from "~/utils/authorizeAxios";
import { ChatEngineWrapper, Socket } from "react-chat-engine";

const ChatModal = ({
  open,
  onClose,
  username,
  fullName,
  fetchChats,
}) => {
  const [message, setMessage] = useState("");
  const [chatId, setChatId] = useState(null);

  const handleSendMessage = async () => {
    try {
      let currentChatId = chatId;

      const createChatResponse = await authorizedAxiosInstance.post(
        `${API_ROOT}/api/Chat/createchatbox`,
        {
          otherId: username,
          title: "",
        }
      );
      currentChatId = createChatResponse.data.data.chatId;
      setChatId(currentChatId);

      await authorizedAxiosInstance.post(
        `https://api.chatengine.io/chats/${currentChatId}/messages/`,
        {
          text: message,
        },
        CHAT_ENGINE_CONFIG_HEADER
      );

      if (createChatResponse.data.data) {
        onClose();
        fetchChats();
      } else {
        console.error("Error sending message");
      }

      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleNewMessage = (chatId, message) => {
    fetchChats(); // Re-fetch chats when a new message is received
  };

  return (
    <ChatEngineWrapper>
      <Socket
        projectID={CHAT_KEY.ProjectID}
        userName={USER_ID}
        userSecret={USER_ID}
        onNewMessage={handleNewMessage}
      />
      <Modal open={open} onClose={onClose}>
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] bg-gray-100 rounded-lg p-4'>
          <Typography variant="h6">{fullName}</Typography>
          <TextField
            fullWidth
            multiline
            rows={4}
            placeholder="Type your message..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Button onClick={handleSendMessage}>Send</Button>
        </div>
      </Modal>
    </ChatEngineWrapper>
  );
};

export default ChatModal;