// src/socket/SocketProvider.js
import React, { createContext, useEffect, useRef, useState } from "react";
import { AppState } from "react-native";
import { createSocket } from "./globalSocket";

export const SocketContext = createContext(null);

const SocketProvider = ({ children }) => {
  const socketRef = useRef(null);
  const [connected, setConnected] = useState(false);
  const appState = useRef(AppState.currentState);

  /* ===== CREATE SOCKET ONCE ===== */
  useEffect(() => {
    let mounted = true;

    const init = async () => {
      const socket = await createSocket();
      if (!socket || !mounted) return;

      socketRef.current = socket;

      socket.on("connect", () => {
        console.log("🟢 Socket connected:", socket.id);
        setConnected(true);
      });

      socket.on("disconnect", (reason) => {
        console.log("🔴 Socket disconnected:", reason);
        setConnected(false);
      });
    };

    init();

    return () => {
      mounted = false;
      // ❌ DO NOT disconnect here
    };
  }, []);

  /* ===== APP FOREGROUND HANDLING ===== */
  useEffect(() => {
    const sub = AppState.addEventListener("change", async (next) => {
      console.log("📱 App state:", next);

      if (
        appState.current.match(/inactive|background/) &&
        next === "active"
      ) {
        if (socketRef.current && !socketRef.current.connected) {
          console.log("🔁 Reconnecting socket");
          socketRef.current.connect();
        }
      }

      appState.current = next;
    });

    return () => sub.remove();
  }, []);

  return (
    <SocketContext.Provider value={{ socketRef, connected }}>
      {children}
    </SocketContext.Provider>
  );
};

export default SocketProvider;
