import React, { useState } from 'react';
import RICIBs from 'react-individual-character-input-boxes';
import { buildPath } from './Path';
import * as Mdicons from 'react-icons/md';
import Form from 'react-bootstrap/Form';

const Email = () => {
    const [message, setMessage] = useState('');
    const [email, setEmail] = useState('');
    const [token, setToken] = useState('');
    const [enterEmail, setEnterEmail] = useState(true);
    const [verifyEmail, setVerifyEmail] = useState(false);
    const [password, setPassword] = useState('');
    const [success, setSuccess] = useState(false);
    var bp = require('./Path.js');

    const handleOutput = (string) => {
        setToken(string);
    };
    const sendEmail = async () => {
        var obj = {
            email: email,
        };

        console.log(obj);
        var js = JSON.stringify(obj);
        console.log(js);
        try {
            const response = await fetch(
                bp.buildPath('api/sendForgotPassword'),
                {
                    method: 'POST',
                    body: js,
                    headers: { 'Content-Type': 'application/json' },
                }
            );
            var res = JSON.parse(await response.text());
            console.log(res);
            if (res.error === 'N/A') {
                setEnterEmail(false);
                setVerifyEmail(true);
            } else {
                setMessage(res.error);
            }
        } catch (e) {
            console.log(e.toString());
        }
    };
    const verify = async () => {
        var obj = {
            token: token,
            password: password,
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
                setSuccess(true);
                setVerifyEmail(false);
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

    const handleChange = (e) => {
        e.preventDefault();
        setEmail(e.target.value);
    };

    const handlePassword = (e) => {
        e.preventDefault();
        setPassword(e.target.value);
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
                        Password Recovery
                    </h1>

                    {enterEmail && (
                        <>
                            <p>Please enter your email</p>
                            <Form>
                                <Form.Control
                                    className="w-75 d-flex justify-content-center"
                                    type="Email"
                                    placeholder="Email@email.com"
                                    onChange={handleChange}
                                />
                            </Form>
                            <div>
                                <button
                                    className="clkbtn"
                                    onClick={sendEmail}
                                >
                                    Send Email
                                </button>
                                <br />
                                <span id="loginResult">{message}</span>{' '}
                            </div>
                        </>
                    )}
                    {verifyEmail && (
                        <>
                            <p>Please enter the code from your email</p>
                            <div>
                                <RICIBs
                                    amount={5}
                                    autoFocus
                                    handleOutputString={handleOutput}
                                    inputProps={[{ className: 'first-box' }]}
                                    inputRegExp={/^[a-zA-Z0-9_.-]*$/}
                                />
                                <Form>
                                    <Form.Label>New Password</Form.Label>
                                    <Form.Control
                                        className="w-75 d-flex justify-content-center"
                                        type="Password"
                                        placeholder="password"
                                        onChange={handlePassword}
                                    />
                                </Form>
                            </div>
                            <button
                                className="clkbtn"
                                onClick={verify}
                            >
                                Change Password
                            </button>
                            <span id="loginResult">{message}</span>{' '}
                        </>
                    )}

                    {success && (
                        <>
                            <div>
                                <p>Your Password was successfully changed</p>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};
export default Email;
