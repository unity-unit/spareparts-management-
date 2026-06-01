import { useEffect, useState } from 'react';
import API from '../api';

export default function PaymentPage() {
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState({ parking_record_id: '', amount_paid: '', payment_date: '' });
  const [message, setMessage] = useState('');

  const fetchRecords = async () => {
    try {
      const response = await API.get('/records');
      setRecords(response.data);
    } catch (error) {
      setMessage('Unable to load parking records');
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await API.post('/payments', {
        parking_record_id: Number(form.parking_record_id),
        amount_paid: Number(form.amount_paid),
        payment_date: form.payment_date
      });
      setMessage('Payment recorded successfully');
      setForm({ parking_record_id: '', amount_paid: '', payment_date: '' });
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to insert payment');
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-slate-900">Payment</h2>
      <p className="mt-2 text-slate-600">Record a payment for a parking record.</p>
      <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 md:grid-cols-3">
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Parking Record</span>
            <select
              value={form.parking_record_id}
              onChange={(e) => setForm({ ...form, parking_record_id: e.target.value })}
              className="mt-1 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 focus:border-slate-900 focus:outline-none"
            >
              <option value="">Select a parking record</option>
              {records.map((record) => (
                <option key={record.id} value={record.id}>
                  {record.id} - {record.plate_number} / {record.slot_number}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Amount Paid</span>
            <input
              type="number"
              step="0.01"
              value={form.amount_paid}
              onChange={(e) => setForm({ ...form, amount_paid: e.target.value })}
              className="mt-1 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 focus:border-slate-900 focus:outline-none"
            />
          </label>
          <label className="block">
            <span className="text-sm font-medium text-slate-700">Payment Date</span>
            <input
              type="date"
              value={form.payment_date}
              onChange={(e) => setForm({ ...form, payment_date: e.target.value })}
              className="mt-1 w-full rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 focus:border-slate-900 focus:outline-none"
            />
          </label>
        </div>
        <button className="inline-flex items-center rounded-2xl bg-blue-600 px-6 py-3 text-white transition hover:bg-blue-700">
          Submit Payment
        </button>
        {message && <p className="text-sm text-slate-700">{message}</p>}
      </form>
    </div>
  );
}
