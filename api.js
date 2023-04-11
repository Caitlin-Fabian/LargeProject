const { BSON, EJSON, ObjectId } = require('bson');
require('express');
require('mongodb');
require('dotenv').config();
const sgMail = require('@sendgrid/mail');
const apiKey = `${process.env.SENDGRID_API_KEY}`;
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
//console.log("SendGrid key ", apiKey);

exports.setApp = function (app, client) {
    //login api
    app.post('/api/login', async (req, res, next) => {
        // incoming: username, password
        // outgoing: id, firstName, lastName, error
        var error = '';
        const { username, password } = req.body;

        if (username == undefined || password == undefined) {
            res.status(406).json({ error: 'Invalid Login' });
            return;
        }

        const db = client.db('UCFGO');
        const results = await db
            .collection('Users')
            .find({ Username: username, Password: password })
            .toArray();
        var id = -1;
        var Name = '';
        var score = '';
        if (results.length > 0) {
            id = results[0]._id;
            Name = results[0].Name;
            score = results[0].Score;
            try {
                const token = require('./createJWT.js');
                ret = token.createToken(id, Name, score);
                console.log(ret);
                res.status(200).json(ret);
            } catch (e) {
                ret = { error: e.message };
                res.status(500).json(ret);
            }
        } else {
            //invalid login...
            res.status(200).json({ error: 'Wrong Credentials' });
        }
    });

    //register api
    app.post('/api/register', async (req, res, next) => {
        // incoming: name, username, password, email
        // outgoing: err
        var error = '';
        const { name, username, password, email } = req.body;
        const db = client.db('UCFGO');

        const usernameRes = await db
            .collection('Users')
            .find({ Username: username })
            .toArray();

        const emailRes = await db
            .collection('Users')
            .find({ Email: email })
            .toArray();

        let id = -1;
        let Name = '';
        let score = '';

        if (usernameRes.length == 0 && emailRes.length == 0) {
            db.collection('Users').insertOne({
                Name: name,
                Username: username,
                Password: password,
                Email: email,
                EmailToken: Math.random().toString(36).substring(2, 7), //generates random 5 character string
                IsVerified: false,
                Score: 0,
                Character: 0,
                TimeCaught: [],
                MonsterID: [],
            });

            const res = await db
                .collection('Users')
                .find({ Username: username })
                .toArray();

            console.log(res);
            id = res[0]._id;
            score = res[0].Score;
            console.log(res[0].EmailToken);

            const msg = {
                from: 'ucfgoteams@gmail.com',
                to: email,
                subject: 'UCFGO Action Required - Verify Your Email!',
                text: `
                    Hello, thanks for registering with UCFGO!
                    Please enter the following one-time token: ${res[0].EmailToken}
                    `,
                html: `
                    <h1>Hello,</h1>
                    <p>Thanks for registering on UCFGO!</p>
                    <p>Please enter the following one-time token: ${res[0].EmailToken}</p>
                `,
            };

            //send email to new user
            //await sgMail.send(msg);
            sgMail.send(msg);
            console.log(
                'Thanks for registering! Please check your email to verify your account.'
            );

            error = 'N/A';
        } else {
            error =
                'A user with the same username or email already exists, Please try again';
        }
        var ret = { Name: name, id: id, score: score, error: error };
        res.status(200).json(ret);
    });

    //verify code sent to email api
    app.post('/api/verify', async (req, res, next) => {
        //incoming: token
        //outgoing: err
        var error = 'N/A';
        const { token, password } = req.body; //field to take in token
        const db = client.db('UCFGO');
        console.log(token);

        const results = await db
            .collection('Users')
            .find({ EmailToken: token })
            .toArray();

        if (results.length == 0) {
            error = 'Invalid token';
        } else if (results[0].IsVerified) {
            console.log('pass change');
            db.collection('Users').updateOne(
                { EmailToken: token },
                {
                    $set: {
                        EmailToken: null,
                        Password: password,
                    },
                }
            );
        } else {
            console.log('verified');
            db.collection('Users').updateOne(
                { EmailToken: token },
                {
                    $set: {
                        EmailToken: null,
                        IsVerified: true,
                    },
                }
            );
        }

        const r = await db
            .collection('Users')
            .find({ EmailToken: token })
            .toArray();

        if (r.length == 0) {
            console.log('cngratulations post malone');
        }

        //error = 'N/A';

        var ret = { error: error };
        res.status(200).json(ret);
    });

    //giveMonster api tested
    app.post('/api/giveMonster', async (req, res, next) => {
        // incoming: userID, monsterId, monsterScore
        // outgoing: err
        var error = '';
        const { userId, monsterId, monsterScore } = req.body;
        if (userId == undefined) {
            res.status(406).json({ error: 'No User ID passed' });
            return;
        }
        const db = client.db('UCFGO');
        //updates user with the given monster score

        var query = { _id: new BSON.ObjectId(userId) };

        console.log(query);
        const user = await db.collection('Users').find(query).toArray();

        if (!user[0].MonsterID.includes(monsterId)) {
            // //adds the monster id to the array for the user
            db.collection('Users').updateOne(query, {
                $push: { MonsterID: monsterId },
            });
        }

        let score = user[0].Score + monsterScore;

        console.log('Score' + score);
        //if for some reason something happens to the score we want to be able to pivot

        if (isNaN(user[0].Score) || user[0].Score == null) {
            score = monsterScore;
            console.log('fixed score');
        }
        db.collection('Users').updateOne(query, { $set: { Score: score } });

        error = 'N/A';

        var ret = { error: error };
        res.status(200).json(ret);
    });

    //TODO: make it update the email token
    app.post('/api/sendForgotPassword', async (req, res, next) => {
        const db = client.db('UCFGO');
        console.log('SANITY');
        var { email } = req.body; //field to take in token
        const user = await db
            .collection('Users')
            .find({ Email: email.trim() })
            .toArray();

        console.log(user[0].IsVerified + ' ' + user[0].IsVerfied);
        const et = Math.random().toString(36).substring(2, 7);

        if (user.length >= 1 && user[0].IsVerified) {
            db.collection('Users').updateOne(
                { Email: user[0].Email },
                {
                    $set: {
                        EmailToken: et,
                    },
                }
            );

            const msg = {
                from: 'ucfgoteams@gmail.com',
                to: email,
                subject: 'UCFGO Action Required - Password Change ',
                text: `
                    You have requested to reset your password.
                    Please enter the following one-time token: ${et}
                    `,
                html: `
                    <h1>Hello,</h1>
                    <p>You have requested to reset your password.</p>
                    <p>Please enter the following one-time token: ${et}</p>
                `,
            }; //TODO: please change this

            //send email to new user
            //await sgMail.send(msg);
            sgMail.send(msg);
            console.log('A verification code was sent to ' + email);

            res.status(200).json({ error: 'N/A' });
        } else if (!user[0].isVerified) {
            res.status(200).json({ error: 'Please verify email' });
        } else {
            res.status(200).json({
                error: 'Email does not exist. Please try again',
            });
        }
    });
    //tested
    app.post('/api/getUserInfo', async (req, res, next) => {
        //incoming: userId
        //outgoing: email, name, score
        var error = '';
        var token = require('./createJWT.js');

        const { userId, jwtToken } = req.body;
        console.log('userId:' + userId);
        if (userId == undefined) {
            res.status(406).json({ error: 'No User ID passed' });
            return;
        }
        try {
            if (token.isExpired(jwtToken)) {
                var r = { error: 'The JWT is no longer valid', jwtToken: '' };
                res.status(500).json(r);
                return;
            }
        } catch (e) {
            console.log(e.message);
        }
        const db = client.db('UCFGO');
        const results = await db
            .collection('Users')
            .find({ _id: new BSON.ObjectId(userId) })
            .toArray();

        var id = -1;
        var fn = '';
        var email = '';
        var score = 0;
        var monsters = [];
        var character = 0;
        var username = '';
        var isVerified = '';

        var refreshedToken = null;
        try {
            refreshedToken = token.refresh(jwtToken);
        } catch (e) {
            console.log(e.message);
        }
        if (results.length > 0) {
            id = results[0]._id;
            fn = results[0].Name;
            email = results[0].Email;
            score = results[0].Score;
            monsters = results[0].MonsterID;
            character = results[0].Character;
            username = results[0].Username;
            isVerified = results[0].isVerified;

            var ret = {
                id: id,
                Email: email,
                Name: fn,
                error: '',
                score: score,
                monsters: monsters,
                character: character,
                username: username,
                jwtToken: refreshedToken,
                isVerified: isVerified,
            };
            res.status(200).json(ret);
        } else {
            var ret = { error: 'Invalid ID' };
            res.status(200).json(ret);
        }
    });

    //getUserList API: tested
    app.post('/api/getUserList', async (req, res, next) => {
        // incoming: userId
        // outgoing: top 20 users. If not in the array, add the user to the end with their place
        const size = 10;
        const { userId } = req.body;
        if (userId == undefined) {
            res.status(406).json({ error: 'No User ID passed' });
            return;
        }
        const db = client.db('UCFGO');
        var query = { Score: -1 };
        const userList = await db
            .collection('Users')
            .find()
            .sort(query)
            .limit(size)
            .toArray();
        const topTwenty = [];
        let isInList = false;
        for (let x = 0; x < userList.length; x++) {
            console.log(userList[x]._id.toString() + ' ' + userId);
            console.log(userList[x]._id.toString() == userId);
            if (x < size) {
                if (userList[x]._id.toString() === userId) {
                    isInList = true;
                }
                userList[x].place = x + 1;
                topTwenty.push(userList[x]);
            } else {
                if (isInList) {
                    break;
                } else if (userList[x]._id.toString() === userId) {
                    userList[x].place = x + 1;
                    topTwenty.push(userList[x]);
                    break;
                }
            }
        }

        var ret = { userList: topTwenty, error: '' };
        res.status(200).json(ret);
    });

    //update user info tested
    app.post('/api/updateUser', async (req, res, nest) => {
        // incoming: userID, name, username, email, character
        // outgoing: err
        var error = '';
        const { userId, name, username, email, character } = req.body;
        const db = client.db('UCFGO');
        if (userId == undefined) {
            res.status(406).json({ error: 'No User ID passed' });
            return;
        }
        const results = await db
            .collection('Users')
            .find({ _id: new BSON.ObjectId(userId) })
            .toArray();

        //console.log(results[0]._id);
        var newName = name;
        var newUserName = username;
        var newEmail = email;
        var newCharacter = character;
        console.log(newCharacter);

        if (results.length > 0) {
            console.log('cool');
            if (newName != null) {
                db.collection('Users').updateOne(
                    { _id: new BSON.ObjectId(results[0]._id) },
                    {
                        $set: {
                            Name: newName,
                        },
                    }
                );
            }
            if (newUserName != null) {
                db.collection('Users').updateOne(
                    { _id: new BSON.ObjectId(results[0]._id) },
                    {
                        $set: {
                            Username: newUserName,
                        },
                    }
                );
            }
            if (newEmail != null) {
                db.collection('Users').updateOne(
                    { _id: new BSON.ObjectId(results[0]._id) },
                    {
                        $set: {
                            Email: newEmail,
                        },
                    }
                );
            }
            if (newCharacter != null) {
                console.log('hello');
                db.collection('Users').updateOne(
                    { _id: new BSON.ObjectId(results[0]._id) },
                    {
                        $set: {
                            Character: newCharacter,
                        },
                    }
                );
            }
            var ret = { error: error };
            res.status(200).json(ret);
        } else {
            var ret = { error: 'Unable to update user' };
            res.status(500).json(ret);
        }
    });

    //Returns all of the moneters
    app.post('/api/getMonsterList', async (req, res, next) => {
        const db = client.db('UCFGO');
        const monsterList = await db.collection('Monsters').find().toArray();

        var ret = { monsterList: monsterList, error: '' };
        res.status(200).json(ret);
    });
};
