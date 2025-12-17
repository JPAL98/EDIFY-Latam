import { Recommendation, DownloadRecord } from '../types';

// Let TypeScript know about the globals from the CDN
declare const jspdf: any;

const generatePdf = (title: string, head: any[], body: any[][], filename: string) => {
    const doc = new jspdf.jsPDF();

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(18);
    doc.text(title, 14, 22);

    (doc as any).autoTable({
        head: [head],
        body: body,
        startY: 30,
        styles: {
            fontSize: 8,
            cellPadding: 2,
        },
        headStyles: {
            fillColor: [78, 56, 219], // Indigo
            textColor: 255,
            fontStyle: 'bold',
        },
        didDrawPage: (data: any) => {
            const pageCount = doc.internal.getNumberOfPages();
            doc.setFontSize(10);
            doc.text(`Página ${data.pageNumber} de ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.height - 10);
        }
    });

    doc.save(filename);
};

export const generateRecommendationsPdf = (recommendations: Recommendation[]) => {
    const headers = [
        "Objetivo Curricular", 
        "Actividad EdTech", 
        "Herramientas Digitales", 
        "Justificación Pedagógica", 
        "Alineación Marco Normativo"
    ];
    const data = recommendations.map(rec => [
        rec.objetivo_curricular,
        rec.actividad_edtech,
        rec.herramientas_digitales,
        rec.justificacion_pedagogica,
        rec.alineacion_marco_normativo
    ]);

    generatePdf('Recomendaciones EdTech Generadas', headers, data, 'recomendaciones-edtech.pdf');
};

export const generateDownloadsReportPdf = (records: DownloadRecord[]) => {
    const headers = ["Fecha", "Colegio", "Nombre", "Correo"];
    const data = records.map(r => [r.timestamp, r.school, r.name, r.email]);
    
    generatePdf('Reporte de Descargas', headers, data, 'reporte-descargas.pdf');
};