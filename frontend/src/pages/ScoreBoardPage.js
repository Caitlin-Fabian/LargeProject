import React from 'react';
import PageTitle from '../components/PageTitle';
import Login from '../components/Login';
import NavBar from '../components/NavBar';
import Scoreboard from '../components/Scoreboard';

const ScoreBoardPage = () => {
    return (
        <>
            <div className="scoreboard">
                <NavBar activeLink="Scoreboard" />
                <Scoreboard />
            </div>
        </>
    );
};
export default ScoreBoardPage;
