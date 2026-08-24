import { io, Socket } from "socket.io-client"
import { AUTH_CONFIG } from "../config/app/auth"
import { APP_CONFIG } from "../config/app"

let socket: Socket | null = null

export const initializeSocket = (): Socket => {
  if (socket) {
    socket.disconnect()
  }

  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${AUTH_CONFIG.tokenCookieName}=`))
    ?.split("=")[1]

  socket = io(APP_CONFIG.socketUrl, {
    transports: ["websocket"],
    autoConnect: false,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
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
