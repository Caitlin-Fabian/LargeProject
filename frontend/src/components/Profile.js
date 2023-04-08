import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';

import { monsters } from './monsters';

function Profile() {
    var _ud = localStorage.getItem('user_data');
    var ud = JSON.parse(_ud);
    console.log(ud);
    var userId = ud.id;

    console.log(userId);
    const [message, setMessage] = useState('');
    const [name, setName] = useState('');
    const [score, setScore] = useState(ud.score);
    const [monsterList, setMonsterList] = useState([]);
    const [character, setCharacter] = useState('boy');
    var bp = require('./Path.js');

    var teams = [
        {
            id: 1,
            title: 'Male',
            picture: 'boy',
        },
        {
            id: 2,
            title: 'Female',
            picture: 'girl',
        },
    ];

    const getUser = async (userId) => {
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
            console.log(res);

            setName(res.Name);
            setScore(res.score);
            setMonsterList(res.monsters);
            let obj = teams.find((o) => o.character === res.character).picture;
            setCharacter(obj);
            console.log(character);
        } catch (e) {
            setMessage(e.toString());
        }
    };

    useEffect(() => {
        getUser(userId);
    }, []);

    return (
        <Container className="profile">
            <Row>
                <Col>
                    <div className="d-flex name-tag">
                        <h2 className="p-3">{name}</h2>
                        <h3 className="p-3">Score : {score}</h3>
                    </div>
                    <div className="d-flex justify-content-center">
                        <img
                            src={require(`../assets/${character}.png`)}
                            className="w-50 mx-auto"
                            alt="Character choice"
                        />
                    </div>
                </Col>
                <Col>
                    <div className="monsters">
                        <h2 className="p-3">Monsters </h2>
                        <div></div>
                    </div>
                    {monsterList.map((monster, i) => {
                        return (
                            <Row
                                key={i}
                                className="d-flex text-center p-4 leaderboard-ele m-2 shadow-lg"
                            >
                                <Col className="text-start">
                                    <div>{monster}</div>
                                </Col>
                                <Col>
                                    <div>{monster.Username}</div>
                                </Col>
                                <Col>
                                    <div>{monster.Score}</div>
                                </Col>
                            </Row>
                        );
                    })}
                </Col>
            </Row>
        </Container>
    );
}
export default Profile;
