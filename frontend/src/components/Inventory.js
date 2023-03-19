import React, { useEffect, useState } from 'react';

import CharacterModal from './CharacterModal';
import MonsterModal from './MonsterModal';
import MonsterList from './MonsterList';

function Inventory() {
    var _ud = localStorage.getItem('user_data');
    var ud = JSON.parse(_ud);
    var userId = ud.id;
    var name = ud.name;
    var monster;
    const [characterModal, setCharacterModal] = useState(false);
    const [monsterModal, setMonsterModal] = useState(false);

    const [score, setScore] = useState(ud.score);

    const doLogout = (event) => {
        event.preventDefault();
        localStorage.removeItem('user_data');
        window.location.href = '/';
    };

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
            <div className="bg-secondary inventory">
                <div>
                    <span id="userName">
                        Logged In As {name} <br />
                        score: {score}
                    </span>
                    <br />
                    <button
                        type="button"
                        id="logoutButton"
                        className="buttons"
                        onClick={doLogout}
                    >
                        {' '}
                        Log Out{' '}
                    </button>
                </div>
                {characterModal && (
                    <CharacterModal
                        setMonsterModal={setMonsterModal}
                        setCharacterModal={setCharacterModal}
                    />
                )}
                {monsterModal && (
                    <MonsterModal
                        id={userId}
                        setMonsterModal={setMonsterModal}
                    />
                )}
                {monster}
            </div>
        </>
    );
}

export default Inventory;
