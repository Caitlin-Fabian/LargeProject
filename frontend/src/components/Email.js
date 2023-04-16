import React, { useState } from 'react';
import RICIBs from 'react-individual-character-input-boxes';
import { buildPath } from './Path';
import * as Mdicons from 'react-icons/md';
const Email = () => {
    const [token, setToken] = useState('');
    const [message, setMessage] = useState('');
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
            const response = await fetch(bp.buildPath('api/verify'), {
                method: 'POST',
                body: js,
                headers: { 'Content-Type': 'application/json' },
            });
            var res = JSON.parse(await response.text());
            console.log(res);
            if (res.error === 'N/A') {
                window.location.href = '/';
            } else {
                setMessage(res.error);
            }
        } catch (e) {
            console.log(e.toString());
        }
    };

    const handleBack = () => {
        window.location.href = '/';
    };
    return (
        <div className="d-flex justify-content-center ">
            <div className="Email-container d-flex justify-content-center flex-column justify-content-around">
                <div className="col-1">
                    <button
                        onClick={handleBack}
                        className="back-button"
                    >
                        <Mdicons.MdKeyboardArrowLeft />
                        Login
                    </button>
                </div>
                <div className="col d-flex justify-content-center flex-column text-center">
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
                            inputRegExp={/^[a-zA-Z0-9_.-]*$/}
                        />
                    </div>
                    <div>
                        <button
                            className="clkbtn"
                            onClick={verifyEmail}
                        >
                            Verify Email
                        </button>
                        <br />
                        <span id="loginResult">{message}</span>{' '}
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Email;
