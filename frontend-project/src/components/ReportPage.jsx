import { useEffect, useState } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

export default function ReportPage() {
  const [records, setRecords] = useState([]);
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState({ totalRecords: 0, occupiedSlots: 0, totalPayments: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [recordsRes, paymentsRes] = await Promise.all([
          axios.get(`${API_BASE}/records`),
          axios.get(`${API_BASE}/payments`)
        ]);
        const recordsData = recordsRes.data;
        setRecords(recordsData);
        setPayments(paymentsRes.data);
        setSummary({
          totalRecords: recordsData.length,
          occupiedSlots: recordsData.filter((r) => r.slot_status === 'occupied').length,
          totalPayments: paymentsRes.data.reduce((sum, payment) => sum + Number(payment.amount_paid || 0), 0)
        });
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 rounded-3xl bg-slate-50 p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Report</h2>
          <p className="mt-2 text-slate-600">Summary of parking records and slot usage.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-3xl bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Total Records</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{summary.totalRecords}</p>
          </div>
          <div className="rounded-3xl bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Occupied Slots</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{summary.occupiedSlots}</p>
          </div>
          <div className="rounded-3xl bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-500">Total Payments</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{summary.totalPayments.toFixed(2)}</p>
          </div>
        </div>
      </div>
      {loading ? (
        <div className="rounded-3xl bg-white p-6 text-slate-600 shadow-sm">Loading report...</div>
      ) : (
        <div className="overflow-x-auto rounded-3xl bg-white p-4 shadow-sm">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="border-b border-slate-200 bg-slate-50">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Plate</th>
                <th className="px-4 py-3">Driver</th>
                <th className="px-4 py-3">Slot</th>
                <th className="px-4 py-3">Entry</th>
                <th className="px-4 py-3">Exit</th>
                <th className="px-4 py-3">Duration</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {records.map((record) => (
                <tr key={record.id}>
                  <td className="px-4 py-3">{record.id}</td>
                  <td className="px-4 py-3">{record.plate_number}</td>
                  <td className="px-4 py-3">{record.driver_name}</td>
                  <td className="px-4 py-3">{record.slot_number}</td>
                  <td className="px-4 py-3">{record.entry_time}</td>
                  <td className="px-4 py-3">{record.exit_time || '-'}</td>
                  <td className="px-4 py-3">{record.duration ?? '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
