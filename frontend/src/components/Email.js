import React, { useState } from 'react';
import RICIBs from 'react-individual-character-input-boxes';

const Email = () => {
    const handleOutput = (string) => {
        console.log(string);
    };
    return (
        <div className="d-flex justify-content-center ">
            <div className="Email-container d-flex justify-content-center flex-column text-center">
                <h1
                    className="mt-2"
                    style={{ fontSize: '2rem' }}
                >
                    EMAIL VERIFICATION
                </h1>
                <p>Please enter the code from your email</p>
                <div>
                    <RICIBs
                        amount={6}
                        autoFocus
                        handleOutputString={handleOutput}
                        inputProps={[{ className: 'first-box' }]}
                        inputRegExp={/^[0-9]$/}
                    />
                </div>
                <div>
                    <button className="clkbtn">Verify Email</button>
                </div>
            </div>
        </div>
    );
};
export default Email;
