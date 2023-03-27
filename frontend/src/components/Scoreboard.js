import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import one from '../assets/Leader1.svg';
import two from '../assets/Leader2.svg';
import three from '../assets/Leader3.svg';

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
        <Container className="scoreboard-container justify-content-center">
            <Row className="position-relative d-flex align-items-center">
                <Col className="d-flex justify-content-center">
                    <img
                        style={{ width: '60%' }}
                        src={one}
                        alt="Ranking Decoration"
                    ></img>
                </Col>
                <Col className="position-absolute d-flex justify-content-center align-items-center">
                    <div className="placement"></div>
                </Col>
            </Row>
            <Row className="position-relative d-flex align-items-center">
                <Col className="position-relative d-flex justify-content-center my-auto">
                    <img
                        style={{ width: '100%' }}
                        src={two}
                        alt="Ranking Decoration"
                    ></img>
                    <div
                        style={{ top: '10%' }}
                        className="position-absolute my-auto d-flex align-items-center placement"
                    ></div>
                </Col>
                <Col className="position-relative d-flex justify-content-center my-auto">
                    <img
                        style={{ width: '90%' }}
                        src={three}
                        alt="Ranking Decoration"
                    ></img>
                    <div className="position-absolute d-flex align-items-center placement"></div>
                </Col>
            </Row>
        </Container>
    );
}
export default Scoreboard;
