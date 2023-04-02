import React from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Pages
import LoginPage from './pages/LoginPage';
import CardPage from './pages/CardPage';
import InventoryPage from './pages/InventoryPage';
import ProfilePage from './pages/ProfilePage';
import JourneyPage from './pages/JourneyPage';
import ScoreBoardPage from './pages/ScoreBoardPage';

// CSS files
import './css/login.scss';
import './css/Navbar.scss';
import './css/Modal.scss';
import './css/inventory.scss';
import './css/scoreboard.scss';
import './css/profile.scss';
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
                    path="/inventory"
                    index
                    element={<InventoryPage />}
                />
                <Route
                    path="/journey"
                    index
                    element={<JourneyPage />}
                />
                <Route
                    path="/Scoreboard"
                    index
                    element={<ScoreBoardPage />}
                />
                <Route
                    path="/profile"
                    index
                    element={<ProfilePage />}
                />
            </Routes>
        </BrowserRouter>
    );
}
export default App;
