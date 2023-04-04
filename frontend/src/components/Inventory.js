import React, { useEffect, useState } from 'react';

import CharacterModal from './CharacterModal';
import MonsterModal from './MonsterModal';
import MonsterList from './MonsterList';

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

    const doLogout = (event) => {
        event.preventDefault();
        localStorage.removeItem('user_data');
        window.location.href = '/';
    };

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
            <div className="inventory">
                <div>
                    {/* <span id="userName">
                        Logged In As {name} <br />
                        score: {score}
                    </span>
                    <br /> */}
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
                        setScore={setScore}
                    />
                )}
                {monster}
            </div>
        </>
    );
}

export default Inventory;
