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
            } catch (e) {
                ret = { error: e.message };
            }
        } else {
            var ret = { error: 'Invalid Login' };
        }

        res.status(200).json(ret);
    });

    //register api
    app.post('/api/register', async (req, res, next) => {
        // incoming: name, username, password, email
        // outgoing: err
        var error = '';
        const { name, username, password, email } = req.body;
        const db = client.db('UCFGO');

        const results = await db
            .collection('Users')
            .find({ Username: username })
            .toArray();

        console.log(results);

        let id = -1;
        let Name = '';
        let score = '';

        if (results.length == 0) {
            db.collection('Users').insertOne({
                Name: name,
                Username: username,
                Password: password,
                Email: email,
                EmailToken: Math.random().toString(36).substring(2, 7), //generates random 5 character string
                IsVerfied: false,
                Score: 0,
                Character: 0,
                TimeCaught: [],
                MonsterID: [],
                EmailToken: 'email',
                IsVerified: false,
            });

            const res = await db
                .collection('Users')
                .find({ Username: username })
                .toArray();
            id = res[0]._id;
            score = res[0].Score;

            const msg = {
                from: 'ucfgoteams@gmail.com',
                to: email,
                subject: 'UCFGO Action Required - Verify Your Email!',
                text: `
                    Hello, thanks for registering with UCFGO!
                    Please enter the following one-time token: ${results[4]}
                    `,
                html: `
                    <h1>Hello,</h1>
                    <p>Thanks for registering on UCFGO!</p>
                    <p>Please enter the following one-time token: ${results[4]}</p>
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
                'A user with the same username already exists, Please try again';
        }
        var ret = { Name: name, id: id, score: score, error: error };
        res.status(200).json(ret);
    });

    //email verification api
    app.post('/api/verifyEmail', async (req, res, next) => {
        //incoming: token
        //outgoing: err
        var error = '';
        const { token } = req.body; //field to take in token
        const db = client.db('UCFGO');

        const results = await db
            .collection('Users')
            .find({ EmailToken: token })
            .toArray();
        console.log(results);

        if (results.length == 0) {
            error = 'Invalid token';
        } else {
            db.collection('User').updateOne(
                { Username: results[1] },
                {
                    $set: {
                        EmailToken: null,
                        IsVerified: true,
                    },
                }
            );
        }

        error = 'N/A';

        var ret = { error: error };
        res.status(200).json(ret);
    });

    //giveMonster api
    app.post('/api/giveMonster', async (req, res, next) => {
        // incoming: userID, monsterID, monsterScore
        // outgoing: err
        var error = '';
        const { userID, monsterID, monsterScore } = req.body;
        const db = client.db('UCFGO');

        db.collection('Inventory').insertOne({
            UserID: userID,
            MonsterID: monsterID,
        });
        //updates user with the given monster score

        var query = { _id: new BSON.ObjectId(userID) };
        console.log(query);
        const user = await db.collection('Users').find(query).toArray();
        console.log(user);
        var upScore = user[0].Score + monsterScore;
        db.collection('Users').updateOne(query, { $set: { Score: upScore } });

        error = 'N/A';

        var ret = { error: error };
        res.status(200).json(ret);
    });

    app.post('/api/getUserInfo', async (req, res, next) => {
        //incoming: userId
        //outgoing: email, name, score
        var error = '';

        const { userId, jwtToken } = req.body;
        console.log('userId:' + userId);
        try {
            if (token.isExpired(jwtToken)) {
                var r = { error: 'The JWT is no longer valid', jwtToken: '' };
                res.status(200).json(r);
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

        console.log(results);
        var id = -1;
        var fn = '';
        var email = '';
        var score = 0;
        var monsters = [];

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

            var ret = {
                id: id,
                Email: email,
                Name: fn,
                error: '',
                score: score,
                monsters: monsters,
                jwtToken: refreshedToken,
            };
            res.status(200).json(ret);
        } else {
            var ret = { error: 'Invalid ID' };
            res.status(200).json(ret);
        }
    });

    //listInventory API
    app.post('/api/listInventory', async (req, res, next) => {
        // incoming: userId
        // outgoing: list of Monsters
        var error = '';
        const { userID, search } = req.body;
        const db = client.db('UCFGO');

        var query = { UserID: userID };
        const invList = await db.collection('Inventory').find(query).toArray();

        var monsterList = [];
        var sCheck = search === '';

        for (let x = 0; x < invList.length; x++) {
            var nq = { _id: invList[x].MonsterID };
            console.log(nq);
            var monster = await db.collection('Monsters').find(nq).toArray();

            if (sCheck || monster[0].Name.includes(search))
                monsterList.push(monster[0]);
        }
        error = 'N/A';
        var ret = { monsterList: monsterList, error: error };
        res.status(200).json(ret);
    });

    //leaderboard API:
    app.post('/api/leaderboard', async (req, res, next) => {
        // incoming:
        // outgoing: top 3 users information
        var error = '';
        const db = client.db('UCFGO');

        var query = { Score: -1 };
        const userList = await db
            .collection('Users')
            .find()
            .sort(query)
            .limit(3)
            .toArray();

        error = 'N/A';
        var ret = { userList: userList, error: error };
        res.status(200).json(ret);
    });

    //update user info
    app.post('/api/updateUser', async (req, res, nest) => {
        // incoming: userID, name, username, password, email, character
        // outgoing: err
        var error = '';
        const { userId, name, username, password, email, character } = req.body;
        const db = client.db('UCFGO');

        const results = await db
            .collection('Users')
            .find({ _id: userId })
            .toArray();

        var newName = name;
        var newUserName = username;
        var newPassword = password;
        var newEmail = email;
        var newCharacter = character;

        if (results.length > 0) {
            db.collection('User').updateOne(
                { _id: results[0] },
                {
                    $set: {
                        Name: newName,
                        Username: newUserName,
                        Password: newPassword,
                        Email: newEmail,
                        Character: newCharacter,
                    },
                }
            );
            var ret = { error: error };
            res.status(200).json(ret);
        } else {
            var ret = { error: 'Unable to update user' };
            res.status(200).json(ret);
        }
    });
};
