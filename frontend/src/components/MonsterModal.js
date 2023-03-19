import React, { useState } from 'react';

import citronaut from '../assets/citronaut.png';
import pegasus from '../assets/pegasus.png';
import knightro from '../assets/knightro.png';

const CharacterModal = ({ setScore, id, setMonsterModal }) => {
    console.log('userid:' + id);

    var teams = [
        {
            id: 8,
            title: 'Pegasus',
            picture: pegasus,
        },
        {
            id: 6,
            title: 'Knightro',
            picture: knightro,
        },
        {
            id: 7,
            title: 'Citronaut',
            picture: citronaut,
        },
    ];

    const [selectedId, setSelectedId] = useState(null);

    const addMonster = async (id, score) => {
        var bp = require('./Path.js');
        var obj = {
            monsterID: selectedId,
            userID: id,
            monsterScore: score,
        };
        var js = JSON.stringify(obj);
        // console.log(js);
        try {
            const response = await fetch(bp.buildPath('api/giveMonster'), {
                method: 'POST',
                body: js,
                headers: { 'Content-Type': 'application/json' },
            });
            var res = JSON.parse(await response.text());
            console.log(res);

            // if (res) {
            //     // setMessage('User/Password combination incorrect');
            // } else {
            //     var user = {
            //         name: res.name,
            //         score: res.score,
            //         id: res.id,
            //     };
            //     localStorage.setItem('user_data', JSON.stringify(user));
            //     // setMessage('');
            //     window.location.href = '/inventory';
            // }
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
                                className="card-img-top w-50"
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
