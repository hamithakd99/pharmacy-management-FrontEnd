
export interface PharmacyDocumentSettings {
  pharmacyName: string;
  address: string;
  phone: string;
  email: string;
  logoUrl: string;
  footerMessage: string;
}

export interface DocumentPaperSettings {
  width: number;
  height: number;
  unit: "pt";
}

export const CONTINUOUS_PAPER: DocumentPaperSettings = {
  width: 684,
  height: 792,
  unit: "pt",
};

export const DEFAULT_PHARMACY_SETTINGS: PharmacyDocumentSettings = {
  pharmacyName: import.meta.env.VITE_PHARMACY_NAME,
  address: import.meta.env.VITE_PHARMACY_ADDRESS,
  phone: import.meta.env.VITE_PHARMACY_PHONE,
  email: import.meta.env.VITE_PHARMACY_EMAIL,
  logoUrl: import.meta.env.VITE_PHARMACY_LOGO_URL,
  footerMessage: import.meta.env.VITE_PHARMACY_FOOTER_MESSAGE,
};
