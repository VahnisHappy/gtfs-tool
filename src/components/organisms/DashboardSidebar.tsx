import { useNavigate, useLocation } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

export default function DashboardSidebar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();

    const menuItems = [
        { id: 'projects', label: 'projects', icon: '', path: '/' }
    ];

    const handleItemClick = (path: string) => {
        navigate(path);
    };

    return (
        <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
            {/* Logo/Header */}
            <div className="p-6 border-b border-gray-200">
                <h1 className="text-2xl font-bold text-gray-800">GTFS tool</h1>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 p-4">
                <ul className="space-y-2">
                    {menuItems.map((item) => (
                        <li key={item.id}>
                            <button
                                onClick={() => handleItemClick(item.path)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                    location.pathname === item.path
                                        ? 'bg-[#e8e7e5] font-medium'
                                        : 'text-gray-700 hover:bg-gray-50'
                                }`}
                            >
                                <span className="text-xl">{item.icon}</span>
                                <span>{item.label}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
                {user && (
                    <div className="flex items-center gap-3 mb-3 px-2">
                        {user.picture && (
                            <img src={user.picture} alt="" className="w-8 h-8 rounded-full" referrerPolicy="no-referrer" />
                        )}
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-800 truncate">{user.name}</p>
                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                    </div>
                )}
                <button
                    onClick={logout}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    sign out
                </button>
                <div className="text-xs text-gray-500 text-center mt-2">
                    GTFS Tool v1.0.0
                </div>
            </div>
        </div>
    );
}
