import React from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Pages
import LoginPage from './pages/LoginPage';
import CardPage from './pages/CardPage';

// CSS files
import './css/login.scss';
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
        <Route
          path="/cards"
          index
          element={<CardPage />}
        />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
