import React from 'react';

/**
 * Button Component
 * Reusable button component with different variants
 */
function Button({ 
    children, 
    onClick, 
    variant = 'primary', 
    type = 'button',
    disabled = false,
    className = ''
}) {
    const baseClasses = 'px-4 py-2 rounded font-medium transition-colors';
    
    const variants = {
        primary: 'bg-blue-500 text-white hover:bg-blue-600 disabled:bg-blue-300',
        secondary: 'bg-gray-500 text-white hover:bg-gray-600 disabled:bg-gray-300',
        success: 'bg-green-500 text-white hover:bg-green-600 disabled:bg-green-300',
        danger: 'bg-red-500 text-white hover:bg-red-600 disabled:bg-red-300',
        outline: 'border-2 border-blue-500 text-blue-500 hover:bg-blue-50 disabled:border-blue-300 disabled:text-blue-300'
    };

    const classes = `${baseClasses} ${variants[variant]} ${className}`;

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={classes}
        >
            {children}
        </button>
    );
}

export default Button;
