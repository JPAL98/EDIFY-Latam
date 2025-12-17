import React, { useState, useEffect, useCallback } from 'react';
import { Country, COUNTRIES, DownloadRecord, FrameworkData } from '../types';
import * as storageService from '../services/storageService';
import { generateDownloadsReportPdf } from '../utils/csvHelper';
import Alert from './Alert';

interface AdminPanelProps {
    onBackToMain: () => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ onBackToMain }) => {
    const [frameworks, setFrameworks] = useState<FrameworkData>({});
    const [selectedCountry, setSelectedCountry] = useState<Country | ''>('');
    const [currentFrameworkContent, setCurrentFrameworkContent] = useState('');
    const [saveStatus, setSaveStatus] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
    const [downloadRecords, setDownloadRecords] = useState<DownloadRecord[]>([]);

    const fetchData = useCallback(async () => {
        const fwData = await storageService.getFrameworks();
        setFrameworks(fwData);
        const recordsData = await storageService.getDownloadRecords();
        setDownloadRecords(recordsData);
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        if (selectedCountry && frameworks[selectedCountry]) {
            setCurrentFrameworkContent(frameworks[selectedCountry]);
        } else {
            setCurrentFrameworkContent('');
        }
    }, [selectedCountry, frameworks]);
    
    const handleSaveFramework = async () => {
        if (!selectedCountry) return;
        setSaveStatus({ message: 'Guardando...', type: 'info' });
        try {
            await storageService.saveFramework(selectedCountry, currentFrameworkContent);
            setSaveStatus({ message: 'Cambios guardados con éxito.', type: 'success' });
            // Refresh frameworks data
            const updatedFrameworks = await storageService.getFrameworks();
            setFrameworks(updatedFrameworks);
        } catch (error: any) {
            setSaveStatus({ message: `Error al guardar: ${error.message}`, type: 'error' });
            console.error("Failed to save framework:", error);
        }
    };
    
    const handleDownloadReport = () => {
        if(downloadRecords.length > 0) {
            generateDownloadsReportPdf(downloadRecords);
        }
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl space-y-12">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-slate-800">Panel de Administración</h2>
                <button onClick={onBackToMain} className="text-sm text-indigo-600 font-semibold hover:underline">Volver a la app</button>
            </div>

            <section>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">Gestionar Marcos Normativos</h3>
                <div className="grid md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="admin-country-select" className="block text-sm font-medium text-slate-700">Seleccionar País</label>
                        <select
                            id="admin-country-select"
                            value={selectedCountry}
                            onChange={(e) => setSelectedCountry(e.target.value as Country)}
                            className="mt-1 w-full p-2 border border-slate-300 rounded-lg bg-white"
                        >
                            <option value="">Elige un país para editar...</option>
                            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="framework-content-input" className="block text-sm font-medium text-slate-700">Contenido del Marco Normativo</label>
                        <textarea
                            id="framework-content-input"
                            rows={10}
                            value={currentFrameworkContent}
                            onChange={(e) => setCurrentFrameworkContent(e.target.value)}
                            className="mt-1 w-full p-2 border border-slate-300 rounded-lg text-sm"
                            placeholder="Selecciona un país para ver o editar el contenido de su marco normativo aquí."
                        ></textarea>
                    </div>
                    <div className="md:col-span-2 space-y-4">
                        <button onClick={handleSaveFramework} className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-indigo-400" disabled={!selectedCountry}>Guardar Cambios</button>
                        {saveStatus && (
                             <Alert 
                                message={saveStatus.message} 
                                type={saveStatus.type} 
                                onClose={() => setSaveStatus(null)}
                            />
                        )}
                    </div>
                </div>
            </section>
            
            <section>
                 <div className="flex justify-between items-center mb-4">
                    <h3 className="text-2xl font-bold text-slate-800">Reporte de Descargas</h3>
                    <button onClick={handleDownloadReport} className="bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-800 transition text-sm disabled:bg-slate-400" disabled={downloadRecords.length === 0}>Descargar Registros (.pdf)</button>
                 </div>
                 <div className="overflow-x-auto border rounded-lg max-h-96">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-slate-200 sticky top-0">
                            <tr>
                                <th className="p-3">Fecha</th>
                                <th className="p-3">Colegio</th>
                                <th className="p-3">Nombre</th>
                                <th className="p-3">Correo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {downloadRecords.length > 0 ? downloadRecords.map(record => (
                                <tr key={record.id} className="border-b last:border-b-0 hover:bg-slate-50">
                                    <td className="p-3">{record.timestamp}</td>
                                    <td className="p-3">{record.school}</td>
                                    <td className="p-3">{record.name}</td>
                                    <td className="p-3">{record.email}</td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={4} className="p-4 text-center text-slate-500">No hay registros de descargas.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
};

export default AdminPanel;