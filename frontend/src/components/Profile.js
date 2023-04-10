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
    const [usersMonsters, setUsersMonsters] = useState([]);
    const [monsterList, setMonsterList] = useState([]);
    const [character, setCharacter] = useState('boy');
    const [monsterDisplay, setMonsterDisplay] = useState([]);
    var bp = require('./Path.js');
    var firstResponse = false;
    var secondResponse = false;

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

    const getMonsters = async () => {
        try {
            const response = await fetch(bp.buildPath('api/getMonsterList'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            var res = JSON.parse(await response.text());
            console.log(res.monsterList);
            setMonsterList(res.monsterList);
            this.firstResponse = true;
            displayMonsters();
        } catch (e) {
            setMessage(e.toString());
        }
    };

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
            setUsersMonsters(res.monsters);
            let obj = teams.find((o) => o.character === res.character).picture;
            setCharacter(obj);
            this.secondResponse = true;
            displayMonsters();
        } catch (e) {
            setMessage(e.toString());
        }
    };

    const displayMonsters = () => {
        console.log(usersMonsters);
        for (let i = 0; i < usersMonsters.length; i++) {
            console.log(usersMonsters[i]);
            let monster = monsterList.filter(
                (mon) => mon._id === usersMonsters[i]
            );
            console.log(monster[0]);
            setMonsterDisplay((monsterDisplay) => [
                ...monsterDisplay,
                monster[0],
            ]);
        }
    };
    const doLogout = (event) => {
        event.preventDefault();
        localStorage.removeItem('user_data');
        window.location.href = '/';
    };

    useEffect(() => {
        getUser(userId);
        getMonsters();
    }, []);

    useEffect(() => {
        if (usersMonsters.length > 0) {
            displayMonsters();
        }
    }, [monsterList]);

    return (
        <Container className="profile">
            <button
                type="button"
                id="logoutButton"
                className="buttons"
                onClick={doLogout}
            >
                {' '}
                Log Out{' '}
            </button>
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
                    {monsterDisplay.map((monster, i) => {
                        return (
                            <Row
                                key={i}
                                className="d-flex text-center leaderboard-ele m-2 shadow-lg"
                            >
                                <Col className="position-relative ball-background m-2">
                                    <img
                                        src={require(`../assets/${monster._id}.png`)}
                                        className="position-relative z-5 monster"
                                        alt="Monster Caught"
                                    />
                                </Col>

                                <Col className="d-flex justify-content-center align-items-center">
                                    <div>{monster.Name}</div>
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
