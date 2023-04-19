import React, { useState } from 'react';

import girl from '../assets/girl.png';
import boy from '../assets/boy.png';
import * as Mdicons from 'react-icons/md';

const CharacterModal = ({ id, setCharacterModal }) => {
    var bp = require('./Path.js');
    var teams = [
        {
            id: 1,
            title: 'Character 1',
            picture: boy,
        },
        {
            id: 2,
            title: 'Character 2',
            picture: girl,
        },
    ];

    const [selectedId, setSelectedId] = useState(0);

    const handleSelectedCharacter = async () => {
        try {
            const obj = {
                character: selectedId,
                name: null,
                username: null,
                userId: id,
                email: null,
            };

            const js = JSON.stringify(obj);

            console.log(js);
            const response = await fetch(bp.buildPath('api/updateUser'), {
                method: 'POST',
                body: js,
                headers: { 'Content-Type': 'application/json' },
            });
            var res = JSON.parse(await response.text());
            console.log(res);
        } catch (e) {
            alert(e.toString());
            return;
        }
    };

    const handleNext = () => {
        handleSelectedCharacter();
        setCharacterModal(false);
    };

    return (
        <div className="CharModal d-flex flex-column justify-content-around ">
            <div className=" d-flex justify-content-around flex-column container">
                <h1>Choose Your Character!</h1>
                <div className="d-flex flex-row justify-content-around">
                    {teams.map((card) => (
                        <div
                            key={card.id}
                            onClick={() => setSelectedId(card.id)}
                            className={`card column 
                            ${
                                selectedId && selectedId !== card.id
                                    ? 'bg-disabled'
                                    : null
                            }
                        `}
                        >
                            <img
                                className="card-img-top character mx-auto"
                                src={card.picture}
                                alt="Character Drawing"
                            />
                            <div>{card.title}</div>
                            <p>{card.value}</p>
                        </div>
                    ))}
                </div>
            </div>
            <button
                onClick={handleNext}
                className="back-button text-end"
            >
                Next
                <Mdicons.MdKeyboardArrowRight />
            </button>
        </div>
    );
};
export default CharacterModal;
