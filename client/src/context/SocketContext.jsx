// context/SocketContext.jsx

// Hooks
import { createContext, useEffect, useState, useContext } from "react";

//Utils
import { API_URL } from "../utils/config";

// Context
import { AuthContext } from "./AuthContext";

// Socket.io client
import { io } from "socket.io-client";

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    if (!user?._id) {
      setOnlineUsers([]);

      if (socket) {
        socket.disconnect();
        setSocket(null);
      }

      return;
    }

    // cria conexão socket
    const socketInstance = io(API_URL);

    setSocket(socketInstance);

    // conexão aberta
    socketInstance.on("connect", () => {
      console.log("✅ Socket connected:", socketInstance.id);

      socketInstance.emit("addUser", user._id);
    });

    socketInstance.on("getUsers", (users) => {
      setOnlineUsers(users);
    });

    // conexão encerrada
    socketInstance.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    // cleanup
    return () => {
      socketInstance.off("getUsers");
      socketInstance.disconnect();
    };
  }, [user]);

  return (
    <SocketContext.Provider
      value={{
        socket,
        onlineUsers,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
