import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { io } from 'socket.io-client'

export default function Chat({ nickName }) {
  const [socketIO, setSocketIO] = useState(io()) // it's an empty socket, only for the type
  const [msgs, setMsgs] = useState([])
  const [rooms, setRooms] = useState([])
  const [room, setRoom] = useState('')
  const [newRoom, setNewRoom] = useState('')
  const [msgText, setMsgText] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    // when component up, connect to server socket
    const socket = io('http://localhost:2500') // create a socket connected to the server

    socket.emit('connection', nickName)

    socket.on('nickname-error', (data) => {
      console.log(data)
      navigate('/login')
    })

    socket.on('join', (data) => {
      console.log(data)
      setRooms(data.rooms)
      setRoom(data.rooms[0])
      console.log(`Your socket ID: ${data.socketId}`)
    })

    socket.on('msg-server', (data) =>
      setMsgs((prev) => [
        ...prev,
        { created: Date.now(), userName: 'System', msgText: data },
      ])
    )

    socket.on('set-msgs', (data) => {
      setMsgs(data)
    })

    socket.on('add-room-server', (data) => {
      setRooms(data)
    })

    socket.on('add-room-error', (data) => {
      console.log(data)
      return
    })

    socket.on('new-msg-server', (data) => {
      setMsgs((prev) => [...prev, data])
    })

    setSocketIO(socket) // only after listening to all events, save the socket to state
  }, [])

  useEffect(() => {
    // accurse on every change in the socket, like refresh page
  }, [socketIO])

  const handleSetRoom = (r) => {
    setRoom(r)
    socketIO.emit('set-room', r)
  }

  const handleAddRoom = () => {
    if (!rooms.includes(newRoom)) socketIO.emit('add-room', newRoom)

    setNewRoom('')
  }

  const handleSend = () => {
    if (msgText) {
      const msg = { userName: nickName, msgText, created: Date.now() }
      console.log(room, msg)
      socketIO.emit('new-msg', { room, msg })
    }
    setMsgText('')
  }

  const formatDate = (timestamp) => {
    const created = new Date(timestamp)
    return `${created.getDate()}.${
      created.getMonth() + 1
    } ${created.getHours()}:${created.getMinutes()}`
  }

  const handleExit = () => {
    socketIO.emit('leave-room', {
      nickName,
      reason: 'The socket was manually disconnected',
    })
    navigate('/')
  }

  return (
    <section className="chat">
      <div className="chat-header">
        <h3>Welcome {nickName} </h3>
        <button className="exit-btn" onClick={handleExit}>
          Exit
        </button>
      </div>

      <section className="chat-container">
        <section className="rooms-container">
          <section className="room-list">
            {rooms.map((r) => (
              <li
                className={'room-li'}
                key={r}
                onClick={() => handleSetRoom(r)}
              >
                {r}
              </li>
            ))}
          </section>

          <div className="add-room">
            <input
              type="text"
              name="new-room"
              id="new-room"
              placeholder="Add New Room"
              value={newRoom}
              onInput={(e) => setNewRoom(e.target.value)}
            />
            <button onClick={handleAddRoom}>Create</button>
          </div>
        </section>

        <section className="chat-room">
          <h3>{room}</h3>
          <div className="room-msgs">
            {msgs.map((msg) => (
              <li className="msg" key={msg.msgText}>
                <span className="created">{formatDate(msg.created)} |</span>
                <span className="username">{msg.userName}:</span>
                <span className="msg-text">{msg.msgText}</span>
              </li>
            ))}
          </div>
          <div className="msg-editor">
            <input
              type="text"
              value={msgText}
              placeholder="message"
              onInput={(e) => setMsgText(e.target.value)}
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </section>
      </section>
    </section>
  )
}
