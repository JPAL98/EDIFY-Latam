import React from 'react';

interface AlertProps {
    message: string;
    type: 'error' | 'success' | 'warning' | 'info';
    onClose?: () => void;
}

const Alert: React.FC<AlertProps> = ({ message, type, onClose }) => {
    const baseClasses = "p-4 rounded-lg flex items-center justify-between text-sm";
    const typeClasses = {
        error: "bg-red-100 border border-red-300 text-red-800",
        success: "bg-green-100 border border-green-300 text-green-800",
        warning: "bg-yellow-100 border border-yellow-300 text-yellow-800",
        info: "bg-blue-100 border border-blue-300 text-blue-800",
    };
    
    const iconClasses = {
        error: "text-red-500",
        success: "text-green-500",
        warning: "text-yellow-500",
        info: "text-blue-500",
    }

    return (
        <div className={`${baseClasses} ${typeClasses[type]}`} role="alert">
            <div className="flex items-center">
                 <svg className={`w-5 h-5 mr-3 fill-current ${iconClasses[type]}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M10 0C4.48 0 0 4.48 0 10s4.48 10 10 10 10-4.48 10-10S15.52 0 10 0zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-5h2v2h-2v-2zm0-8h2v6h-2V5z"/>
                </svg>
                <span>{message}</span>
            </div>

            {onClose && (
                <button onClick={onClose} className={`-mr-1 p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 ${iconClasses[type]}`} aria-label="Cerrar">
                     <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            )}
        </div>
    );
};

export default Alert;
