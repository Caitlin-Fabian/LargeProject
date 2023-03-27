import React from 'react';
import Container from 'react-bootstrap/esm/Container';
import Row from 'react-bootstrap/esm/Row';
import Col from 'react-bootstrap/esm/Col';

function Profile() {
    return (
        <Container
            fluid
            className="profile"
        >
            <Row>
                <Col>
                    <div>
                        <p>Name </p>
                        <p>Score</p>
                    </div>
                    <div>Picture</div>
                </Col>
                <Col>HEllo</Col>
            </Row>
        </Container>
    );
}
export default Profile;
