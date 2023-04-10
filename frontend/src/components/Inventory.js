import React, { useEffect, useState } from 'react';

import CharacterModal from './CharacterModal';
import MonsterModal from './MonsterModal';
import MonsterList from './MonsterList';
import Container from 'react-bootstrap/esm/Container';

function Inventory() {
    var _ud = localStorage.getItem('user_data');
    console.log(_ud);
    var ud = JSON.parse(_ud);
    console.log(ud);
    var userId = ud.id;
    // var Name = ud.Name;
    var monster;
    const [characterModal, setCharacterModal] = useState(false);
    const [monsterModal, setMonsterModal] = useState(false);
    const [score, setScore] = useState(ud.score);

    /* This renders monsterlist if the modals are hidden.
       This means that the player has chosen their character and monster */
    if (!characterModal && !monsterModal) {
        monster = <MonsterList />;
    }

    useEffect(() => {
        if (score === 0) {
            setCharacterModal(true);
        }
    }, [score]);

    return (
        <>
            <Container
                fluid
                className="inventory"
            >
                {characterModal && (
                    <CharacterModal
                        id={userId}
                        setMonsterModal={setMonsterModal}
                        setCharacterModal={setCharacterModal}
                    />
                )}
                {monsterModal && (
                    <MonsterModal
                        id={userId}
                        setMonsterModal={setMonsterModal}
                        setScore={setScore}
                    />
                )}
                {monster}
            </Container>
        </>
    );
}

export default Inventory;
