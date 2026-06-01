import { useEffect, useState } from 'react';
import API from '../api';

function formatDateTimeValue(value) {
  if (!value) return '';
  return value.replace(' ', 'T').substring(0, 16);
}

export default function ParkingRecordPage() {
  const initialForm = { plate_number: '', slot_number: '', entry_time: '', exit_time: '', duration: '' };
  const [records, setRecords] = useState([]);
  const [cars, setCars] = useState([]);
  const [slots, setSlots] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editId, setEditId] = useState(null);
  const [message, setMessage] = useState('');

  const fetchRecords = async () => {
    try {
      const response = await API.get('/records');
      setRecords(response.data);
    } catch (error) {
      setMessage('Unable to fetch records');
    }
  };

  const fetchMeta = async () => {
    try {
      const [carsRes, slotsRes] = await Promise.all([API.get('/cars'), API.get('/slots')]);
      setCars(carsRes.data);
      setSlots(slotsRes.data);
    } catch (error) {
      setMessage('Unable to load car or slot options');
    }
  };

  useEffect(() => {
    fetchRecords();
    fetchMeta();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      if (editId) {
        await API.put(`/records/${editId}`, {
          ...form,
          duration: form.duration !== '' ? Number(form.duration) : null
        });
        setMessage('Parking record updated successfully');
      } else {
        await API.post('/records', {
          ...form,
          duration: form.duration !== '' ? Number(form.duration) : null
        });
        setMessage('Parking record inserted successfully');
      }
      setForm(initialForm);
      setEditId(null);
      await fetchRecords();
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error saving parking record');
    }
  };

  const handleEdit = (record) => {
    setEditId(record.id);
    setForm({
      plate_number: record.plate_number,
      slot_number: record.slot_number,
      entry_time: formatDateTimeValue(record.entry_time),
      exit_time: formatDateTimeValue(record.exit_time),
      duration: record.duration ?? ''
    });
    setMessage('Editing record ID ' + record.id);
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/records/${id}`);
      setMessage('Parking record deleted successfully');
      await fetchRecords();
    } catch (error) {
      setMessage('Error deleting record');
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Parking Record</h2>
          <p className="mt-2 text-slate-600">Insert, retrieve, update, and delete parking records.</p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditId(null);
            setForm(initialForm);
            setMessage('New record ready');
          }}
          className="rounded-2xl bg-slate-100 px-4 py-2 text-slate-700 hover:bg-slate-200"
        >
          New Record
        </button>
      </div>
      <form className="mb-6 space-y-4 rounded-3xl bg-slate-50 p-6 shadow-sm" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Plate Number</span>
            {cars.length > 0 ? (
              <select
                value={form.plate_number}
                onChange={(e) => setForm({ ...form, plate_number: e.target.value })}
                className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 focus:border-slate-900 focus:outline-none"
              >
                <option value="">Select a car</option>
                {cars.map((car) => (
                  <option key={car.plate_number} value={car.plate_number}>
                    {car.plate_number} - {car.driver_name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={form.plate_number}
                onChange={(e) => setForm({ ...form, plate_number: e.target.value })}
                className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 focus:border-slate-900 focus:outline-none"
              />
            )}
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Slot Number</span>
            {slots.length > 0 ? (
              <select
                value={form.slot_number}
                onChange={(e) => setForm({ ...form, slot_number: e.target.value })}
                className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 focus:border-slate-900 focus:outline-none"
              >
                <option value="">Select a slot</option>
                {slots.map((slot) => (
                  <option key={slot.slot_number} value={slot.slot_number}>
                    {slot.slot_number} - {slot.slot_status}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                value={form.slot_number}
                onChange={(e) => setForm({ ...form, slot_number: e.target.value })}
                className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 focus:border-slate-900 focus:outline-none"
              />
            )}
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Entry Time</span>
            <input
              type="datetime-local"
              value={form.entry_time}
              onChange={(e) => setForm({ ...form, entry_time: e.target.value })}
              className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 focus:border-slate-900 focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Exit Time</span>
            <input
              type="datetime-local"
              value={form.exit_time}
              onChange={(e) => setForm({ ...form, exit_time: e.target.value })}
              className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 focus:border-slate-900 focus:outline-none"
            />
          </label>
          <label className="block md:col-span-2">
            <span className="text-sm font-medium text-slate-700">Duration (minutes)</span>
            <input
              type="number"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
              className="mt-1 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 focus:border-slate-900 focus:outline-none"
            />
          </label>
        </div>
        <button className="inline-flex items-center rounded-2xl bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700">
          {editId ? 'Update Record' : 'Insert Record'}
        </button>
        {message && <p className="text-sm text-slate-700">{message}</p>}
      </form>
      <div className="overflow-x-auto rounded-3xl bg-white p-4 shadow-sm">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
          <thead className="border-b border-slate-200 bg-slate-50">
            <tr>
              <th className="px-4 py-3">ID</th>
              <th className="px-4 py-3">Plate</th>
              <th className="px-4 py-3">Slot</th>
              <th className="px-4 py-3">Entry</th>
              <th className="px-4 py-3">Exit</th>
              <th className="px-4 py-3">Duration</th>
              <th className="px-4 py-3">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {records.map((record) => (
              <tr key={record.id}>
                <td className="px-4 py-3">{record.id}</td>
                <td className="px-4 py-3">{record.plate_number}</td>
                <td className="px-4 py-3">{record.slot_number}</td>
                <td className="px-4 py-3">{record.entry_time}</td>
                <td className="px-4 py-3">{record.exit_time || '-'}</td>
                <td className="px-4 py-3">{record.duration ?? '-'}</td>
                <td className="px-4 py-3 space-x-2">
                  <button
                    type="button"
                    onClick={() => handleEdit(record)}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(record.id)}
                    className="rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-200"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {records.length === 0 && (
              <tr>
                <td colSpan="7" className="px-4 py-6 text-center text-slate-500">
                  No parking records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
