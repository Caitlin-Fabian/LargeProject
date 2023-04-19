import React, { useState } from 'react';
import * as Mdicons from 'react-icons/md';

const CharacterModal = ({ setScore, id, setMonsterModal }) => {
    var bp = require('./Path.js');
    console.log('userid:' + id);
    const [selectedId, setSelectedId] = useState(0);
    const [monsters, setMonsters] = useState([]);

    useState(() => {
        getMonsters();
    }, []);

    const getMonsters = async () => {
        try {
            const response = await fetch(bp.buildPath('api/getMonsterList'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });

            var res = JSON.parse(await response.text());
            console.log(res.monsterList);
            setMonsters(res.monsterList);
        } catch (e) {
            //setMessage(e.toString());
        }
    };

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
        <div className="CharModal d-flex flex-column justify-content-around">
            <div className=" d-flex justify-content-center flex-column container text-center ">
                <h1>Inventory</h1>
                <div className="d-flex flex-row justify-content-around">
                    {monsters.map((card) => (
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
                                style={{ marginLeft: '20px' }}
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
                Sumbit
                <Mdicons.MdKeyboardArrowRight />
            </button>
        </div>
    );
};
export default CharacterModal;
