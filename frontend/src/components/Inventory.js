import React, { useEffect, useState } from 'react';

import CharacterModal from './CharacterModal';
import MonsterModal from './MonsterModal';
import MonsterList from './MonsterList';
import Container from 'react-bootstrap/esm/Container';

function Inventory() {
    var bp = require('./Path.js');
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
    const [message, setMessage] = useState('');
    const [character, setCharacter] = useState();

    const getUser = async () => {
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
                setMessage('API Error:' + res.error);
            } else {
                storage.storeToken(res.jwtToken);
                console.log(res.character);
                setCharacter(res.character);
            }
        } catch (e) {
            setMessage(e.toString());
        }
    };

    /* This renders monsterlist if the modals are hidden.
       This means that the player has chosen their character and monster */
    if (!characterModal) {
        monster = <MonsterList />;
    }

    useEffect(() => {
        getUser();
    }, []);
    useEffect(() => {
        if (character === 0) {
            console.log();
            console.log(character);
            setCharacterModal(true);
        }
    }, [character]);

    return (
        <>
            <Container
                fluid
                className="inventory"
            >
                {characterModal && (
                    <CharacterModal
                        id={userId}
                        setCharacterModal={setCharacterModal}
                    />
                )}
                {monster}
            </Container>
        </>
    );
}

export default Inventory;
