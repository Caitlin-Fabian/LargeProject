import React, { useState } from 'react';
import RICIBs from 'react-individual-character-input-boxes';
import { buildPath } from './Path';

const Email = () => {
    const [token, setToken] = useState('');
    var bp = require('./Path.js');

    const handleOutput = (string) => {
        setToken(string);
    };

    const verifyEmail = async () => {
        var obj = {
            token: token,
        };

        var js = JSON.stringify(obj);
        console.log(js);
        try {
            const response = await fetch(bp.buildPath('api/verifyEmail'), {
                method: 'POST',
                body: js,
                headers: { 'Content-Type': 'application/json' },
            });
            var res = JSON.parse(await response.text());
            console.log(res);
            if (res.error === 'N/A') {
                alert('You are now verified');
                window.location.href = '/';
            }
        } catch (e) {
            console.log(e.toString());
        }
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
                        amount={5}
                        autoFocus
                        handleOutputString={handleOutput}
                        inputProps={[{ className: 'first-box' }]}
                        inputRegExp={/^[0-9]$/}
                    />
                </div>
                <div>
                    <button
                        className="clkbtn"
                        onClick={verifyEmail}
                    >
                        Verify Email
                    </button>
                </div>
            </div>
        </div>
    );
};
export default Email;
