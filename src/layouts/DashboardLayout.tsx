import { Outlet, useLocation } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import Sidebar from '../components/organisms/Sidebar';
import useAuth from '../hooks/useAuth';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../store';
import { setApiAgencyId, agencyApi } from '../services/api';
import { AgencyActions } from '../store/actions';

export default function DashboardLayout() {
    const location = useLocation();
    const isDashboardPage = location.pathname === '/';
    const { user, logout } = useAuth();
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();
    const activeAgencyId = useSelector((state: RootState) => state.agencyState.activeAgencyId);
    const agencies = useSelector((state: RootState) => state.agencyState.data);

    useEffect(() => {
        const loadAgencies = async () => {
            try {
                const data = await agencyApi.getAll();
                const formattedAgencies = data.map((a) => ({
                    id: { value: a.agency_id },
                    name: { value: a.agency_name },
                    url: { value: a.agency_url },
                    timezone: { value: a.agency_timezone },
                    ...(a.agency_lang && { lang: { value: a.agency_lang } }),
                    ...(a.agency_phone && { phone: { value: a.agency_phone } }),
                    ...(a.agency_fare_url && { fareUrl: { value: a.agency_fare_url } }),
                    ...(a.agency_email && { email: { value: a.agency_email } }),
                }));
                dispatch(AgencyActions.setAgencies(formattedAgencies));

                // Try to restore active agency from localStorage
                const savedAgencyId = localStorage.getItem('activeAgencyId');
                if (savedAgencyId && formattedAgencies.some(a => a.id.value === savedAgencyId)) {
                    dispatch(AgencyActions.setActiveAgency(savedAgencyId));
                }
            } catch (error) {
                console.error('Failed to load agencies:', error);
            }
        };

        if (agencies.length === 0) {
            loadAgencies();
        }
    }, [agencies.length, dispatch]);

    useEffect(() => {
        setApiAgencyId(activeAgencyId);
        if (activeAgencyId) {
            localStorage.setItem('activeAgencyId', activeAgencyId);
        }
    }, [activeAgencyId]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
                setIsProfileOpen(false);
            }
        };
        if (isProfileOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isProfileOpen]);

    return (
        <div className="flex h-screen">
            {!isDashboardPage && (
                <Sidebar disableSidebarSel={false} />
            )}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Header Bar */}
                {isDashboardPage && (
                    <header className="flex items-center justify-between px-8 py-3 border-b border-gray-200 bg-white flex-shrink-0">
                        <h1 className="text-xl font-bold text-gray-800">GTFS tool</h1>

                        {/* User Profile */}
                        <div className="relative" ref={profileRef}>
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                                type="button"
                                style={{ border: 'none', width: 'auto' }}
                            >
                                {user?.picture ? (
                                    <img src={user.picture} alt="" className="w-7 h-7 rounded-full" referrerPolicy="no-referrer" />
                                ) : (
                                    <div className="w-7 h-7 rounded-full bg-[#00A8E8] flex items-center justify-center text-white text-xs font-medium">
                                        {user?.name?.charAt(0)?.toUpperCase() || '?'}
                                    </div>
                                )}
                                <span className="text-sm font-medium text-gray-700 hidden sm:inline">{user?.name}</span>
                                <svg className={`w-3.5 h-3.5 text-gray-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* Dropdown */}
                            {isProfileOpen && (
                                <div className="absolute right-0 top-full mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                                    {user && (
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <p className="text-sm font-medium text-gray-800 truncate">{user.name}</p>
                                            <p className="text-xs text-gray-500 truncate">{user.email}</p>
                                        </div>
                                    )}
                                    <button
                                        onClick={logout}
                                        className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 transition-colors"
                                        type="button"
                                        style={{ border: 'none', borderRadius: 0 }}
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                        </svg>
                                        sign out
                                    </button>
                                </div>
                            )}
                        </div>
                    </header>
                )}

                {/* Main Content */}
                <div className="flex-1 overflow-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}