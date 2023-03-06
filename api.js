require('express');
require('mongodb');

//load user model
const User = require('./models/user.js');
//load card model
const Card = require('./models/card.js');

exports.setApp = function (app, client) {
  //   app.post('/api/addcard', async (req, res, next) => {
  //     // incoming: userId, color
  //     // outgoing: error
  //     var error = '';
  //     var token = require('./createJWT.js');
  //     const { userId, card, jwtToken } = req.body;
  //     try {
  //       if (token.isExpired(jwtToken)) {
  //         var r = { error: 'The JWT is no longer valid', jwtToken: '' };
  //         res.status(200).json(r);
  //         return;
  //       }
  //     } catch (e) {
  //       console.log(e.message);
  //     }
  //     // TEMP FOR LOCAL TESTING.
  //     cardList.push(card);
  //     var ret = { error: error };
  //     res.status(200).json(ret);
  //   });

  ///////////////////               LOGIN             ////////////////////////////
  app.post('/api/login', async (req, res, next) => {
    // incoming: login, password
    // outgoing: id, firstName, lastName, error

    var error = '';

    const { login, password } = req.body;
    // const db = client.db();
    // const results = await db.collection('Users').find({Login:login,Password:password}).toArray();
    const results = await User.find({ Login: login, Password: password });

    var id = -1;
    var fn = '';
    var ln = '';
    var ret;

    if (results.length > 0) {
      id = results[0].UserId;
      fn = results[0].FirstName;
      ln = results[0].LastName;
      try {
        const token = require('./createJWT.js');
        ret = token.createToken(fn, ln, id);
      } catch (e) {
        ret = { error: e.message };
      }
    } else {
      ret = { error: 'Login/Password incorrect' };
    }

    res.status(200).json(ret);
  });

  ///////////////////////////////     ADD CARD         /////////////////////////////////
  app.post('/api/addcard', async (req, res, next) => {
    // incoming: userId, color
    // outgoing: error

    const { userId, card, jwtToken } = req.body;
    try {
      if (token.isExpired(jwtToken)) {
        var r = { error: 'The JWT is no longer valid', jwtToken: '' };
        res.status(200).json(r);
        return;
      }
    } catch (e) {
      console.log(e.message);
    }

    //const newCard = { Card: card, UserId: userId };
    const newCard = new Card({ Card: card, UserId: userId });
    var error = '';
    try {
      // const db = client.db();
      // const result = db.collection('Cards').insertOne(newCard);
      newCard.save();
    } catch (e) {
      error = e.toString();
    }

    var refreshedToken = null;
    try {
      refreshedToken = token.refresh(jwtToken);
    } catch (e) {
      console.log(e.message);
    }

    var ret = { error: error, jwtToken: refreshedToken };

    res.status(200).json(ret);
  });
  /////////////////////////////////// SEARCH CARD ///////////////////////////////
  app.post('/api/searchcards', async (req, res, next) => {
    // incoming: userId, search
    // outgoing: results[], error

    var error = '';

    const { userId, search, jwtToken } = req.body;
    try {
      if (token.isExpired(jwtToken)) {
        var r = { error: 'The JWT is no longer valid', jwtToken: '' };
        res.status(200).json(r);
        return;
      }
    } catch (e) {
      console.log(e.message);
    }

    var _search = search.trim();
    //   const db = client.db();
    //   const results = await db.collection('Cards').find({ "Card": { $regex: _search + '.*', $options: 'r' } }).toArray();
    const results = await Card.find({
      Card: { $regex: _search + '.*', $options: 'r' },
    });

    var _ret = [];
    for (var i = 0; i < results.length; i++) {
      _ret.push(results[i].Card);
    }

    var refreshedToken = null;
    try {
      refreshedToken = token.refresh(jwtToken);
    } catch (e) {
      console.log(e.message);
    }

    var ret = { results: _ret, error: error, jwtToken: refreshedToken };

    res.status(200).json(ret);
  });

  //   app.post('/api/searchcards', async (req, res, next) => {
  //     // incoming: userId, search
  //     // outgoing: results[], error

  //     var error = '';
  //     var token = require('./createJWT.js');
  //     const { userId, search, jwtToken } = req.body;
  //     try {
  //       if (token.isExpired(jwtToken)) {
  //         var r = { error: 'The JWT is no longer valid', jwtToken: '' };
  //         res.status(200).json(r);
  //         return;
  //       }
  //     } catch (e) {
  //       console.log(e.message);
  //     }
  //     var _search = search.toLowerCase().trim();
  //     var _ret = [];
  //     for (var i = 0; i < cardList.length; i++) {
  //       var lowerFromList = cardList[i].toLocaleLowerCase();
  //       if (lowerFromList.indexOf(_search) >= 0) {
  //         _ret.push(cardList[i]);
  //       }
  //     }
  //     var ret = { results: _ret, error: '' };
  //     res.status(200).json(ret);
  //   });

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
    if (results.length == 0) {
      db.collection('Users').insertOne({
        Name: name,
        Username: username,
        Password: password,
        Email: email,
        Score: 0,
      });
      error = 'N/A';
    } else {
      error = 'A user with the same username already exists, Please try again';
    }
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
      UserID: monsterID,
      MonsterID: userID,
    });
    //updates user with the given monster score

    var query = { _id: userID };
    const user = await db.collection('Users').find(query).toArray();
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
