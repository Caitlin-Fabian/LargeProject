import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function Scoreboard() {
    const [message, setMessage] = useState('');
    const [topPlayers, setTopPlayers] = useState([]);
    var bp = require('./Path.js');
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

                setTopPlayers(res.userList);
            }
        } catch (e) {
            alert(e.toString());
            return;
        }
    };
    useEffect(() => {
        showleaderBoard();
    }, []);

    return (
        <div>
            <Container>
                <Row>
                    <Col>Hello1</Col>
                </Row>
                <Row>
                    <Col>Hello2</Col>
                    <Col>Hello3</Col>
                </Row>
            </Container>
        </div>
    );
}
export default Scoreboard;
