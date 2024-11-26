import React from 'react'

const SocketIODocs = () => {
  return (
    <div style={{ padding: '20px' }}>
      <h1>Socket.IO API Documentation</h1>
      <p>Welcome to the Socket.IO API Documentation for this application.</p>

      <h2>Connection</h2>
      <p>
        The client can connect to the server using the following configuration:
      </p>
      <pre>
        <code>
          {`
// Client-side code
import { io } from "socket.io-client"

const socket = io("http://localhost:4000", { path: "/api/socket", addTrailingSlash: false })

socket.on("connect", () => {
  console.log("Connected to server")
})

socket.on("disconnect", () => {
  console.log("Disconnected from server")
})
          `}
        </code>
      </pre>

      <h2>Events</h2>
      <h3>1. "connect"</h3>
      <p>This event is emitted when the client successfully connects to the server.</p>

      <h3>2. "disconnect"</h3>
      <p>This event is emitted when the client gets disconnected from the server.</p>

      <h3>3. "welcome"</h3>
      <p>
        The server sends a welcome message to all connected clients when a new
        client joins:
      </p>
      <pre>
        <code>
          {`
// Server-side code
io.on("connect", socket => {
  socket.broadcast.emit("welcome", \`Welcome \${socket.id}\`)
})
          `}
        </code>
      </pre>

      <h2>Error Handling</h2>
      <p>When a connection error occurs, the client can handle it using:</p>
      <pre>
        <code>
          {`
// Handle connection error
socket.on("connect_error", err => {
  console.log(\`Connection failed: \${err.message}\`)
})
          `}
        </code>
      </pre>

      <h2>Server Setup</h2>
      <p>
        The server can be started using the following setup in the API route:
      </p>
      <pre>
        <code>
          {`
// API Route (/api/socket)

import { Server } from "socket.io"

const io = new Server(res.socket.server, {
  path: "/api/socket",
  addTrailingSlash: false,
  cors: { origin: "*" }
})

io.on("connect", socket => {
  console.log("Connected: ", socket.id)
  socket.broadcast.emit("welcome", \`Welcome \${socket.id}\`)
})
          `}
        </code>
      </pre>
    </div>
  )
}

export default SocketIODocs
