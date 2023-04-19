import React from 'react';
import NavBar from '../components/NavBar';
import Profile from '../components/Profile';
const ProfilePage = () => {
    return (
        <>
            <div>
                <NavBar activeLink="profile" />
                <Profile />
            </div>
        </>
    );
};
export default ProfilePage;
