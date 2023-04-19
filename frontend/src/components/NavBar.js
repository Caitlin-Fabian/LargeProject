import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Pokeball from '../assets/Balls.svg';
import { useState } from 'react';

function BasicExample(props) {
    const [active, setActive] = useState(props.activeLink);
    console.log(active);
    return (
        <Navbar
            bg="dark"
            variant="light"
        >
            <Navbar.Brand href="/inventory">
                <img
                    alt="UCF Go logo"
                    src={Pokeball}
                    width="30"
                    height="30"
                    className="ms-5 d-inline-block align-top me-3"
                />
                UCF GO
            </Navbar.Brand>
            <Navbar
                activeKey={active}
                onSelect={(selectedKey) => {
                    setActive(selectedKey);
                }}
                className="me-5 text-nowrap ms-auto"
            >
                <Nav.Link
                    className={
                        active === 'inventory' ? `greyLink text-white` : null
                    }
                    eventKey="inventory"
                    href="/inventory"
                >
                    Inventory
                </Nav.Link>
                <Nav.Link
                    className={
                        active === 'journey' ? `greyLink text-white` : null
                    }
                    eventKey="journey"
                    href="/journey"
                >
                    Journey
                </Nav.Link>
                <Nav.Link
                    className={
                        active === 'Scoreboard' ? `greyLink text-white` : null
                    }
                    eventKey="Scoreboard"
                    href="/Scoreboard"
                >
                    Score Board
                </Nav.Link>
                <Nav.Link
                    className={
                        active === 'profile' ? `greyLink text-white` : null
                    }
                    eventKey="profile"
                    href="/profile"
                >
                    Profile
                </Nav.Link>
            </Navbar>
        </Navbar>
    );
}

export default BasicExample;
