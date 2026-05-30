import { useState } from 'react';
import Sidebar from './components/Sidebar';
import CarPage from './components/CarPage';
import ParkingSlotPage from './components/ParkingSlotPage';
import ParkingRecordPage from './components/ParkingRecordPage';
import PaymentPage from './components/PaymentPage';
import ReportPage from './components/ReportPage';

const pages = {
  car: CarPage,
  parkingslot: ParkingSlotPage,
  parkingrecord: ParkingRecordPage,
  payment: PaymentPage,
  report: ReportPage,
  logout: () => <div className="p-6 text-center text-xl">You are logged out. Please refresh or navigate another page.</div>
};

function App() {
  const [currentPage, setCurrentPage] = useState('car');
  const PageComponent = pages[currentPage];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col lg:flex-row">
        <Sidebar activePage={currentPage} setActivePage={setCurrentPage} />
        <main className="flex-1 p-4 lg:p-8">
          <div className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-200">
            <PageComponent />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
