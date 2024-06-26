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
    window.location.reload();
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

          // if (data.to === username) {
          //   if (data.to === username) {
          //     alert(`New message from "${data.from}"`);
          //   }
          // }
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

  const handleKeyPressChat = (e) => {
    if (e.key === "Enter") {
      startNewChat();
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
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-slate-50 to-slate-200">
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
    <div className="flex min-h-screen bg-gradient-to-r from-slate-50 to-slate-200">
      <div className="flex items-center justify-center m-10 max-h-[52rem] shadow-xl rounded-xl custom-gradient-bg">
        <div className="flex w-full">
          <div className="w-3/10">
            <ChatRoomList
              rooms={rooms}
              currentRoom={currentRoom}
              switchRoom={switchRoom}
              newChatUser={newChatUser}
              setNewChatUser={setNewChatUser}
              startNewChat={startNewChat}
              handleKeyPressChat={handleKeyPressChat}
            />
          </div>
          <div className="w-7/10">
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
        </div>
      </div>
    </div>
  );
}

export default App;
