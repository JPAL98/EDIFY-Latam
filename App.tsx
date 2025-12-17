
import React, { useState, useCallback } from 'react';
import MainForm from './components/MainForm';
import AdminPanel from './components/AdminPanel';
import LoginModal from './components/LoginModal';

const App: React.FC = () => {
    const [view, setView] = useState<'main' | 'admin'>('main');
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

    const handleLoginSuccess = useCallback(() => {
        setView('admin');
        setIsLoginModalOpen(false);
    }, []);

    const renderContent = () => {
        switch (view) {
            case 'admin':
                return <AdminPanel onBackToMain={() => setView('main')} />;
            case 'main':
            default:
                return <MainForm onAdminClick={() => setIsLoginModalOpen(true)} />;
        }
    };

    return (
        <div className="max-w-5xl mx-auto p-4 md:p-8">
            <header className="text-center py-12">
                <div className="flex justify-center items-center gap-4">
                    <h1 className="text-4xl md:text-5xl font-bold text-slate-800 tracking-tight">Curriculo + EdTech con IA</h1>
                    <button 
                        onClick={() => view === 'main' ? setIsLoginModalOpen(true) : setView('main')}
                        className="bg-slate-200 text-slate-600 font-semibold py-2 px-4 rounded-lg hover:bg-slate-300 transition text-sm"
                    >
                        {view === 'main' ? 'Equipo Edify' : 'Volver a la App'}
                    </button>
                </div>
                <p className="mt-4 text-lg md:text-xl text-slate-500 max-w-3xl mx-auto">Una plataforma inteligente que enriquece su currículo escolar con actividades EdTech, alineadas a sus recursos y al marco normativo de su país.</p>
            </header>

            <main>
                {renderContent()}
            </main>

            {isLoginModalOpen && (
                <LoginModal
                    onClose={() => setIsLoginModalOpen(false)}
                    onLoginSuccess={handleLoginSuccess}
                />
            )}
        </div>
    );
};

export default App;
