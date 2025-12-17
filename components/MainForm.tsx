
import React, { useState, useEffect, useCallback } from 'react';
import { Country, COUNTRIES, Recommendation } from '../types';
import { EXAMPLE_CURRICULUM, EXAMPLE_DEVICES } from '../constants';
import * as storageService from '../services/storageService';
import * as geminiService from '../services/geminiService';
import * as googleSheetsService from '../services/googleSheetsService';
import { generateRecommendationsPdf } from '../utils/csvHelper';
import RegisterModal from './RegisterModal';
import LoadingSpinner from './LoadingSpinner';
import Alert from './Alert';

interface MainFormProps {
    onAdminClick: () => void;
}

const MainForm: React.FC<MainFormProps> = ({ onAdminClick }) => {
    const [curriculum, setCurriculum] = useState('');
    const [devices, setDevices] = useState('');
    const [country, setCountry] = useState<Country | ''>('');
    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<Recommendation[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [frameworks, setFrameworks] = useState<{[key: string]: string}>({});

    useEffect(() => {
        const loadFrameworks = async () => {
            const data = await storageService.getFrameworks();
            setFrameworks(data);
        };
        loadFrameworks();
    }, []);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!curriculum || !devices || !country) {
            setError("Por favor, complete todos los campos.");
            return;
        }
        
        setIsLoading(true);
        setResults(null);
        setError(null);

        try {
            const frameworkContent = frameworks[country];
            if (!frameworkContent) {
                throw new Error("No se encontró el marco normativo para el país seleccionado.");
            }
            const responseText = await geminiService.generateRecommendations(curriculum, devices, frameworkContent, country);
            const parsedResponse = JSON.parse(responseText);
             if (!parsedResponse.recomendaciones) {
                throw new Error("La respuesta de la IA no tuvo el formato esperado. Intenta ajustar tu consulta.");
            }
            setResults(parsedResponse.recomendaciones);
        } catch (err: any) {
            setError(err.message || 'Ocurrió un error inesperado. Revisa la consola para más detalles.');
            console.error("Generation failed:", err);
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleDownloadRequest = () => {
      setIsModalOpen(true);
    };

    const handleDownloadConfirm = async (userInfo: { school: string; name: string; email: string; }) => {
        // 1. Save to local storage (existing functionality)
        await storageService.addDownloadRecord(userInfo);
        
        // 2. Send to Google Sheets (new functionality)
        // We don't await this blocking the UI, or we treat it as a side effect
        googleSheetsService.logDownloadToSheet(userInfo);

        // 3. Generate PDF (existing functionality)
        if(results) {
            generateRecommendationsPdf(results);
        }
        setIsModalOpen(false);
    };

    const renderResults = () => {
        if (!results) {
            return <p className="text-slate-500 text-center p-4">Aquí aparecerán las recomendaciones de la IA.</p>;
        }
        
        return results.map((rec, index) => (
            <div key={index} className="p-4 mb-4 border-b border-slate-200 last:border-b-0">
                <h4 className="font-bold text-indigo-700">{rec.objetivo_curricular}</h4>
                <div className="mt-3 space-y-2 text-sm">
                    <p><strong className="text-slate-600">Actividad Sugerida:</strong> {rec.actividad_edtech}</p>
                    <p><strong className="text-slate-600">Herramientas:</strong> {rec.herramientas_digitales}</p>
                    <p><strong className="text-slate-600">Justificación Pedagógica:</strong> {rec.justificacion_pedagogica}</p>
                    <p><strong className="text-slate-600">Alineación Normativa:</strong> {rec.alineacion_marco_normativo}</p>
                </div>
            </div>
        ));
    };

    return (
        <div className="bg-white p-6 md:p-8 rounded-2xl shadow-xl">
            <form onSubmit={handleGenerate} className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">1. Cargar Información</h3>
                        <div className="mt-2 p-4 border border-slate-200 rounded-lg space-y-4">
                            <div>
                                <label htmlFor="curriculum-input" className="text-sm font-medium text-slate-700">Plan Curricular</label>
                                <button type="button" onClick={() => setCurriculum(EXAMPLE_CURRICULUM)} className="text-xs text-indigo-600 font-semibold hover:underline float-right">Usar texto de ejemplo</button>
                                <textarea id="curriculum-input" rows={8} value={curriculum} onChange={(e) => setCurriculum(e.target.value)} className="mt-1 w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Pegue aquí los objetivos de su currículo, uno por línea..." required></textarea>
                            </div>
                            <div>
                                <label htmlFor="devices-input" className="text-sm font-medium text-slate-700">Dispositivos Disponibles</label>
                                 <button type="button" onClick={() => setDevices(EXAMPLE_DEVICES)} className="text-xs text-indigo-600 font-semibold hover:underline float-right">Usar texto de ejemplo</button>
                                <textarea id="devices-input" rows={3} value={devices} onChange={(e) => setDevices(e.target.value)} className="mt-1 w-full p-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" placeholder="Ej: 30 tablets iPad, 15 laptops Chromebook, 1 proyector por aula." required></textarea>
                            </div>
                        </div>
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-slate-800">2. Marco Normativo</h3>
                        <select id="country-select" value={country} onChange={(e) => setCountry(e.target.value as Country)} className="mt-2 w-full p-2 border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500" required>
                            <option value="">Seleccionar País...</option>
                            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div>
                        <button type="submit" disabled={isLoading} className="w-full bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-indigo-700 transition flex items-center justify-center disabled:bg-indigo-400 disabled:cursor-not-allowed">
                            {isLoading ? <LoadingSpinner/> : <span>Generar Recomendaciones</span>}
                        </button>
                    </div>
                     {error && <Alert message={error} type="error" onClose={() => setError(null)} />}
                </div>

                <div className="space-y-4">
                    <h3 className="text-xl font-bold text-slate-800">3. Recomendaciones Generadas</h3>
                    {isLoading && (
                        <div className="text-center py-8">
                            <div className="flex justify-center items-center">
                                <LoadingSpinner />
                                <p className="text-slate-600 ml-3">Analizando y generando ideas... esto puede tardar un momento.</p>
                            </div>
                        </div>
                    )}
                    <div id="results-container" className={`bg-slate-50 rounded-lg border h-[400px] overflow-y-auto ${isLoading ? 'hidden' : ''}`}>
                       {renderResults()}
                    </div>
                    {results && (
                        <button type="button" onClick={handleDownloadRequest} className="w-full bg-slate-700 text-white font-semibold py-2 px-4 rounded-lg hover:bg-slate-800 transition">
                            4. Descargar como PDF
                        </button>
                    )}
                </div>
            </form>
            
            {isModalOpen && (
                <RegisterModal 
                    onClose={() => setIsModalOpen(false)} 
                    onSubmit={handleDownloadConfirm} 
                />
            )}
        </div>
    );
};

export default MainForm;