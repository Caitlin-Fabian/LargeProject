import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import pokeball from '../assets/Balls.svg';

function Login() {
    var loginName;
    var loginPassword;
    var bp = require('./Path.js');
    const [message, setMessage] = useState('');

    const doLogin = async (event) => {
        event.preventDefault();
        var obj = { username: loginName.value, password: loginPassword.value };
        var js = JSON.stringify(obj);
        // console.log(js);
        try {
            const response = await fetch(bp.buildPath('api/login'), {
                method: 'POST',
                body: js,
                headers: { 'Content-Type': 'application/json' },
            });
            var res = JSON.parse(await response.text());
            console.log(res);

            if (res.id <= 0) {
                setMessage('User/Password combination incorrect');
            } else {
                var user = {
                    name: res.name,
                    score: res.score,
                    id: res.id,
                };
                localStorage.setItem('user_data', JSON.stringify(user));
                setMessage('');
                window.location.href = '/inventory';
            }
        } catch (e) {
            alert(e.toString());
            return;
        }
    };
    return (
        <>
            <div className="d-flex justify-content-center align-content-center">
                <div className="title">
                    <h1>UCF GO</h1>
                </div>
                <div
                    id="loginDiv"
                    className="text-center login p-4 rounded"
                >
                    <form onSubmit={doLogin}>
                        <h2>LOG IN</h2>
                        <label>
                            Username:
                            <br />
                            <input
                                type="text"
                                id="loginName"
                                className="rounded mb-3 text-left"
                                placeholder="Username"
                                ref={(c) => (loginName = c)}
                            />
                        </label>

                        <br />
                        <label>
                            Password:
                            <br />
                            <input
                                type="password"
                                className="rounded mb-3"
                                id="loginPassword"
                                placeholder="Password"
                                ref={(c) => (loginPassword = c)}
                            />
                        </label>
                        <br />
                        <span>
                            <button
                                type="button"
                                className="btn btn-link"
                            >
                                <Link to="/registration">Register</Link>
                            </button>
                            or
                            <button
                                type="button"
                                className="btn btn-link"
                            >
                                Forgot Password
                            </button>
                        </span>
                        <br />
                        <input
                            type="submit"
                            id="loginButton"
                            className="buttons"
                            value="Log In"
                            onClick={doLogin}
                        />
                    </form>
                    <span id="loginResult">{message}</span>{' '}
                </div>
                <div className="pokeball-outline"></div>
                <img
                    src={pokeball}
                    className="pokeball"
                    alt="yellow and white pokeball"
                ></img>
            </div>
        </>
    );
}
export default Login;
