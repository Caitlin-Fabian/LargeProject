import React, { useState } from 'react';
import pokeball from '../assets/Balls.svg';

function Login() {
  var loginName;
  var loginPassword;
  const [message, setMessage] = useState('');

  const doLogin = async (event) => {
    event.preventDefault();
    var obj = { login: loginName.value, password: loginPassword.value };
    var js = JSON.stringify(obj);
    console.log(js);
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        body: js,
        headers: { 'Content-Type': 'application/json' },
      });
      var res = JSON.parse(await response.text());
      if (res.id <= 0) {
        console.log(res);
        setMessage('User/Password combination incorrect');
      } else {
        var user = {
          firstName: res.firstName,
          lastName: res.lastName,
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
