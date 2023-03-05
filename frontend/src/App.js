import React from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Pages
import LoginPage from './pages/LoginPage';
import CardPage from './pages/CardPage';
import InventoryPage from './pages/InventoryPage';

// CSS files
import './css/login.scss';
import './css/Navbar.scss';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          index
          element={<LoginPage />}
        />
        {/* <Route
          path="/cards"
          index
          element={<CardPage />}
        /> */}
        <Route
          path="/inventory"
          index
          element={<InventoryPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
