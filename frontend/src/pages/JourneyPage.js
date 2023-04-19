import React from 'react';
import NavBar from '../components/NavBar';
import Journey from '../components/Journey';

export default function App() {
    return (
        <div className="journey">
            <NavBar activeLink="journey" />
            <Journey />
        </div>
    );
}
