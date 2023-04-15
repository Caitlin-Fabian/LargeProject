import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import Form from 'react-bootstrap/Form';

import * as Mdicons from 'react-icons/md';

function Profile() {
    var _ud = localStorage.getItem('user_data');
    var ud = JSON.parse(_ud);
    console.log(ud);
    var userId = ud.id;

    console.log(userId);
    const [message, setMessage] = useState('');
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [score, setScore] = useState(ud.score);
    const [usersMonsters, setUsersMonsters] = useState([]);
    const [monsterList, setMonsterList] = useState([]);
    const [character, setCharacter] = useState('boy');
    const [monsterDisplay, setMonsterDisplay] = useState([]);
    const [settingsModal, setSettingsModal] = useState(false);

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

    const getMonsters = async () => {
        try {
            const response = await fetch(bp.buildPath('api/getMonsterList'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            var res = JSON.parse(await response.text());
            console.log(res.monsterList);
            setMonsterList(res.monsterList);
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

            if (res.error) {
                setMessage('API ERROR:' + res.error);
            } else {
                storage.storeToken(res.jwtToken);
                setName(res.Name);
                setScore(res.score);
                setUsersMonsters(res.monsters);
                setUsername(res.username);
                setEmail(res.Email);
                let obj = teams.find((o) => o.id === res.character).picture;
                setCharacter(obj);
                displayMonsters();
            }
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

    const handleClose = () => setSettingsModal(false);
    const handleShow = () => {
        setSettingsModal(true);
        console.log('Hello');
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
            <Row>
                <Col>
                    <div className="d-flex name-tag justify-content-between">
                        <h2 className="p-3">{name}</h2>
                        <h3 className="p-3">Score : {score}</h3>
                        <button
                            class="settings-button"
                            onClick={handleShow}
                        >
                            <Mdicons.MdSettingsSuggest size={50} />
                        </button>
                        <Modal
                            show={settingsModal}
                            onHide={handleClose}
                        >
                            <Modal.Header closeButton>
                                <Modal.Title>Change Your Settings</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Form>
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="Name"
                                        placeholder={name}
                                    />
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="Name"
                                        placeholder={username}
                                    />
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="Name"
                                        placeholder={email}
                                    />
                                </Form>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button
                                    variant="primary"
                                    className="text-black"
                                    onClick={handleClose}
                                >
                                    Save Changes
                                </Button>
                                <Button
                                    variant="secondary"
                                    className="text-black"
                                    onClick={doLogout}
                                >
                                    Log Out
                                </Button>
                            </Modal.Footer>
                        </Modal>
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
                                className="d-flex text-center leaderboard-ele m-2 shadow-lg rounded"
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
