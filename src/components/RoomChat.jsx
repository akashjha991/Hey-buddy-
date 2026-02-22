import { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const RoomChat = ({ token, roomId }) => {
  const [socket, setSocket] = useState(null);
  const [message, setMessage] = useState('');
  const [feed, setFeed] = useState([]);

  useEffect(() => {
    const s = io(socketUrl, { auth: { token }, withCredentials: true });
    s.emit('join-room-chat', roomId);
    s.on('room-message', (payload) => setFeed((prev) => [...prev, payload]));
    setSocket(s);

    return () => s.disconnect();
  }, [token, roomId]);

  const send = () => {
    socket?.emit('room-message', { roomId, message });
    setMessage('');
  };

  return (
    <section>
      <h3>Room Chat</h3>
      <div>{feed.map((item, idx) => <p key={idx}>{item.sender}: {item.message}</p>)}</div>
      <input value={message} onChange={(e) => setMessage(e.target.value)} />
      <button onClick={send}>Send</button>
    </section>
  );
};
