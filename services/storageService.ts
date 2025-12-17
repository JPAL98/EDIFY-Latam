import { Country, DownloadRecord, FrameworkData } from '../types';

const FRAMEWORKS_KEY = 'edtech_frameworks';
const DOWNLOADS_KEY = 'edtech_downloads';

// Initialize with some placeholder data if none exists
const initializeFrameworks = (): FrameworkData => {
    const initialData: FrameworkData = {
        'Perú': 'Contenido del marco normativo de Perú...',
        'Panamá': 'Contenido del marco normativo de Panamá...',
        'Bolivia': 'Contenido del marco normativo de Bolivia...',
        'República Dominicana': 'Contenido del marco normativo de República Dominicana...',
        'El Salvador': 'Contenido del marco normativo de El Salvador...',
        'Guatemala': 'Contenido del marco normativo de Guatemala...',
        'Ecuador': 'Contenido del marco normativo de Ecuador...',
    };
    localStorage.setItem(FRAMEWORKS_KEY, JSON.stringify(initialData));
    return initialData;
};

export const getFrameworks = async (): Promise<FrameworkData> => {
    try {
        const data = localStorage.getItem(FRAMEWORKS_KEY);
        return data ? JSON.parse(data) : initializeFrameworks();
    } catch (error) {
        console.error("Error getting frameworks:", error);
        return initializeFrameworks();
    }
};

export const saveFramework = async (country: Country, content: string): Promise<void> => {
    try {
        const frameworks = await getFrameworks();
        frameworks[country] = content;
        localStorage.setItem(FRAMEWORKS_KEY, JSON.stringify(frameworks));
    } catch (error) {
        console.error("Error saving framework:", error);
        throw new Error("No se pudo guardar en el almacenamiento local. El navegador podría estar en modo privado o el almacenamiento está lleno.");
    }
};

export const getDownloadRecords = async (): Promise<DownloadRecord[]> => {
    try {
        const data = localStorage.getItem(DOWNLOADS_KEY);
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error("Error getting download records:", error);
        return [];
    }
};

export const addDownloadRecord = async (record: Omit<DownloadRecord, 'id' | 'timestamp'>): Promise<void> => {
    try {
        const records = await getDownloadRecords();
        const newRecord: DownloadRecord = {
            ...record,
            id: new Date().getTime().toString(),
            timestamp: new Date().toISOString().split('T')[0],
        };
        records.unshift(newRecord); // Add to the beginning
        localStorage.setItem(DOWNLOADS_KEY, JSON.stringify(records));
    } catch (error) {
        console.error("Error adding download record:", error);
        throw new Error("No se pudo guardar el registro de descarga. El almacenamiento local podría no estar disponible.");
    }
};