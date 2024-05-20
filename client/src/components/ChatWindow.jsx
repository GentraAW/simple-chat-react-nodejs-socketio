import React from "react";

const ChatWindow = ({
  currentRoom,
  handleExit,
  messages,
  messageInput,
  setMessageInput,
  sendMessage,
  handleKeyPress,
}) => {
  return (
    <div className="chat-container w-96 border border-gray-300 rounded overflow-hidden">
      <div className="chat-header bg-blue-500 text-white p-2 flex justify-between items-center">
        <div>Chat with: {currentRoom || "No one"}</div>
        <button
          onClick={handleExit}
          className="py-1 px-4 rounded bg-red-500 text-white"
        >
          Exit
        </button>
      </div>
      <div className="chat-messages max-h-48 overflow-y-auto p-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`message ${message.from === "Me" ? "my-message" : ""}`}
          >
            <span className="username font-bold mr-2">{message.from}:</span>
            {message.text}
          </div>
        ))}
      </div>
      <div className="chat-input flex items-center p-2 bg-gray-200">
        <input
          type="text"
          placeholder="Ketik pesan..."
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-1 py-1 px-2 rounded border border-gray-300"
        />
        <button
          onClick={sendMessage}
          className="ml-2 py-1 px-4 rounded bg-blue-500 text-white"
        >
          Kirim
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
