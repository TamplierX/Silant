import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import { UserProvider } from './context/userContext.js';
import App from './App.jsx';

const root = document.getElementById('root');

ReactDOM.createRoot(root).render(
    <StrictMode>
        <UserProvider>
            <App />
        </UserProvider>
    </StrictMode>,
);
