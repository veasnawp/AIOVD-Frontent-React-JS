import { useContext, useDebugValue } from "react";
import SettingsContext from "../context/SettingsProvider";
import { Prettify } from "../component/mantine/helpers/HelperType";

// import { UserPayload } from "../configs/interfaces/google";
export interface SettingsContextValue extends Record<string, any> {
  folder_history?: string;
  videoDownloadedData?: any[];
  videoLinks?: string;
  videoConvertData?: any[];
}

export interface SettingsContextType {
  settings: Prettify<SettingsContextValue>;
  setSettings: (value: Prettify<SettingsContextValue>) => void;
}

export type UseSettingsContextType = [
  Prettify<SettingsContextValue>,
  (setValue: Prettify<SettingsContextValue>) => void,
]

const useSettings = () => {
    const { settings } = useContext(SettingsContext) as SettingsContextType;
    useDebugValue(settings, auth => auth ? "Logged In" : "Logged Out")
    return useContext(SettingsContext) as Prettify<SettingsContextType>;
}

export default useSettings;