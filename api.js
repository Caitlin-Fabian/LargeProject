const { BSON, EJSON, ObjectId } = require('bson');
require('express');
require('mongodb');

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
           var ret = { id: id, name: name, score: score, error: '' };
           res.status(200).json(ret);
        }
        else{
          var ret = { error: 'Invalid Login' };
           res.status(200).json(ret);
        }
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

        var score = '';
        var id = -1;

        if (results.length == 0) {
            db.collection('Users').insertOne({
                Name: name,
                Username: username,
                Password: password,
                Email: email,
                Score: 0,
            });

            const res = await db
                .collection('Users')
                .find({ Username: username })
                .toArray();
            id = res[0]._id;
            score = res[0].Score;

            error = 'N/A';
        } else {
            error =
                'A user with the same username already exists, Please try again';
        }
        var ret = { Name: name, id: id, score: score, error: error };
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
    
    app.post('/api/getUserInfo',async (req,res,next) => {
	 //incoming: userId
	 //outgoing: email, name, score
	 var error = ''
	 const {userId} = req.body;
	 const db = client.db('UCFGO');
	 const results = await db
	    .collection('Users')
	    .find({ _id: userId })
	    .toArray();
	  var id = -1;
	  var fn = '';
	  var email = '';
	  if (results.length > 0) {
	    id = results[0]._id;
	    fn = results[0].Name;
	    email = results[0].Email;

	    var ret = { id:id, Email: email,Name: fn, error: '' };
	    res.status(200).json(ret);
	  }
	  else{
	     var ret = {error: 'Invalid ID' };
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
};
