import React, { useState, useEffect, useMemo } from 'react';

import {
    GoogleMap,
    useLoadScript,
    Marker,
    InfoWindow,
} from '@react-google-maps/api';
import '../App.css';
//import monsters from '../components/monsters';

const ucf = { lat: 28.60117044744501, lng: -81.20031305970772 };

const redIcon = `https://icon-library.com/images/google-map-location-icon/google-map-location-icon-20.jpg`;
const greenIcon = `https://play-lh.googleusercontent.com/5WifOWRs00-sCNxCvFNJ22d4xg_NQkAODjmOKuCQqe57SjmDw8S6VOSLkqo6fs4zqis=w480-h960-rw`;

const Journey = () => {
    var bp = require('./Path.js');

    let locations = [];
    var _ud = localStorage.getItem('user_data');
    var ud = JSON.parse(_ud);
    var userId = ud.id;
    const [userMonsterList, setMonsterList] = useState([]);
    const [icons, setIcons] = useState([]);
    const [message, setMessage] = useState('');
    const [activeMarker, setActiveMarker] = useState(null);
    const [monsters, setMonsters] = useState(null);
    // const [monsterLength, setMonsterLength] = useState

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
        console.log(ret.url);
        return ret;
    };

    const createIcons = async () => {
        await getAllMonsters().then(async () => {
            let length = await monsters.length;
            for (let x = 0; x < length; x++) {
                let icon = await markerIcon(
                    userMonsterList.includes(monsters[x]._id)
                );
                console.log(parseInt(monsters[x].lat));
                locations.push({
                    key: monsters[x]._id,
                    position: {
                        lat: parseFloat(monsters[x].lat),
                        lng: parseFloat(monsters[x].lng),
                    },
                    name: monsters[x].Name,
                    icon: icon,
                    location: monsters[x].Location,
                });
            }
            setIcons(locations);
            console.log(locations);
        });
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

    const getAllMonsters = async () => {
        try {
            const response = await fetch(bp.buildPath('api/getMonsterList'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            var res = JSON.parse(await response.text());
            console.log(res.monsterList);
            setMonsters(res.monsterList);
        } catch (e) {
            setMessage(e.toString());
        }
    };

    const handleName = (marker) => {
        if (userMonsterList.includes(marker.key)) {
            return (
                <>
                    <p className="infoText">
                        {' '}
                        {marker.name} <br />
                        {marker.location}
                    </p>
                </>
            );
        } else {
            return <h3>?</h3>;
        }
    };

    useEffect(() => {
        getAllMonsters();
        getUserMonsters(userId);
    }, []);

    useEffect(() => {
        createIcons();
    }, [userMonsterList]);

    const ucf = useMemo(
        () => ({ lat: 28.60117044744501, lng: -81.20031305970772 }),
        []
    );

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_MAPS_API_KEY,
    });
    if (!(isLoaded && icons !=[])) return <div>Loading...</div>;
    return (
        <>
            <div className="d-flex justify-content-center m-4 ">
                <GoogleMap
                    onClick={() => setActiveMarker(null)}
                    zoom={15.5}
                    center={ucf}
                    options={{
                        mapId: process.env.REACT_APP_MAPS_ID_KEY,
                        disableDefaultUI: true,
                        draggable: true,
                    }}
                    clickableIcons={false}
                    mapContainerClassName="map-container"
                >
                    {icons.map((marker) => (
                        <Marker
                            key={marker.key}
                            position={marker.position}
                            icon={marker.icon}
                            onClick={() => handleActiveMarker(marker.key)}
                        >
                            {activeMarker === marker.key ? (
                                <InfoWindow
                                    className="infoWindow"
                                    onCloseClick={() => setActiveMarker(null)}
                                >
                                    <div className="infoWindow d-flex flex-column text-center">
                                        <img
                                            src={require(`../assets/${marker.key}.png`)}
                                            alt="character design"
                                            className={`mx-auto w-50 ${
                                                userMonsterList.includes(
                                                    marker.key
                                                )
                                                    ? ''
                                                    : 'silhouette'
                                            }`}
                                        ></img>
                                        {handleName(marker)}
                                    </div>
                                </InfoWindow>
                            ) : null}
                        </Marker>
                    ))}
                </GoogleMap>
            </div>
        </>
    );
};
export default Journey;
