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
    const [noMonsters, setNoMonsters] = useState(false);

    const [newName, setNewName] = useState(null);
    const [newUsername, setNewUsername] = useState(null);
    const [newEmail, setNewEmail] = useState(null);
    const [chooseCharacter, setChooseCharacter] = useState(null);

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

            var res = await JSON.parse(await response.text());
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
            var res = await JSON.parse(await response.text());
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
                console.log(res.character);
                let index = res.character - 1;
                setCharacter(teams[index].picture);
                displayMonsters();
            }
        } catch (e) {
            setMessage(e.toString());
        }
    };

    const handleSave = async () => {
        try {
            console.log(chooseCharacter);
            console.log(newUsername);
            const obj = {
                character: chooseCharacter,
                username: newUsername,
                email: newEmail,
                name: newName,
                userId: userId,
            };

            const js = JSON.stringify(obj);

            console.log(js);
            const response = await fetch(bp.buildPath('api/updateUser'), {
                method: 'POST',
                body: js,
                headers: { 'Content-Type': 'application/json' },
            });
            var res = JSON.parse(await response.text());
            console.log(res);
            if (res.error === '') {
                window.location.reload(false);
            } else {
                setMessage(res.error);
            }
        } catch (e) {
            alert(e.toString());
            return;
        }
    };

    const displayMonsters = () => {
        console.log('user monsters ' + usersMonsters);
        let newPush = [];
        for (let i = 0; i < usersMonsters.length; i++) {
            console.log(usersMonsters[i]);
            let monster = monsterList.filter(
                (mon) => mon._id === usersMonsters[i]
            );
            if (monster.length === 0) {
                continue;
            }
            console.log('eyy baka' + monster[0]._id);
            newPush.push(monster[0]);
        }
        setMonsterDisplay(newPush);
    };

    const onInputName = (e) => {
        setNewName(e.target.value);
    };
    const onInputEmail = (e) => {
        setNewEmail(e.target.value);
    };
    const onInputUsername = (e) => {
        setNewUsername(e.target.value);
    };
    const onInputCharacter = (event) => {
        setChooseCharacter(event.target.value);
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
    }, [username, character, score]);

    useEffect(() => {
        if (usersMonsters.length > 0 && monsterList.length > 0) {
            console.log(' There are monsters');
            displayMonsters();
            setNoMonsters(false);
        } else {
            setNoMonsters(true);
        }
    }, [monsterList, usersMonsters]);

    return (
        <Container
            fluid
            className="profile"
        >
            <Row>
                <Col>
                    <div className=" d-flex name-tag justify-content-around h-25 mt-4">
                        <h4 className="p-3">Username : {username}</h4>
                        <h4 className="p-3">Score : {score}</h4>
                        <button
                            className="settings-button"
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
                                <span className="text-danger">{message}</span>
                                <Form>
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder={name}
                                        value={newName}
                                        onChange={onInputName}
                                    />
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder={username}
                                        value={newUsername}
                                        onChange={onInputUsername}
                                    />
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="email"
                                        placeholder={email}
                                        value={newEmail}
                                        onChange={onInputEmail}
                                    />
                                </Form>
                                <Form.Group controlId="kindOfStand">
                                    <img
                                        src={require(`../assets/boy.png`)}
                                        className="w-25 mx-auto"
                                        alt="Character choice"
                                    />
                                    <Form.Check
                                        inline
                                        value="1"
                                        type="radio"
                                        aria-label="radio 1"
                                        label="Character 1"
                                        name="group1"
                                        onChange={onInputCharacter}
                                    />
                                    <img
                                        src={require(`../assets/girl.png`)}
                                        className="w-25 mx-auto"
                                        alt="Character choice"
                                    />
                                    <Form.Check
                                        inline
                                        value="2"
                                        type="radio"
                                        aria-label="radio 2"
                                        label="Character 2"
                                        name="group1"
                                        onChange={onInputCharacter}
                                    />
                                </Form.Group>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button
                                    variant="primary"
                                    className="text-black"
                                    onClick={handleSave}
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
                    <div className="row d-flex justify-content-center characterDiv">
                        <img
                            src={require(`../assets/${character}.png`)}
                            className="mx-auto"
                            alt="Character choice"
                        />
                    </div>
                </Col>
                <Col>
                    <div className=" text-center shadow monsters mt-4">
                        <h2 className="p-3">Monsters </h2>
                    </div>
                    <div className="overflow-auto monsterDiv">
                        {noMonsters ? (
                            <div className="display">
                                <p>Start your journey!</p>
                            </div>
                        ) : (
                            monsterDisplay.map((monster, i) => {
                                return (
                                    <Row
                                        key={i}
                                        className="d-flex text-center leaderboard-ele m-2 shadow-lg rounded"
                                    >
                                        <Col
                                            lg={3}
                                            className="position-relative ball-background m-2"
                                        >
                                            <img
                                                src={require(`../assets/${monster._id}.png`)}
                                                className="position-relative z-5 monster"
                                                alt="Monster Caught"
                                            />
                                        </Col>

                                        <Col className="d-flex justify-content-center monster-name align-items-center">
                                            <h2>{monster.Name}</h2>
                                        </Col>
                                    </Row>
                                );
                            })
                        )}
                    </div>
                </Col>
            </Row>
        </Container>
    );
}
export default Profile;
