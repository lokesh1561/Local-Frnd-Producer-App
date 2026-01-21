// src/socket/globalSocket.js
import { io } from "socket.io-client";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MAIN_BASE_URL } from "../api/baseUrl1";

let socket = null;

export const createSocket = async () => {
  if (socket) return socket;

  const token = await AsyncStorage.getItem("twittoke");
  if (!token) return null;

  socket = io(MAIN_BASE_URL, {
    transports: ["websocket"],
    auth: { token },
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 2000,
    pingInterval: 25000,
    pingTimeout: 60000,
  });

  return socket;
};

export const getSocket = () => socket;

export const destroySocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};


export const disconnectSocketOnLogout = () => {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
};


export const connectSocketAfterLogin = async () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
  return await getSocket();
};
