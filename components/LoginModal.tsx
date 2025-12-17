
import React, { useState } from 'react';

interface LoginModalProps {
    onClose: () => void;
    onLoginSuccess: () => void;
}

const ADMIN_PASSWORD = "edify"; // Simple hardcoded password

const LoginModal: React.FC<LoginModalProps> = ({ onClose, onLoginSuccess }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === ADMIN_PASSWORD) {
            onLoginSuccess();
        } else {
            setError('Contraseña incorrecta.');
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Acceso de Administrador</h2>
                <p className="text-slate-500 mb-6">Ingresa la contraseña para continuar.</p>
                <form onSubmit={handleLogin}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700">Contraseña</label>
                            <input 
                                type="password" 
                                id="password" 
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                className="mt-1 w-full p-2 border border-slate-300 rounded-lg" 
                                required 
                            />
                        </div>
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                    </div>
                    <div className="mt-8 flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="bg-slate-100 text-slate-700 font-semibold py-2 px-4 rounded-lg hover:bg-slate-200">Cancelar</button>
                        <button type="submit" className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-indigo-700">Ingresar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginModal;
