import { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:5000");

function App() {
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [exited, setExited] = useState(false);
  const [newChatUser, setNewChatUser] = useState("");
  const [rooms, setRooms] = useState({});
  const [currentRoom, setCurrentRoom] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    if (username.trim() !== "") {
      setIsLoggedIn(true);
      socket.emit("newuser", username);
    }
  };

  const handleExit = () => {
    socket.emit("exituser", username);
    setExited(true);
    window.close();
  };

  useEffect(() => {
    if (isLoggedIn) {
      socket.on("update", (data) => {
        // Filter out "joined" and "left" messages
        if (!data.includes("joined chat") && !data.includes("left chat")) {
          setMessages((prevMessages) => [
            ...prevMessages,
            { username: "System", text: data },
          ]);
        }
      });

      socket.on("chat", (data) => {
        if (data.to === username || data.from === username) {
          const room = data.from === username ? data.to : data.from;
          setRooms((prevRooms) => {
            const unreadCount = prevRooms[room]?.unreadCount || 0;
            return {
              ...prevRooms,
              [room]: {
                messages: [...(prevRooms[room]?.messages || []), data],
                unreadCount: currentRoom === room ? 0 : unreadCount + 1,
              },
            };
          });

          if (currentRoom === room) {
            setMessages((prevMessages) => [...prevMessages, data]);
          }

          if (data.to === username) {
            alert(`New message received from ${data.from}`);
          }
        }
      });

      return () => {
        socket.emit("exituser", username);
        socket.off("chat");
        socket.off("update");
      };
    }
  }, [isLoggedIn, username, currentRoom]);

  const sendMessage = () => {
    if (messageInput.trim() !== "") {
      const message = { from: username, to: currentRoom, text: messageInput };
      socket.emit("chat", message);
      setMessageInput("");
      setMessages((prevMessages) => [
        ...prevMessages,
        { ...message, from: "Me" },
      ]);
      setRooms((prevRooms) => {
        return {
          ...prevRooms,
          [currentRoom]: {
            ...prevRooms[currentRoom],
            messages: [...(prevRooms[currentRoom]?.messages || []), message],
          },
        };
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const startNewChat = () => {
    if (newChatUser.trim() !== "" && newChatUser !== username) {
      setCurrentRoom(newChatUser);
      setMessages(rooms[newChatUser]?.messages || []);
      setRooms((prevRooms) => ({
        ...prevRooms,
        [newChatUser]: { messages: [], unreadCount: 0 },
      }));
    }
  };

  const switchRoom = (room) => {
    setCurrentRoom(room);
    setMessages(rooms[room].messages);
    setRooms((prevRooms) => ({
      ...prevRooms,
      [room]: { ...prevRooms[room], unreadCount: 0 },
    }));
  };

  if (!isLoggedIn) {
    return (
      <div className="app bg-gray-100 min-h-screen flex justify-center items-center">
        <div className="login-container w-96 p-6 bg-white rounded shadow-md">
          <h2 className="text-2xl font-bold mb-4">Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Masukkan username Anda"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded mb-4"
            />
            <button
              type="submit"
              className="w-full py-2 px-4 rounded bg-blue-500 text-white"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (exited) {
    return null;
  }

  return (
    <div className="app bg-gray-100 min-h-screen flex flex-col items-center">
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
      </div>
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
}

export default App;
