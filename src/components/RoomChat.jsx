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
    if (!message.trim()) return;
    socket?.emit('room-message', { roomId, message });
    setMessage('');
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-lg font-semibold">Room Chat</h3>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">#{roomId.slice(-6)}</span>
      </div>

      <div className="mb-3 h-48 space-y-2 overflow-y-auto rounded-lg bg-slate-50 p-3">
        {feed.length === 0 ? (
          <p className="text-sm text-slate-400">No messages yet. Start the conversation.</p>
        ) : (
          feed.map((item, idx) => (
            <div className="rounded-md bg-white p-2 text-sm shadow-sm" key={idx}>
              <span className="font-semibold text-brand">{item.sender}</span>: {item.message}
            </div>
          ))
        )}
      </div>

      <div className="flex gap-2">
        <input
          className="w-full rounded-lg border border-slate-300 px-3 py-2 outline-none focus:border-brand"
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Type a message"
          value={message}
        />
        <button className="rounded-lg bg-brand px-4 py-2 font-semibold text-white hover:bg-blue-700" onClick={send}>
          Send
        </button>
      </div>
    </section>
  );
};
