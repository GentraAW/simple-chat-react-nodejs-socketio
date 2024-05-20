import { useState, useEffect } from "react";
import io from "socket.io-client";
import Login from "./components/Login";
import ChatRoomList from "./components/ChatRoomList";
import ChatWindow from "./components/ChatWindow";

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
            if (data.to === username) {
              alert(`New message received from ${data.from}`);
            }
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
      setRooms((prevRooms) => ({
        ...prevRooms,
        [currentRoom]: {
          ...prevRooms[currentRoom],
          messages: [...(prevRooms[currentRoom]?.messages || []), message],
        },
      }));
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
        <Login
          username={username}
          setUsername={setUsername}
          handleLogin={handleLogin}
        />
      </div>
    );
  }

  if (exited) {
    return null;
  }

  return (
    <div className="app bg-gray-100 min-h-screen flex flex-col items-center">
      <ChatRoomList
        rooms={rooms}
        currentRoom={currentRoom}
        switchRoom={switchRoom}
        newChatUser={newChatUser}
        setNewChatUser={setNewChatUser}
        startNewChat={startNewChat}
      />
      <ChatWindow
        currentRoom={currentRoom}
        handleExit={handleExit}
        messages={messages}
        messageInput={messageInput}
        setMessageInput={setMessageInput}
        sendMessage={sendMessage}
        handleKeyPress={handleKeyPress}
      />
    </div>
  );
}

export default App;
