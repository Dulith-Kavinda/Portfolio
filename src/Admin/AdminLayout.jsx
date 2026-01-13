import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import app from '../firebase';
import './AdminStyles.css';

const auth = getAuth(app);

export default function AdminLayout() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
            if (!currentUser) {
                navigate('/admin/login');
            }
        });

        return () => unsubscribe();
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/admin/login');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-black">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-amber-600"></div>
            </div>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="flex h-screen bg-black font-popins">
            {/* Sidebar */}
            <aside
                className={`${
                    sidebarOpen ? 'w-64' : 'w-20'
                } bg-slate-950 text-white transition-all duration-300 ease-in-out flex flex-col border-r border-amber-600/30 font-popins`}
            >
                {/* Logo */}
                <div className="p-4 border-b border-amber-600/30 flex items-center justify-between">
                    {sidebarOpen && (
                        <h1 className="text-xl font-bold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                            Admin Panel
                        </h1>
                    )}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="p-2 rounded hover:bg-amber-600/10 transition-colors"
                    >
                        <svg
                            className={`w-6 h-6 transform transition-transform ${
                                sidebarOpen ? 'rotate-0' : 'rotate-180'
                            }`}
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                            />
                        </svg>
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
                    <NavLink
                        to="/admin"
                        end
                        className={({ isActive }) =>
                            `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                                isActive
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white'
                                    : 'hover:bg-amber-600/10 text-gray-300'
                            }`
                        }
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                            />
                        </svg>
                        {sidebarOpen && <span>Dashboard</span>}
                    </NavLink>

                    <NavLink
                        to="/admin/posts"
                        className={({ isActive }) =>
                            `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                                isActive
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white'
                                    : 'hover:bg-amber-600/10 text-gray-300'
                            }`
                        }
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
                            />
                        </svg>
                        {sidebarOpen && <span>Posts</span>}
                    </NavLink>

                    <NavLink
                        to="/admin/home-data"
                        className={({ isActive }) =>
                            `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                                isActive
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white'
                                    : 'hover:bg-amber-600/10 text-gray-300'
                            }`
                        }
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
                            />
                        </svg>
                        {sidebarOpen && <span>Home Data</span>}
                    </NavLink>

                    <NavLink
                        to="/admin/feedback"
                        className={({ isActive }) =>
                            `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                                isActive
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white'
                                    : 'hover:bg-amber-600/10 text-gray-300'
                            }`
                        }
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                            />
                        </svg>
                        {sidebarOpen && <span>Feedback</span>}
                    </NavLink>

                    <NavLink
                        to="/admin/clients"
                        className={({ isActive }) =>
                            `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                                isActive
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white'
                                    : 'hover:bg-amber-600/10 text-gray-300'
                            }`
                        }
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                            />
                        </svg>
                        {sidebarOpen && <span>Clients</span>}
                    </NavLink>

                    <NavLink
                        to="/admin/analytics"
                        className={({ isActive }) =>
                            `flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                                isActive
                                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white'
                                    : 'hover:bg-amber-600/10 text-gray-300'
                            }`
                        }
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                            />
                        </svg>
                        {sidebarOpen && <span>Analytics</span>}
                    </NavLink>
                </nav>

                {/* User Profile */}
                <div className="p-4 border-t border-amber-600/30">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white font-bold">
                            {user?.email?.[0].toUpperCase() || 'A'}
                        </div>
                        {sidebarOpen && (
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                    {user?.email || 'Admin'}
                                </p>
                                <button
                                    onClick={handleLogout}
                                    className="text-xs text-gray-400 hover:text-amber-400 transition-colors"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto bg-black">
                <Outlet />
            </main>
        </div>
    );
}

