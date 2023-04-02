import React from 'react';

import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import one from '../assets/Leader1.svg';
import two from '../assets/Leader2.svg';
import three from '../assets/Leader3.svg';

function TopPlayer(props) {
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
                <Col className="position-absolute d-flex justify-content-center align-items-center text-center">
                    <div className="placement">
                        <h1>#1</h1>
                        <h2>{props.topPlayers['0'].Name}</h2>
                        <h3>{props.topPlayers['0'].Score}</h3>
                    </div>
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
                        className="position-absolute my-auto d-flex align-items-center placement flex-column"
                    >
                        <h1>#2</h1>
                        <h2>{props.topPlayers['1'].Name}</h2>
                        <h3>{props.topPlayers['1'].Score}</h3>
                    </div>
                </Col>
                <Col className="position-relative d-flex justify-content-center my-auto">
                    <img
                        style={{ width: '90%' }}
                        src={three}
                        alt="Ranking Decoration"
                    ></img>
                    <div className="position-absolute d-flex align-items-center placement flex-column">
                        <h1>#3</h1>
                        <h2>{props.topPlayers['2'].Name}</h2>
                        <h3>{props.topPlayers['2'].Score}</h3>
                    </div>
                </Col>
            </Row>
        </Container>
    );
}

export default TopPlayer;
