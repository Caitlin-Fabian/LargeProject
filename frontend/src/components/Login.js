import React, { useState } from 'react';
import pokeball from '../assets/Balls.svg';
import { useJwt } from 'react-jwt';
import axios from 'axios';

function Login() {
  var bp = require('./Path.js');
  var storage = require('../tokenStorage.js');
  var loginName;
  var loginPassword;
  const [message, setMessage] = useState('');

  const app_name = 'ucf-go';
  function buildPath(route) {
    if (process.env.NODE_ENV === 'production') {
      return 'https://' + app_name + '.herokuapp.com/' + route;
    } else {
      return 'http://localhost:5000/' + route;
    }
  }

  const doLogin = async (event) => {
    event.preventDefault();
    var obj = { login: loginName.value, password: loginPassword.value };
    var js = JSON.stringify(obj);
    var config = {
      method: 'post',
      url: bp.buildPath('api/login'),
      headers: {
        'Content-Type': 'application/json',
      },
      data: js,
    };
    axios(config)
      .then(function (response) {
        var res = response.data;
        if (res.error) {
          setMessage('User/Password combination incorrect');
        } else {
          storage.storeToken(res);
          var jwt = require('jsonwebtoken');

          var ud = jwt.decode(storage.retrieveToken(), { complete: true });
          var userId = ud.payload.userId;
          var firstName = ud.payload.firstName;
          var lastName = ud.payload.lastName;

          var user = { firstName: firstName, lastName: lastName, id: userId };
          localStorage.setItem('user_data', JSON.stringify(user));
          window.location.href = '/cards';
        }
      })
      .catch(function (error) {
        console.log(error);
      });
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
