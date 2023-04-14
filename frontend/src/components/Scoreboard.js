import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import one from '../assets/Leader1.svg';
import two from '../assets/Leader2.svg';
import three from '../assets/Leader3.svg';

import TopPlayer from './TopPlayers';

function Scoreboard() {
    const [message, setMessage] = useState('');
    const [showPlayers, setShowPlayers] = useState(false);
    const [topPlayers, setTopPlayers] = useState([]);
    const [players, setPlayers] = useState([]);
    var bp = require('./Path.js');

    var _ud = localStorage.getItem('user_data');
    console.log(_ud);
    var ud = JSON.parse(_ud);
    console.log(ud);
    var userId = ud.id;

    var Topscores;
    const showleaderBoard = async () => {
        var storage = require('../tokenStorage.js');

        try {
            var obj = {
                userId: userId,
                jwtToken: storage.retrieveToken(),
            };

            var js = JSON.stringify(obj);

            const response = await fetch(bp.buildPath('api/getUserList'), {
                method: 'POST',
                body: js,
                headers: { 'Content-Type': 'application/json' },
            });
            var res = JSON.parse(await response.text());
            console.log(res);

            if (res.error) {
                setMessage('API error' + res.error);
            } else {
                storage.storeToken(res.jwtToken);
                if (res.userList <= 0) {
                    setMessage('This are no players');
                } else {
                    console.log(res.userList);
                    var topThree = res.userList.slice(0, 3);
                    console.log(topThree);
                    setShowPlayers(true);
                    setTopPlayers(topThree);
                    setPlayers(res.userList);
                }
            }
        } catch (e) {
            alert(e.toString());
            return;
        }
    };

    if (showPlayers) {
        Topscores = (
            <TopPlayer
                players={players}
                topPlayers={topPlayers}
            />
        );
    }

    useEffect(() => {
        showleaderBoard();
    }, []);

    return <div>{Topscores}</div>;
}
export default Scoreboard;
