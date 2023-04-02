import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './components/App.jsx';
import AppHumans from './components/AppHumans.jsx';
import Room from './components/Room.jsx';

var root = createRoot(document.getElementById("app"));

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App/>}>
        <Route path="humans" element={<Room/>}/>
        <Route path="room/:roomCode" element={<AppHumans/>} />
      </Route>
    </Routes>
  </BrowserRouter>
);
