import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Slider from 'react-slick';
import { monsters } from './monsters';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function MonsterList() {
    var bp = require('./Path.js');
    var _ud = localStorage.getItem('user_data');
    var ud = JSON.parse(_ud);
    console.log(ud);
    var userId = ud.id;

    console.log(userId);
    const [monsterList, setMonsterList] = useState([]);
    const [chosenPicture, setChosenPicture] = useState('');
    const [chosenName, setChosenName] = useState('Choose A Monster');
    const [choseDescription, setChosenDescription] = useState('');
    const [chosen, setChosen] = useState(false);
    const [message, setMessage] = useState('');

    const handleSelect = (selectedIndex, e) => {
        console.log(selectedIndex);
        let monster = monsters.find((monster) => monster.id === selectedIndex);
        if (monsterList.includes(selectedIndex)) {
            console.log(monster);
            let result = monster;
            setChosenPicture(result.picture);
            setChosenName(result.title);
            setChosenDescription(result.description);
            setChosen(true);
        }
    };

    const handleName = (id) => {
        if (monsterList.includes(id)) {
            let monster = monsters.find((monster) => monster.id === id);
            console.log(monster);
            return <h3> {monster.title}</h3>;
        } else {
            return <h3>?</h3>;
        }
    };

    const renderSlides = () =>
        monsters.map((monster) => (
            <div className="d-flex align-items-center flex-column">
                <img
                    onClick={() => handleSelect(monster.id)}
                    src={monster.picture}
                    alt="character design"
                    className={`mx-auto ${chosen ? 'w-25' : 'w-50'} ${
                        monsterList.includes(monster.id) ? '' : 'silhouette'
                    }`}
                ></img>
                {handleName(monster.id)}
            </div>
        ));

    const getUser = async (userId) => {
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
            console.log(res.monsters);
            setMonsterList(res.monsters);
            var user = {
                Name: ud.Name,
                score: res.Score,
                id: ud.id,
            };
            localStorage.setItem('user_data', JSON.stringify(user));
        } catch (e) {
            setMessage(e.toString());
        }
    };
    useEffect(() => {
        getUser(userId);
    }, []);

    return (
        <div className="container d-flex flex-column">
            <div className="d-flex justify-content-center">
                <Card
                    className="shadow"
                    style={{ width: '18rem' }}
                >
                    <Card.Img
                        variant="top"
                        src={chosenPicture}
                        className="w-50 mx-auto"
                    />
                    <Card.Body>
                        <Card.Title className="text-center">
                            {chosenName}
                        </Card.Title>
                        <Card.Text className="text-center">
                            {choseDescription}
                        </Card.Text>
                    </Card.Body>
                </Card>
            </div>
            <div>
                <Slider
                    dots={true}
                    slidesToShow={3}
                    slidesToScroll={1}
                    autoplay={false}
                >
                    {renderSlides()}
                </Slider>
            </div>
        </div>
    );
}
export default MonsterList;
