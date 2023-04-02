import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { useJwt } from 'react-jwt';
import axios from 'axios';
import { isExpired, decodeToken } from 'react-jwt';

import pokeball from '../assets/Balls.svg';

function Login() {
    let newName;
    let newUsername;
    let newPassword;
    let newEmail;
    let loginName;
    let loginPassword;
    let bp = require('./Path.js');
    var storage = require('../tokenStorage.js');

    const [message, setMessage] = useState('');
    const [isLogin, setIsLogin] = useState(false);

    const doLogin = async (event) => {
        event.preventDefault();
        var obj = { username: loginName.value, password: loginPassword.value };
        var js = JSON.stringify(obj);
        console.log(js);
        try {
            var config = {
                method: 'post',
                url: bp.buildPath('api/login'),
                headers: {
                    'Content-Type': 'application/json',
                },
                data: js,
            };

            axios(config).then(function (response) {
                var res = response.data;
                console.log(res);
                if (res.error) {
                    setMessage('User/Password combination incorrect');
                } else {
                    console.log(res);
                    storage.storeToken(res);
                    var ud = decodeToken(storage.retrieveToken());
                    console.log(ud);
                    var id = ud.userID;
                    var Name = ud.Name;
                    var score = ud.Score;

                    var user = {
                        Name: Name,
                        score: score,
                        id: id,
                    };
                    localStorage.setItem('user_data', JSON.stringify(user));
                    window.location.href = '/inventory';
                }
            });
        } catch (e) {
            alert(e.toString());
            return;
        }
    };

    const doRegister = async (event) => {
        event.preventDefault();
        var obj = {
            name: newName.value,
            username: newUsername.value,
            password: newPassword.value,
            email: newEmail.value,
        };
        var js = JSON.stringify(obj);
        // console.log(js);
        try {
            const response = await fetch(bp.buildPath('api/register'), {
                method: 'POST',
                body: js,
                headers: { 'Content-Type': 'application/json' },
            });
            var res = JSON.parse(await response.text());
            console.log(res);
            if (res.error != 'N/A') {
                console.log(res.error);
                // setMessage('User/Password combination incorrect');
            } else {
                console.log(res);
                storage.storeToken(res);
                var user = {
                    Name: res.Name,
                    score: res.score,
                    id: res.id,
                };
                console.log(user);
                localStorage.setItem('user_data', JSON.stringify(user));
                setMessage('');
                setIsLogin(true);
            }
        } catch (e) {
            alert(e.toString());
            return;
        }
    };

    const registerForm = () => {
        setIsLogin(false);
    };

    const loginForm = () => {
        setIsLogin(true);
    };

    return (
        <>
            <div className="d-flex justify-content-center align-content-center">
                <div className="title">
                    <h1>UCF GO</h1>
                </div>
                <div className="Login-container d-flex justify-content-center flex-column">
                    <div
                        className={`slider ${isLogin ? 'moveslider' : ''}`}
                    ></div>
                    <div className="btn mx-auto">
                        <button
                            onClick={registerForm}
                            className="login-btn"
                        >
                            Login
                        </button>
                        <button
                            onClick={loginForm}
                            className="register-btn"
                        >
                            Register
                        </button>
                    </div>
                    <div
                        className={`form-section ${
                            isLogin ? 'form-section-move' : ''
                        }`}
                    >
                        {/* Login Section */}
                        <div className="login-box">
                            <label>
                                Username:
                                <br />
                                <input
                                    type="userName"
                                    className="userName ele"
                                    placeholder="Username"
                                    id="loginName"
                                    ref={(c) => (loginName = c)}
                                ></input>
                            </label>
                            <label>
                                Password:
                                <br />
                                <input
                                    type="password"
                                    className="password ele"
                                    placeholder="Password"
                                    id="loginPassword"
                                    ref={(c) => (loginPassword = c)}
                                ></input>
                            </label>
                            <button
                                onClick={doLogin}
                                className="clkbtn"
                            >
                                Login
                            </button>
                            <span id="loginResult">{message}</span>{' '}
                        </div>
                        {/* Register Section */}
                        <div className="register-box">
                            <label>
                                Name:
                                <br />
                                <input
                                    type="name"
                                    className="name ele"
                                    placeholder="First Last"
                                    id="newName"
                                    ref={(c) => (newName = c)}
                                ></input>
                            </label>
                            <label>
                                Username:
                                <br />
                                <input
                                    type="userName"
                                    className="userName ele"
                                    placeholder="Username"
                                    id="newUsername"
                                    ref={(c) => (newUsername = c)}
                                ></input>
                            </label>
                            <label>
                                Email:
                                <br />
                                <input
                                    type="email"
                                    className="email ele"
                                    placeholder="email@email.com"
                                    id="newEmail"
                                    ref={(c) => (newEmail = c)}
                                ></input>
                            </label>
                            <label>
                                Password:
                                <br />
                                <input
                                    type="password"
                                    className="password ele"
                                    placeholder="Password"
                                    id="newPassword"
                                    ref={(c) => (newPassword = c)}
                                ></input>
                            </label>
                            <button
                                onClick={doRegister}
                                className="clkbtn mt-4"
                            >
                                Register
                            </button>
                        </div>
                    </div>
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
