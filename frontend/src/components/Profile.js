import React, { useEffect, useState } from 'react';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';

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
    var bp = require('./Path.js');

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
            console.log(res.Name);
            setScore(res.score);
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
                    <div className="">Picture</div>
                </Col>
                <Col>
                    <div className="monsters">
                        <h2 className="p-3">Monsters </h2>
                        <div></div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}
export default Profile;
