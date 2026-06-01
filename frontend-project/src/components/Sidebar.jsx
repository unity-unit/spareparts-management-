import { isAuthenticated, logout } from '../auth';

export default function Sidebar({ activePage, setActivePage }) {
  const auth = isAuthenticated();
  const menuItems = [
    { id: 'car', label: 'Car' },
    { id: 'parkingslot', label: 'Parking Slot' },
    { id: 'parkingrecord', label: 'Parking Record' },
    { id: 'payment', label: 'Payment' },
    { id: 'report', label: 'Report' }
  ];
  if (auth) menuItems.push({ id: 'logout', label: 'Logout' });
  else menuItems.push({ id: 'login', label: 'Login' });

  return (
    <aside className="w-full border-b border-slate-200 bg-white p-4 shadow-sm lg:sticky lg:top-0 lg:h-screen lg:w-72 lg:border-r lg:border-b-0">
      <div className="mb-8 px-2">
        <h1 className="text-2xl font-semibold text-slate-900">PSSMS</h1>
        <p className="mt-2 text-sm text-slate-600">Parking Sales Management System</p>
      </div>
      <nav className="space-y-2 px-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => {
              if (item.id === 'logout') {
                logout();
                setActivePage('login');
                return;
              }
              setActivePage(item.id);
            }}
            className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-medium transition ${
              activePage === item.id
                ? 'bg-blue-600 text-white shadow'
                : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
            }`}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
