import { useState } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

export default function ParkingSlotPage() {
  const [form, setForm] = useState({ slot_number: '', slot_status: 'available' });
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`${API_BASE}/slots`, form);
      setMessage('Parking slot inserted successfully');
      setForm({ slot_number: '', slot_status: 'available' });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to insert parking slot');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-slate-900">Parking Slot</h2>
      <p className="mt-2 text-slate-600">Add a new parking slot to the system.</p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Slot Number</span>
            <input
              type="text"
              value={form.slot_number}
              onChange={(e) => setForm({ ...form, slot_number: e.target.value })}
              className="mt-1 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 focus:border-slate-900 focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Slot Status</span>
            <select
              value={form.slot_status}
              onChange={(e) => setForm({ ...form, slot_status: e.target.value })}
              className="mt-1 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 focus:border-slate-900 focus:outline-none"
            >
              <option value="available">Available</option>
              <option value="occupied">Occupied</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </label>
        </div>
        <button className="inline-flex items-center rounded-2xl bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700">
          Insert Slot
        </button>
        {message && <p className="text-sm text-slate-700">{message}</p>}
      </form>
    </div>
  );
}
