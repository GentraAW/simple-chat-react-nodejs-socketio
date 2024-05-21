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
    <div className="overflow-hidden h-[53rem] mobile:w-[22rem] tablet:w-[42rem] laptop:w-[85rem] rounded-tr-xl rounded-br-xl flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between p-2 text-white custom-gradient mobile:text-xs tablet:text-[15px]">
          <div>
            Chat with : <strong>{currentRoom || "??"}</strong>
          </div>
          <button
            onClick={handleExit}
            className="px-4 py-1 text-white bg-transparent rounded shadow-xl hover:bg-red-500"
          >
            X
          </button>
        </div>
        <div className="p-4 overflow-y-auto max-h-[45.8rem]">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`py-2 px-3 rounded-md mb-2 w-fit bg-white ${
                message.from === "Me" ? "p-2 rounded-md mb-2 bg-blue-300" : ""
              }`}
            >
              <span className="mr-2 font-bold username">{message.from}:</span>
              {message.text}
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center p-3 bg-white mobile:text-xs tablet:text-[15px]">
        <input
          type="text"
          placeholder="Ketik pesan..."
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          onKeyDown={handleKeyPress}
          className="flex-1 px-2 py-1 font-light border border-gray-300 rounded-md hover:border-blue-500 focus:ring-black focus:outline-none"
        />
        <button
          onClick={sendMessage}
          className="px-4 py-1 ml-2 text-white rounded-md custom-gradient"
        >
          Kirim
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
