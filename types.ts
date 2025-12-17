
export const COUNTRIES = ["Perú", "Panamá", "Bolivia", "República Dominicana", "El Salvador", "Guatemala", "Ecuador"] as const;
export type Country = typeof COUNTRIES[number];

export interface DownloadRecord {
  id: string;
  timestamp: string;
  school: string;
  name: string;
  email: string;
}

export interface FrameworkData {
  [key: string]: string;
}

export interface Recommendation {
    objetivo_curricular: string;
    actividad_edtech: string;
    herramientas_digitales: string;
    justificacion_pedagogica: string;
    alineacion_marco_normativo: string;
}
