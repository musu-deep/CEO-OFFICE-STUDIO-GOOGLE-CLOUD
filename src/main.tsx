import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AraakIntegratedApp from './AraakIntegratedApp';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AraakIntegratedApp />
  </StrictMode>,
);
