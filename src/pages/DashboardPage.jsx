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

  const updateLocation = async () => {
    await api.patch('/users/location', { lat: Number(coords.lat), lon: Number(coords.lon) });
  };

  const createRoom = async () => {
    await api.post('/rooms', {
      ...roomForm,
      lat: Number(coords.lat),
      lon: Number(coords.lon),
      radiusKm: Number(roomForm.radiusKm),
      maxSlots: Number(roomForm.maxSlots)
    });
  };

  const searchNearby = async () => {
    const { data } = await api.get('/rooms/nearby', { params: { ...coords, radiusKm: 5 } });
    setRooms(data.rooms);
  };

  const joinRoom = async (roomId) => {
    await api.post(`/rooms/${roomId}/join`);
    setChatRoomId(roomId);
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <button onClick={logout}>Logout</button>
      <input placeholder="lat" onChange={(e) => setCoords({ ...coords, lat: e.target.value })} />
      <input placeholder="lon" onChange={(e) => setCoords({ ...coords, lon: e.target.value })} />
      <button onClick={updateLocation}>Update Location</button>
      <button onClick={searchNearby}>Find Nearby</button>

      <h3>Create Room</h3>
      <input placeholder="title" onChange={(e) => setRoomForm({ ...roomForm, title: e.target.value })} />
      <input placeholder="sport" onChange={(e) => setRoomForm({ ...roomForm, sport: e.target.value })} />
      <input type="datetime-local" onChange={(e) => setRoomForm({ ...roomForm, dateTime: e.target.value })} />
      <input type="number" min="1" max="5" onChange={(e) => setRoomForm({ ...roomForm, radiusKm: e.target.value })} />
      <input type="number" min="2" onChange={(e) => setRoomForm({ ...roomForm, maxSlots: e.target.value })} />
      <button onClick={createRoom}>Create Room</button>

      <ul>
        {rooms.map((room) => (
          <li key={room._id}>
            {room.title} ({room.sport}) slots:{room.slotsAvailable}
            <button onClick={() => joinRoom(room._id)}>Join</button>
          </li>
        ))}
      </ul>

      {chatRoomId && <RoomChat token={token} roomId={chatRoomId} />}
    </div>
  );
};
