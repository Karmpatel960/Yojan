import type { NextApiRequest } from "next"
import { Server as SocketIOServer } from "socket.io"
import type { Server as HTTPServer } from "http"
import type { Socket as NetSocket } from "net"
import type { NextApiResponse } from "next"

interface SocketServer extends HTTPServer {
  io?: SocketIOServer | undefined
}

interface SocketWithIO extends NetSocket {
  server: SocketServer
}

interface NextApiResponseWithSocket extends NextApiResponse {
  socket: SocketWithIO
}

export async function GET(_req: NextApiRequest, res: NextApiResponseWithSocket) {
  // Check if Socket.IO is already initialized
  if (res.socket?.server?.io) {
    console.log("Socket.io is already running.")
    res.status(200).json({ success: true, message: "Socket is already running" })
    return
  }

  console.log("Starting new Socket.IO server...")

  const io = new SocketIOServer(res.socket.server, {
    path: "/api/socket",
    addTrailingSlash: false,
    cors: {
      origin: "*",
    },
  })

  io.on("connect", socket => {
    console.log("New connection", socket.id)
    socket.broadcast.emit("welcome", `Welcome ${socket.id}`)

    socket.on("disconnect", () => {
      console.log("Disconnected", socket.id)
    })
  })

  res.socket.server.io = io  // Store io instance in socket server
  res.status(201).json({ success: true, message: "Socket.io server started" })
}
