import React from 'react';
import PageTitle from '../components/PageTitle';
import Login from '../components/Login';
import NavBar from '../components/NavBar';
import Scoreboard from '../components/Scoreboard';

const ScoreBoardPage = () => {
    return (
        <>
            <div>
                <NavBar />
                <Scoreboard />
            </div>
        </>
    );
};
export default ScoreBoardPage;
