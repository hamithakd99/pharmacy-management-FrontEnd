import { useState } from "react";
import {
  DEFAULT_PHARMACY_SETTINGS,
  type PharmacyDocumentSettings,
} from "../utils/document.types";

export default function useDocumentSettings() {
  const [settings, setSettings] =
    useState<PharmacyDocumentSettings>(() => ({
      ...DEFAULT_PHARMACY_SETTINGS,
    }));

  const updateSetting = <K extends keyof PharmacyDocumentSettings>(
    key: K,
    value: PharmacyDocumentSettings[K]
  ) => {
    setSettings((previous) => ({
      ...previous,
      [key]: value,
    }));
  };

  return {
    settings,
    setSettings,
    updateSetting,
  };
}