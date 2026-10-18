import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AuthorsDashboard from './Dashboards/AuthorsDashboard';
import './index.css';

function App() {
  return <AuthorsDashboard/>
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
