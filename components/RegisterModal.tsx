
import React, { useState } from 'react';

interface RegisterModalProps {
    onClose: () => void;
    onSubmit: (data: { school: string; name: string; email: string; }) => void;
}

const RegisterModal: React.FC<RegisterModalProps> = ({ onClose, onSubmit }) => {
    const [school, setSchool] = useState('');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isChecked, setIsChecked] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (school && name && email && isChecked) {
            onSubmit({ school, name, email });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50 transition-opacity duration-300">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 transform transition-all duration-300 scale-100">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Casi listo para la descarga</h2>
                <p className="text-slate-500 mb-6">Por favor, completa tus datos para generar tu reporte.</p>
                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label htmlFor="school-name" className="block text-sm font-medium text-slate-700">Nombre del colegio</label>
                            <input type="text" id="school-name" value={school} onChange={e => setSchool(e.target.value)} className="mt-1 w-full p-2 border border-slate-300 rounded-lg" required />
                        </div>
                        <div>
                            <label htmlFor="person-name" className="block text-sm font-medium text-slate-700">Tu nombre</label>
                            <input type="text" id="person-name" value={name} onChange={e => setName(e.target.value)} className="mt-1 w-full p-2 border border-slate-300 rounded-lg" required />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700">Correo electrónico</label>
                            <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} className="mt-1 w-full p-2 border border-slate-300 rounded-lg" required />
                        </div>
                        <div className="flex items-start">
                            <input id="confirm-check" type="checkbox" checked={isChecked} onChange={e => setIsChecked(e.target.checked)} className="h-4 w-4 text-indigo-600 border-slate-300 rounded mt-1" required />
                            <div className="ml-3 text-sm">
                                <label htmlFor="confirm-check" className="text-slate-600">Confirmo que los datos son correctos.</label>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 flex justify-end gap-4">
                        <button type="button" onClick={onClose} className="bg-slate-100 text-slate-700 font-semibold py-2 px-4 rounded-lg hover:bg-slate-200">Cancelar</button>
                        <button type="submit" className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-300" disabled={!school || !name || !email || !isChecked}>Confirmar y Descargar</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterModal;
