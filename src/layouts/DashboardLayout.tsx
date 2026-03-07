import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from '../components/organisms/Sidebar';
import DashboardSidebar from '../components/organisms/DashboardSidebar';

export default function DashboardLayout() {
  const location = useLocation();
  const isDashboardPage = location.pathname === '/';

  return (
    <div className="flex h-screen">
      {isDashboardPage ? (
        <DashboardSidebar />
      ) : (
        <Sidebar disableSidebarSel={false} />
      )}
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}