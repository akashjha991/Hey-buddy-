import { useState } from 'react';
import { api } from '../api/client';
import { useAuth } from '../context/AuthContext';

export const AuthPage = () => {
  const [isRegister, setIsRegister] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const { login } = useAuth();

  const submit = async (e) => {
    e.preventDefault();
    const endpoint = isRegister ? '/auth/register' : '/auth/login';
    const payload = isRegister ? form : { email: form.email, password: form.password };
    const { data } = await api.post(endpoint, payload);
    login(data.token);
  };

  return (
    <form onSubmit={submit}>
      <h1>Sports Buddy</h1>
      {isRegister && <input placeholder="name" onChange={(e) => setForm({ ...form, name: e.target.value })} />}
      <input placeholder="email" onChange={(e) => setForm({ ...form, email: e.target.value })} />
      <input placeholder="password" type="password" onChange={(e) => setForm({ ...form, password: e.target.value })} />
      <button type="submit">{isRegister ? 'Register' : 'Login'}</button>
      <button type="button" onClick={() => setIsRegister((p) => !p)}>Switch</button>
    </form>
  );
};
