import React, { useState, useEffect } from 'react';
function Scoreboard() {
    const [message, setMessage] = useState('');
    var bp = require('./Path.js');
    const showleaderBoard = async () => {
        try {
            const response = await fetch(bp.buildPath('api/leaderboard'), {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
            });
            var res = JSON.parse(await response.text());
            console.log(res);

            if (res.userList <= 0) {
                setMessage('This are no players');
            } else {
                console.log(res.userList);
            }
        } catch (e) {
            alert(e.toString());
            return;
        }
    };
    useEffect(() => {
        showleaderBoard();
    }, []);

    return (
        <div>
            <p>hello</p>
        </div>
    );
}
export default Scoreboard;
