import React from 'react';
import PageTitle from '../components/PageTitle';
import Login from '../components/Login';
import NavBar from '../components/NavBar';
import Profile from '../components/Profile';
const ProfilePage = () => {
    return (
        <>
            <div>
                <NavBar />
                <Profile />
            </div>
        </>
    );
};
export default ProfilePage;
