import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App.jsx';

var root = createRoot(document.getElementById("app"));

root.render(<App />);
