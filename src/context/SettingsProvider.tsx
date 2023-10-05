import { createContext, useState } from "react";

const SettingsContext = createContext({});

type SettingsProviderProps = {
  children?: React.ReactNode,
}

export const SettingsProvider = ({ children }: SettingsProviderProps) => {
    const [settings, setSettings] = useState({});

    return (
        <SettingsContext.Provider value={{ settings, setSettings }}>
          {children}
        </SettingsContext.Provider>
    )
}

export default SettingsContext;