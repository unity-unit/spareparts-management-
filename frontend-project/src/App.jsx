import { useState } from 'react';
import Sidebar from './components/Sidebar';
import { isAuthenticated } from './auth';
import CarPage from './components/CarPage';
import ParkingSlotPage from './components/ParkingSlotPage';
import ParkingRecordPage from './components/ParkingRecordPage';
import PaymentPage from './components/PaymentPage';
import ReportPage from './components/ReportPage';
import AuthPage from './components/AuthPage';

const pages = {
  car: CarPage,
  parkingslot: ParkingSlotPage,
  parkingrecord: ParkingRecordPage,
  payment: PaymentPage,
  report: ReportPage,
  logout: () => <div className="p-6 text-center text-xl">You are logged out. Please refresh or navigate another page.</div>
};

pages.login = (props) => <AuthPage {...props} />;

function App() {
  const [currentPage, setCurrentPage] = useState(isAuthenticated() ? 'car' : 'login');
  const PageComponent = pages[currentPage];

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col lg:flex-row">
        <Sidebar activePage={currentPage} setActivePage={setCurrentPage} />
        <main className="flex-1 p-4 lg:p-8">
          <div className="rounded-3xl bg-white p-6 shadow-sm shadow-slate-200">
            <PageComponent setActivePage={setCurrentPage} />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
