import React from 'react';

/**
 * Card Component
 * Reusable card component for consistent layout
 */
function Card({ 
    children, 
    title = '', 
    subtitle = '',
    className = '' 
}) {
    return (
        <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
            {(title || subtitle) && (
                <div className="px-6 py-4 border-b border-gray-200">
                    {title && (
                        <h3 className="text-xl font-semibold text-gray-800">
                            {title}
                        </h3>
                    )}
                    {subtitle && (
                        <p className="text-sm text-gray-600 mt-1">
                            {subtitle}
                        </p>
                    )}
                </div>
            )}
            
            <div className="px-6 py-4">
                {children}
            </div>
        </div>
    );
}

export default Card;
