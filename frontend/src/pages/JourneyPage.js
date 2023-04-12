import React, { useEffect, useMemo, useState } from 'react';
import PageTitle from '../components/PageTitle';
import Login from '../components/Login';
import NavBar from '../components/NavBar';
import { GoogleMap, useLoadScript, Marker } from '@react-google-maps/api';
import '../App.css';
import monsters from '../components/monsters';
import Journey from '../components/Journey';

const ucf = { lat: 28.60117044744501, lng: -81.20031305970772 };

const redIcon = `https://maps.google.com/mapfiles/ms/icons/red-dot.png`;
const greenIcon = `https://maps.google.com/mapfiles/ms/icons/green-dot.png`;

export default function App() {
    return (
        <div>
            <Journey />
        </div>
    );
}
