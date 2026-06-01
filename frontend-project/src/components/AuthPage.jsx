import { useState } from 'react';
import { setToken } from '../auth';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export default function AuthPage({ setActivePage }) {
  const [mode, setMode] = useState('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setMessage(null);
    try {
      const res = await fetch(`${API_BASE}/api/auth/${mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message || 'Error');
        return;
      }
      if (mode === 'login') {
        setToken(data.token);
        setMessage('Login successful');
        setTimeout(() => setActivePage('car'), 600);
      } else {
        setMessage('Registration successful — you can now login');
        setMode('login');
      }
    } catch (err) {
      console.error(err);
      setMessage('Network error');
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="mb-4 text-2xl font-semibold">{mode === 'login' ? 'Login' : 'Register'}</h2>
      <form onSubmit={submit} className="space-y-4">
        <input className="w-full rounded border p-2" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} />
        <input className="w-full rounded border p-2" placeholder="Password" type="password" value={password} onChange={e => setPassword(e.target.value)} />
        <div className="flex items-center gap-2">
          <button className="rounded bg-blue-600 px-4 py-2 text-white" type="submit">{mode === 'login' ? 'Login' : 'Register'}</button>
          <button type="button" onClick={() => setMode(mode === 'login' ? 'register' : 'login')} className="text-sm text-slate-600">{mode === 'login' ? 'Create an account' : 'Back to login'}</button>
        </div>
        {message && <div className="mt-2 text-sm text-red-600">{message}</div>}
      </form>
    </div>
  );
}
