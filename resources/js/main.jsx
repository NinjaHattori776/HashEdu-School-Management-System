import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { registerServiceWorker } from './registerServiceWorker';
import '../css/app.css';

registerServiceWorker();

ReactDOM.createRoot(document.getElementById('app')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
