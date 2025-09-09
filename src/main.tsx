import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { ToastProvider } from './store/ToastContext.tsx';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n.ts';
import { ThemeProvider } from './store/ThemeProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <I18nextProvider i18n={i18n}>
        <ToastProvider>
          <App />
        </ToastProvider>
      </I18nextProvider>
    </ThemeProvider>
  </StrictMode>
);
