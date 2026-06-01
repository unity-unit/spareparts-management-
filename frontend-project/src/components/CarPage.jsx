import { useState } from 'react';
import API from '../api';

export default function CarPage() {
  const [form, setForm] = useState({ plate_number: '', driver_name: '', phone_number: '' });
  const [message, setMessage] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await API.post('/cars', form);
      setMessage('Car inserted successfully');
      setForm({ plate_number: '', driver_name: '', phone_number: '' });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to insert car');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-slate-900">Car</h2>
      <p className="mt-2 text-slate-600">Add a new car record to the system.</p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Plate Number</span>
            <input
              type="text"
              value={form.plate_number}
              onChange={(e) => setForm({ ...form, plate_number: e.target.value })}
              className="mt-1 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 focus:border-slate-900 focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Driver Name</span>
            <input
              type="text"
              value={form.driver_name}
              onChange={(e) => setForm({ ...form, driver_name: e.target.value })}
              className="mt-1 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 focus:border-slate-900 focus:outline-none"
            />
          </label>
          <label className="block md:col-span-2">
            <span className="text-sm font-medium text-slate-700">Phone Number</span>
            <input
              type="text"
              value={form.phone_number}
              onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
              className="mt-1 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 focus:border-slate-900 focus:outline-none"
            />
          </label>
        </div>
        <button className="inline-flex items-center rounded-2xl bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700">
          Insert Car
        </button>
        {message && <p className="text-sm text-slate-700">{message}</p>}
      </form>
    </div>
  );
}
