import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Homepage from './components/Homepage';
import Officers from './components/Officers';
import Locations from './components/Locations';
import Socks from './components/Socks';
import History from './components/History';
import SpecificHistory from './components/SpecificHistory';
import App from './App';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="/" element={<Homepage />} />
          <Route path=":id" element={<SpecificHistory />} />
          <Route path="/officers" element={<Officers />} />
          <Route path="/locations" element={<Locations />} />
          <Route path="/socks" element={<Socks />} />
          <Route path="/history" element={<History />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
