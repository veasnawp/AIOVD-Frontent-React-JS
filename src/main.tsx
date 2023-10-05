import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import App from './App.tsx'
import App from './App'
import { SettingsProvider } from './context/SettingsProvider';
import { gapiLoaded } from './configs/blogger/google.connect.ts';
// import './index.css'

// ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
//   <React.StrictMode>
//     <SettingsProvider>
//       <App/>
//     </SettingsProvider>
//   </React.StrictMode>,
// );

gapiLoaded();
ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <SettingsProvider>
        <Routes>
          <Route path="/*" element={<App />} />
        </Routes>
      </SettingsProvider>
    </BrowserRouter>
  </React.StrictMode>,
);