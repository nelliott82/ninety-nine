import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import OutletContainer from './components/OutletContainer.jsx';
import LandingMessageComponent from './components/LandingMessage.jsx';
import App from './components/App.jsx';
import AppHumans from './components/AppHumans.jsx';
import Customization from './components/Customization.jsx';
import Room from './components/Room.jsx';

var root = createRoot(document.getElementById("app"));

root.render(
  <BrowserRouter>
    <Routes>
      <Route path="" element={<OutletContainer/>}>
        <Route path="/" element={<LandingMessageComponent/>} />
        <Route path="/select" element={<App/>}/>
        <Route path="room/:roomCode" element={<AppHumans/>} />
        <Route path="computers" element={<AppHumans/>} />
        <Route path="site-customization" element={<Customization/>} />
      </Route>
    </Routes>
  </BrowserRouter>
);
