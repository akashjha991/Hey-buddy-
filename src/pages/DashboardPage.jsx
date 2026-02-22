import { useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';
import { RoomChat } from '../components/RoomChat';

export const DashboardPage = () => {
  const { token, logout } = useAuth();
  const [coords, setCoords] = useState({ lat: '', lon: '' });
  const [rooms, setRooms] = useState([]);
  const [roomForm, setRoomForm] = useState({
    title: '',
    sport: '',
    dateTime: '',
    radiusKm: 1,
    maxSlots: 10
  });
  const [chatRoomId, setChatRoomId] = useState('');
  const [status, setStatus] = useState('Ready');

  const updateLocation = async () => {
    await api.patch('/users/location', { lat: Number(coords.lat), lon: Number(coords.lon) });
    setStatus('Location updated');
  };

  const createRoom = async () => {
    await api.post('/rooms', {
      ...roomForm,
      lat: Number(coords.lat),
      lon: Number(coords.lon),
      radiusKm: Number(roomForm.radiusKm),
      maxSlots: Number(roomForm.maxSlots)
    });
    setStatus('Room created successfully');
  };

  const searchNearby = async () => {
    const { data } = await api.get('/rooms/nearby', { params: { ...coords, radiusKm: 5 } });
    setRooms(data.rooms);
    setStatus(`Found ${data.rooms.length} nearby room(s)`);
  };

  const joinRoom = async (roomId) => {
    await api.post(`/rooms/${roomId}/join`);
    setChatRoomId(roomId);
    setStatus('Joined room and opened chat');
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <header className="mb-6 rounded-2xl bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
            <p className="text-sm text-slate-500">Manage your location, rooms, and chat in one place.</p>
          </div>
          <button className="rounded-lg bg-slate-800 px-4 py-2 font-medium text-white hover:bg-slate-900" onClick={logout}>
            Logout
          </button>
        </div>
        <p className="mt-3 text-sm text-brand">Status: {status}</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold">Your Location</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input
              className="rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-brand"
              placeholder="Latitude"
              onChange={(e) => setCoords({ ...coords, lat: e.target.value })}
            />
            <input
              className="rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-brand"
              placeholder="Longitude"
              onChange={(e) => setCoords({ ...coords, lon: e.target.value })}
            />
          </div>
          <div className="mt-4 flex gap-3">
            <button className="rounded-lg bg-brand px-4 py-2 font-semibold text-white hover:bg-blue-700" onClick={updateLocation}>
              Update Location
            </button>
            <button className="rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-100" onClick={searchNearby}>
              Find Nearby
            </button>
          </div>
        </section>

        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <h3 className="mb-4 text-lg font-semibold">Create Sports Room</h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <input className="rounded-lg border border-slate-300 px-4 py-2 focus:border-brand" placeholder="Title" onChange={(e) => setRoomForm({ ...roomForm, title: e.target.value })} />
            <input className="rounded-lg border border-slate-300 px-4 py-2 focus:border-brand" placeholder="Sport" onChange={(e) => setRoomForm({ ...roomForm, sport: e.target.value })} />
            <input className="rounded-lg border border-slate-300 px-4 py-2 focus:border-brand" type="datetime-local" onChange={(e) => setRoomForm({ ...roomForm, dateTime: e.target.value })} />
            <input className="rounded-lg border border-slate-300 px-4 py-2 focus:border-brand" type="number" min="1" max="5" placeholder="Radius (1-5 km)" onChange={(e) => setRoomForm({ ...roomForm, radiusKm: e.target.value })} />
            <input className="rounded-lg border border-slate-300 px-4 py-2 focus:border-brand sm:col-span-2" type="number" min="2" placeholder="Max slots" onChange={(e) => setRoomForm({ ...roomForm, maxSlots: e.target.value })} />
          </div>
          <button className="mt-4 rounded-lg bg-emerald-600 px-4 py-2 font-semibold text-white hover:bg-emerald-700" onClick={createRoom}>
            Create Room
          </button>
        </section>
      </div>

      <section className="mt-6 rounded-2xl bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold">Nearby Rooms</h3>
        {rooms.length === 0 ? (
          <p className="text-sm text-slate-500">No nearby rooms yet. Update location and click “Find Nearby”.</p>
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {rooms.map((room) => (
              <article className="rounded-xl border border-slate-200 p-4" key={room._id}>
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-semibold text-slate-800">{room.title}</h4>
                    <p className="text-sm text-slate-500">{room.sport}</p>
                  </div>
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs">Slots: {room.slotsAvailable}</span>
                </div>
                <button className="mt-3 rounded-lg bg-brand px-3 py-2 text-sm font-semibold text-white hover:bg-blue-700" onClick={() => joinRoom(room._id)}>
                  Join Room
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      {chatRoomId && (
        <div className="mt-6">
          <RoomChat token={token} roomId={chatRoomId} />
        </div>
      )}
    </div>
  );
};
