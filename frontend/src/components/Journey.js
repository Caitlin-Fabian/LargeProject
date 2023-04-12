import React, { useState, useEffect, useMemo } from 'react';
import PageTitle from '../components/PageTitle';
import Login from '../components/Login';
import NavBar from '../components/NavBar';
import {
    GoogleMap,
    useLoadScript,
    Marker,
    InfoWindow,
} from '@react-google-maps/api';
import '../App.css';
import monsters from '../components/monsters';

const ucf = { lat: 28.60117044744501, lng: -81.20031305970772 };

const redIcon = `https://maps.google.com/mapfiles/ms/icons/red-dot.png`;
const greenIcon = `https://maps.google.com/mapfiles/ms/icons/green-dot.png`;

const Journey = () => {
    var bp = require('./Path.js');

    let locations = [];
    var _ud = localStorage.getItem('user_data');
    var ud = JSON.parse(_ud);
    var userId = ud.id;
    const [userMonsterList, setMonsterList] = useState([]);
    const [icons, setIcons] = useState([]);
    const [message, setMessage] = useState('');
    const [mapReady, setMapReady] = useState(false);
    const [activeMarker, setActiveMarker] = useState(null);

    const handleMapReady = () => {
        setMapReady(true);
    };

    const handleActiveMarker = (marker) => {
        console.log(marker);
        if (marker === activeMarker) {
            return;
        }
        setActiveMarker(marker);
    };

    const markerIcon = async (visited) => {
        let ret = {
            scaledSize: new window.google.maps.Size(40, 40), // size of the icon
            origin: new window.google.maps.Point(0, 0), // origin of the icon
            anchor: new window.google.maps.Point(20, 40), // anchor point of the icon
            url: visited ? greenIcon : redIcon,
        };
        console.log(ret.pincolor);
        return ret;
    };

    const createIcons = async () => {
        //console.log(userMonsterList);
        for (let x = 0; x < monsters.length; x++) {
            let icon = await markerIcon(
                userMonsterList.includes(monsters[x].id)
            );

            locations.push({
                key: monsters[x].id,
                position: monsters[x].pos,
                icon: icon,
            });
        }
        setIcons(locations);
    };

    const getUserMonsters = async (userId) => {
        var storage = require('../tokenStorage.js');
        var obj = {
            userId: userId,
            jwtToken: storage.retrieveToken(),
        };
        var js = JSON.stringify(obj);
        console.log(js);
        try {
            const response = await fetch(bp.buildPath('api/getUserInfo'), {
                method: 'POST',
                body: js,
                headers: { 'Content-Type': 'application/json' },
            });
            var res = JSON.parse(await response.text());

            if (res.error) {
                setMessage('API Error:' + res.error);
            } else {
                storage.storeToken(res.jwtToken);
                setMonsterList(res.monsters);
                var user = {
                    Name: ud.Name,
                    score: res.Score,
                    id: ud.id,
                };
                localStorage.setItem('user_data', JSON.stringify(user));
            }
        } catch (e) {
            setMessage(e.toString());
        }
    };

    useEffect(() => {
        getUserMonsters(userId);
    }, []);

    useEffect(() => {
        if (userMonsterList.length !== 0) {
            createIcons();
        }
    }, [userMonsterList]);

    const ucf = useMemo(
        () => ({ lat: 28.60117044744501, lng: -81.20031305970772 }),
        []
    );

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_MAPS_API_KEY,
    });
    if (!isLoaded) return <div>Loading...</div>;
    return (
        <>
            <div>
                <NavBar />
                <PageTitle />
                Journey
            </div>
            <GoogleMap
                onClick={() => setActiveMarker(null)}
                zoom={17}
                center={ucf}
                options={{
                    mapId: process.env.REACT_APP_MAPS_ID_KEY,
                    disableDefaultUI: true,
                    draggable: false,
                }}
                clickableIcons={false}
                onLoad={handleMapReady}
                mapContainerClassName="map-container"
            >
                {mapReady &&
                    icons.map((marker) => (
                        <Marker
                            key={marker.key}
                            position={marker.position}
                            icon={marker.icon}
                            onClick={() => handleActiveMarker(marker)}
                            {...(activeMarker === marker.key ? (
                                <InfoWindow
                                    onCloseClick={() => setActiveMarker(null)}
                                >
                                    <div>{marker.key}</div>
                                </InfoWindow>
                            ) : null)}
                        />
                    ))}
            </GoogleMap>
        </>
    );
};
export default Journey;
