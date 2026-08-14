import { getCookie } from "@tanstack/react-start/server"
import { io, Socket } from "socket.io-client"
import { AUTH_CONFIG } from "../config/app/auth"

let socket: Socket | null = null

export const initializeSocket = (): Socket => {
  if (socket) {
    socket.disconnect()
  }

  const token = getCookie(AUTH_CONFIG.tokenCookieName)

  socket = io(appConfig.socketUrl, {
    transports: ["websocket"],
    autoConnect: appConfig.socket.autoConnect,
    reconnection: appConfig.socket.reconnection,
    reconnectionAttempts: appConfig.socket.reconnectionAttempts,
    reconnectionDelay: appConfig.socket.reconnectionDelay,
    auth: { token: token },
    extraHeaders: { Authorization: `Bearer ${token}` },
  })

  return socket
}

export const getInitializedSocket = (): Socket | null => {
  return socket
}

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect()
    socket = null
  }
}