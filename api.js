const { BSON, EJSON, ObjectId } = require('bson');
require('express');
require('mongodb');
require('dotenv').config()
const sgMail = require('@sendgrid/mail');
const apiKey = `${process.env.SENDGRID_API_KEY}`;
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
//console.log("SendGrid key ", apiKey);

exports.setApp = function (app, client) {
    // app.post('/api/addcard', async (req, res, next) => {
    //     // incoming: userId, color
    //     // outgoing: error
    //     var error = '';
    //     const { userId, card } = req.body;
    //     // TEMP FOR LOCAL TESTING.
    //     cardList.push(card);
    //     var ret = { error: error };
    //     res.status(200).json(ret);
    // });
    app.post('/api/login', async (req, res, next) => {
        // incoming: login, password
        // outgoing: id, firstName, lastName, error
        var error = '';
        const { login, password } = req.body;
        const db = client.db('UCFGO');
        const results = await db
            .collection('Users')
            .find({ Username: login, Password: password })
            .toArray();
        var id = -1;
        var Name = '';
        var score = '';
        if (results.length > 0) {
            id = results[0]._id;
            Name = results[0].Name;
            score = results[0].Score;
        }
        var ret = { id: id, Name: Name, score: score, error: '' };
        res.status(200).json(ret);
    });
    // app.post('/api/searchcards', async (req, res, next) => {
    //     // incoming: userId, search
    //     // outgoing: results[], error
    //     var error = '';
    //     const { userId, search } = req.body;
    //     var _search = search.toLowerCase().trim();
    //     var _ret = [];
    //     for (var i = 0; i < cardList.length; i++) {
    //         var lowerFromList = cardList[i].toLocaleLowerCase();
    //         if (lowerFromList.indexOf(_search) >= 0) {
    //             _ret.push(cardList[i]);
    //         }
    //     }
    //     var ret = { results: _ret, error: '' };
    //     res.status(200).json(ret);
    // });

    //register API

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

        var score = '';
        var id = -1;

        if (results.length == 0) {
            db.collection('Users').insertOne({
                Name: name,
                Username: username,
                Password: password,
                Email: email,
                EmailToken: Math.random().toString(36).substring(2,7),//generates random 5 character string
                IsVerfied: false,
                Score: 0,
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
                `
            }

            //send email to new user
            //await sgMail.send(msg);
            sgMail.send(msg);
            console.log('Thanks for registering! Please check your email to verify your account.')

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
        var error = '';
        const { token } = req.body;//field to take in token
        const db = client.db('UCFGO');

        const results = await db
            .collection('Users')
            .find({ EmailToken: token })
            .toArray();
        console.log(results);

        if (results.length == 0) {
            error = 'Invalid token'
        }else{
            db.collection('User').updateOne(
                {Username: results[1]},
                {$set:
                    {
                        EmailToken: null,
                        IsVerified: true
                    }
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
};
