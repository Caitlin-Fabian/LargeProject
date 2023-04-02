import React, { useState } from 'react';
import { monsters } from './monsters';

const CharacterModal = ({ setScore, id, setMonsterModal }) => {
    console.log('userid:' + id);
    const starters = monsters.slice(2);
    const [selectedId, setSelectedId] = useState(0);

    const addMonster = async (id, score) => {
        var bp = require('./Path.js');
        var obj = {
            monsterId: selectedId,
            userId: id,
            monsterScore: score,
        };
        var js = JSON.stringify(obj);
        console.log(js);
        try {
            const response = await fetch(bp.buildPath('api/giveMonster'), {
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
        addMonster(id, 10);
        setScore(10);
        setMonsterModal(false);
    };

    return (
        <div className="CharModal d-flex flex-column">
            <div className=" d-flex justify-content-center flex-column container">
                <h1>Choose Your Monster!</h1>
                <div className="d-flex flex-row justify-content-around">
                    {starters.map((card) => (
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
                                className="card-img-top w-50 mx-auto"
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
