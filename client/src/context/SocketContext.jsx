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
    // se não tiver usuário logado
    // garante limpeza total
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

    // usuário entrou
    socketInstance.emit("addUser", user._id);

    // recebe usuários online
    socketInstance.on("getUsers", (users) => {
      setOnlineUsers(users);
    });

    // conexão aberta
    socketInstance.on("connect", () => {
      console.log("✅ Socket connected:", socketInstance.id);
    });

    // conexão encerrada
    socketInstance.on("disconnect", () => {
      console.log("❌ Socket disconnected");
    });

    // cleanup
    return () => {
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
