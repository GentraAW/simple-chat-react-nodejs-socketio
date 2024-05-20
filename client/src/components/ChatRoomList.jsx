import React from "react";

const ChatRoomList = ({
  rooms,
  currentRoom,
  switchRoom,
  newChatUser,
  setNewChatUser,
  startNewChat,
}) => {
  return (
    <div className="rooms-container w-96 mb-4">
      <h2 className="text-xl font-bold mb-2">Rooms</h2>
      <div className="rooms-list bg-white p-2 border border-gray-300 rounded shadow-md max-h-48 overflow-y-auto">
        {Object.keys(rooms).map((room) => (
          <div
            key={room}
            className={`room-item flex justify-between items-center p-2 cursor-pointer ${
              room === currentRoom ? "bg-blue-100" : ""
            }`}
            onClick={() => switchRoom(room)}
          >
            <span>{room}</span>
            {rooms[room].unreadCount > 0 && (
              <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs">
                {rooms[room].unreadCount}
              </span>
            )}
          </div>
        ))}
      </div>
      <div className="new-chat-container mt-4">
        <input
          type="text"
          placeholder="Masukkan username untuk chat baru"
          value={newChatUser}
          onChange={(e) => setNewChatUser(e.target.value)}
          className="py-1 px-2 rounded border border-gray-300 mr-2"
        />
        <button
          onClick={startNewChat}
          className="py-1 px-4 rounded bg-green-500 text-white"
        >
          Tambah Obrolan
        </button>
      </div>
    </div>
  );
};

export default ChatRoomList;
