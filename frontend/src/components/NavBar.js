import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Pokeball from '../assets/Balls.svg';

function BasicExample() {
    return (
        <Navbar
            bg="dark"
            variant="dark"
        >
            <Container>
                <Navbar.Brand href="/inventory">
                    <img
                        alt="UCF Go logo"
                        src={Pokeball}
                        width="30"
                        height="30"
                        className="d-inline-block align-top me-3"
                    />
                    UCF GO
                </Navbar.Brand>
            </Container>
            <div>
                <Nav className="me-5 text-nowrap align ">
                    <Nav.Link href="/inventory">Inventory</Nav.Link>
                    <Nav.Link href="/journey">Journey</Nav.Link>
                    <Nav.Link href="/Scoreboard">Score Board</Nav.Link>
                    <Nav.Link href="/profile">profile</Nav.Link>
                </Nav>
            </div>
        </Navbar>
    );
}

export default BasicExample;
