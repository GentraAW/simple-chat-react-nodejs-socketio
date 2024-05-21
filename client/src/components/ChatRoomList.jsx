import React from "react";

const ChatRoomList = ({
  rooms,
  currentRoom,
  switchRoom,
  newChatUser,
  setNewChatUser,
  startNewChat,
  handleKeyPressChat,
}) => {
  return (
    <div className="mobile:w-52 laptop:w-[30rem] dekstop:w-full bg-white h-[53rem] rounded-tl-xl rounded-bl-xl rounded border-r-4">
      <div className="pb-1 border-b border-gray-200 mobile:text-xs tablet:text-[15px]">
        <h2 className="pt-2 ml-2 font-bold ">Chats</h2>
        <div className="flex p-2">
          <input
            type="text"
            placeholder="Username"
            value={newChatUser}
            onChange={(e) => setNewChatUser(e.target.value)}
            onKeyDown={handleKeyPressChat}
            className="w-full px-2 mr-2 font-light border border-gray-300 rounded-md hover:border-blue-500 focus:ring-black focus:outline-none"
          />
          <button
            onClick={startNewChat}
            className="w-32 p-2 text-white rounded-md mobile:text-xs laptop:text-sm custom-gradient"
          >
            Add Chat
          </button>
        </div>
      </div>
      {Object.keys(rooms).map((room) => (
        <div
          key={room}
          className={`flex items-center cursor-pointer border-b border-gray-200 ${
            room === currentRoom ? "bg-slate-200 " : ""
          }`}
          onClick={() => switchRoom(room)}
        >
          <div className="flex items-center justify-center w-8 h-8 mx-2 my-4 text-white bg-purple-600 rounded-full logo">
            {room.charAt(0).toUpperCase()}
          </div>
          <span className="font-semibold">{room}</span>
          {rooms[room].unreadCount > 0 && (
            <span className="px-2 ml-1 text-xs text-white bg-red-500 rounded-full ">
              {rooms[room].unreadCount}
            </span>
          )}
        </div>
      ))}
    </div>
  );
};

export default ChatRoomList;
