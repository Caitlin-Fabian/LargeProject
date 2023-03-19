import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import pokeball from '../assets/Balls.svg';

function Login() {
    var newName;
    var newUsername;
    var newPassword;
    var newEmail;
    var bp = require('./Path.js');
    const [message, setMessage] = useState('');

    const doRegister = async (event) => {
        event.preventDefault();
        var obj = {
            name: newName.value,
            username: newUsername.value,
            password: newPassword.value,
            email: newEmail.value,
        };
        var js = JSON.stringify(obj);
        console.log(js);
        try {
            const response = await fetch(bp.buildPath('api/register'), {
                method: 'POST',
                body: js,
                headers: { 'Content-Type': 'application/json' },
            });
            var res = JSON.parse(await response.text());
            if (res.id <= 0) {
                console.log(res);
                console.log('res is 1');
                // setMessage('User/Password combination incorrect');
            } else {
                console.log(res);
                console.log('res id < 0');
                // var user = {
                //     firstName: res.firstName,
                //     lastName: res.lastName,
                //     id: res.id,
                // };
                // localStorage.setItem('user_data', JSON.stringify(user));
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
            <div
                id="Register"
                className="d-flex justify-content-center align-content-center"
            >
                <div className="title">
                    <h1>UCF GO</h1>
                </div>
                <div className="text-center login p-4 rounded">
                    <form onSubmit={doRegister}>
                        <h2>REGISTER</h2>
                        <label>
                            Name:
                            <br />
                            <input
                                type="text"
                                id="newName"
                                className="rounded mb-3 text-left"
                                placeholder="Firstname Lastname"
                                ref={(c) => (newName = c)}
                            />
                        </label>
                        <br />
                        <label>
                            Username:
                            <br />
                            <input
                                type="text"
                                id="newUsername"
                                className="rounded mb-3 text-left"
                                placeholder="Username"
                                ref={(c) => (newUsername = c)}
                            />
                        </label>

                        <br />
                        <label>
                            Email:
                            <br />
                            <input
                                type="text"
                                id="newEmail"
                                className="rounded mb-3 text-left"
                                placeholder="Email"
                                ref={(c) => (newEmail = c)}
                            />
                        </label>

                        <br />
                        <label>
                            Password:
                            <br />
                            <input
                                type="password"
                                className="rounded mb-3"
                                id="newPassword"
                                placeholder="Password"
                                ref={(c) => (newPassword = c)}
                            />
                        </label>
                        <br />
                        <span>
                            <button
                                type="button"
                                className="btn btn-link"
                            >
                                <Link to="/">Login</Link>
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
                            className="buttons"
                            value="Register"
                            onClick={doRegister}
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
