import React from 'react';
import ReactDOM from 'react-dom/client'; // Importa createRoot desde 'react-dom/client'
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root')); // Usa createRoot en lugar de ReactDOM.render

root.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
