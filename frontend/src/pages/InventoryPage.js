import React from 'react';
import PageTitle from '../components/PageTitle';
import LoggedInName from '../components/LoggedInName';
// import CardUI from '../components/CardUI';
import NavBar from '../components/NavBar';
const InventoryPage = () => {
    return (
        <div>
            <NavBar />
            <LoggedInName />
            {/* <CardUI /> */}
        </div>
    );
};
export default InventoryPage;
