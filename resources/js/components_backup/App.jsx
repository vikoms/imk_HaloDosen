import React, { useState } from 'react';
import { LoginPage } from './LoginPage.jsx';
import Dashboard from './Dashboard.jsx';
import ApiExample from './ApiExample.jsx';

function App() {
    const [view, setView] = useState('login');
    const [userRole, setUserRole] = useState(null);
    const [count, setCount] = useState(0);

    const handleLogin = (role) => {
        setUserRole(role);
        setView('home');
    };

    const handleLogout = () => {
        setUserRole(null);
        setView('login');
    };

    // Show login page if not logged in
    if (view === 'login') {
        return <LoginPage onLogin={handleLogin} />;
    }

    // Simple client-side routing
    if (view === 'dashboard') {
        return <Dashboard />;
    }

    if (view === 'api') {
        return <ApiExample />;
    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white rounded-lg shadow-lg p-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-4xl font-bold text-gray-800">
                        Welcome to React + Laravel
                    </h1>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm"
                    >
                        Logout
                    </button>
                </div>
                
                <p className="text-center text-gray-500 mb-4">
                    🚀 Successfully integrated with Vite
                </p>

                <div className="bg-blue-50 rounded-lg p-4 mb-6">
                    <p className="text-center text-gray-700">
                        Logged in as: <strong className="text-indigo-600 capitalize">{userRole}</strong>
                    </p>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 mb-6">
                    <div className="text-center mb-4">
                        <p className="text-gray-700 mb-2">
                            ✨ React is successfully integrated with Laravel!
                        </p>
                        <p className="text-sm text-gray-600">
                            Using React <strong>{React.version}</strong> with Vite 7.0
                        </p>
                    </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                    <p className="text-center text-xl font-semibold text-gray-700 mb-4">
                        Interactive Counter: <span className="text-blue-600">{count}</span>
                    </p>
                    <div className="flex gap-3 justify-center flex-wrap">
                        <button
                            onClick={() => setCount(count - 1)}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-sm"
                        >
                            - Decrease
                        </button>
                        <button
                            onClick={() => setCount(0)}
                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors shadow-sm"
                        >
                            Reset
                        </button>
                        <button
                            onClick={() => setCount(count + 1)}
                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors shadow-sm"
                        >
                            + Increase
                        </button>
                    </div>
                </div>

                <div className="space-y-3">
                    <button
                        onClick={() => setView('dashboard')}
                        className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium shadow-sm"
                    >
                        📊 View Dashboard Example
                    </button>

                    <button
                        onClick={() => setView('api')}
                        className="w-full px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-medium shadow-sm"
                    >
                        🔌 View API Integration Example
                    </button>

                    <a
                        href="/"
                        className="block w-full px-4 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors text-center font-medium"
                    >
                        ← Back to Laravel Welcome Page
                    </a>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-200">
                    <p className="text-center text-sm text-gray-600">
                        📚 Lihat <strong>REACT_SETUP.md</strong> untuk dokumentasi lengkap
                    </p>
                </div>
            </div>
        </div>
    );
}

export default App;
