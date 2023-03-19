import React, { useState } from 'react';

import girl from '../assets/girl_character.png';
import boy from '../assets/boy_character.png';

const CharacterModal = ({ setMonsterModal, setCharacterModal }) => {
    var teams = [
        {
            id: 1,
            title: 'Male',
            picture: boy,
        },
        {
            id: 2,
            title: 'Female',
            picture: girl,
        },
    ];

    const [selectedId, setSelectedId] = useState(null);

    const handleNext = () => {
        setCharacterModal(false);
        setMonsterModal(true);
    };

    return (
        <div className="CharModal d-flex flex-column">
            <div className=" d-flex justify-content-center flex-column container">
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
                                className="card-img-top w-75"
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
                value="Choose"
                onClick={handleNext}
            >
                Next
            </button>
        </div>
    );
};
export default CharacterModal;
