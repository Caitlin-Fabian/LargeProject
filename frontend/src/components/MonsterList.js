import React, { useEffect, useState } from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Slider from 'react-slick';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

function MonsterList() {
    var bp = require('./Path.js');
    var _ud = localStorage.getItem('user_data');
    var ud = JSON.parse(_ud);
    console.log(ud);
    var userId = ud.id;

    console.log(userId);
    const [monsters, setMonsters] = useState([]);
    const [monsterList, setMonsterList] = useState([]);
    const [chosenPicture, setChosenPicture] = useState(0);
    const [chosenName, setChosenName] = useState('Choose A Monster');
    const [choseDescription, setChosenDescription] = useState('');
    const [chosen, setChosen] = useState(false);
    const [message, setMessage] = useState('');

    const handleSelect = (selectedIndex, e) => {
        console.log(selectedIndex);

        let monster = monsters.find((monster) => monster._id === selectedIndex);
        console.log(monster);
        if (monsterList.includes(selectedIndex)) {
            setChosenPicture(monster._id);
            setChosenName(monster.Name);
            setChosenDescription(monster.Description);
            setChosen(true);
        }
    };

    const handleName = (id) => {
        if (monsterList.includes(id)) {
            let monster = monsters.find((monster) => monster._id === id);
            console.log(monster);
            return <h3> {monster.Name}</h3>;
        } else {
            return <h3>?</h3>;
        }
    };

    const renderSlides = () =>
        monsters.map((monster) => (
            <div className="d-flex align-items-center flex-column bg-white w-75 mx-auto m-4 rounded shadow-lg">
                <img
                    onClick={() => handleSelect(monster._id)}
                    src={require(`../assets/${monster._id}.png`)}
                    alt="character design"
                    className={`mx-auto w-50 ${monsterList.includes(monster._id) ? '' : 'silhouette'}`}
                    style={{ objectFit: "cover" }}
                ></img>
                {handleName(monster._id)}
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

            if (res.error) {
                setMessage('API Error:' + res.error);
            } else {
                storage.storeToken(res.jwtToken);
                setMonsterList(res.monsters);
                var user = {
                    Name: ud.Name,
                    score: res.Score,
                    id: ud.id,
                };
                localStorage.setItem('user_data', JSON.stringify(user));
            }
        } catch (e) {
            setMessage(e.toString());
        }
    };

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
            setMessage(e.toString());
        }
    };
    useEffect(() => {
        getUser(userId);
        getMonsters();
    }, [chosenPicture]);

    return (
        <div style ={{ position: "relative", justifyContent: "center"}}  >
          
            <div className="d-flex justify-content-center" style={{ width: '100%',height: "350px" }}>
            {chosen && (<Card
                    className="shadow d-flex justify-content-center"
                    style={{ width: '16rem',height: "350px"  }}
                >
                    {chosenPicture > 0 && (
                        <Card.Img
                            variant="top"
                            src={require(`../assets/${chosenPicture}.png`)}
                            className="w-50 mx-auto"
                            // style={{ height: "250px", objectFit: "cover" }}
                            
                        />
                    )}
                    <Card.Body>
                        <Card.Title className="text-center">
                            {chosenName}
                        </Card.Title>
                        <Card.Text className="text-center">
                            {choseDescription}
                        </Card.Text>
                    </Card.Body>
                </Card>)}
                
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
                <Slider
                    dots={true}
                    slidesToShow={4}
                    slidesToScroll={1}
                    autoplay={false}
                    style={{ top: "75px",width: "95%"}}
                >
                    {renderSlides()}
                </Slider>
            </div>
        </div>
    );
}
export default MonsterList;
