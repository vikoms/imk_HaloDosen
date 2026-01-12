import React from 'react';

/**
 * Alert Component
 * Display messages with different types
 */
function Alert({ type = 'info', message, onClose }) {
    const types = {
        success: 'bg-green-100 text-green-700 border-green-400',
        error: 'bg-red-100 text-red-700 border-red-400',
        warning: 'bg-yellow-100 text-yellow-700 border-yellow-400',
        info: 'bg-blue-100 text-blue-700 border-blue-400'
    };

    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ'
    };

    return (
        <div className={`flex items-center justify-between p-4 mb-4 border rounded-lg ${types[type]}`}>
            <div className="flex items-center">
                <span className="text-xl mr-3">{icons[type]}</span>
                <span>{message}</span>
            </div>
            {onClose && (
                <button
                    onClick={onClose}
                    className="text-xl hover:opacity-70 transition-opacity"
                >
                    ×
                </button>
            )}
        </div>
    );
}

export default Alert;
