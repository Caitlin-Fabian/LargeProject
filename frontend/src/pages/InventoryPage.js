import React from 'react';
import NavBar from '../components/NavBar';
import Inventory from '../components/Inventory';

const InventoryPage = () => {
    return (
        <div className="inventory">
            <NavBar />
            <Inventory />
        </div>
    );
};
export default InventoryPage;
