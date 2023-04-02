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
    var bp = require('./Path.js');
    var Topscores;
    const showleaderBoard = async () => {
        try {
            const response = await fetch(bp.buildPath('api/leaderboard'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            var res = JSON.parse(await response.text());
            console.log(res);

            if (res.userList <= 0) {
                setMessage('This are no players');
            } else {
                console.log(res.userList);
                setShowPlayers(true);
                setTopPlayers(res.userList);
            }
        } catch (e) {
            alert(e.toString());
            return;
        }
    };

    if (showPlayers) {
        Topscores = <TopPlayer topPlayers={topPlayers} />;
    }

    useEffect(() => {
        showleaderBoard();
    }, []);

    return <div>{Topscores}</div>;
}
export default Scoreboard;
