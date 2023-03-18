const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const PORT = process.env.PORT || 5000;
const app = express();
app.set('port', process.env.PORT || 5000);
app.use(cors());
app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PATCH, DELETE, OPTIONS'
    );
    next();
});
app.listen(PORT, () => {
    console.log('Server listening on port ' + PORT);
}); // start Node + Express server on port 5000
require('dotenv').config();
const url = process.env.MONGODB_URI;
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(url);
client.connect();

var cardList = [
    'Roy Campanella',
    'Paul Molitor',
    'Tony Gwynn',
    'Dennis Eckersley',
    'Reggie Jackson',
    'Gaylord Perry',
    'Buck Leonard',
    'Rollie Fingers',
    'Charlie Gehringer',
    'Wade Boggs',
    'Carl Hubbell',
    'Dave Winfield',
    'Jackie Robinson',
    'Ken Griffey, Jr.',
    'Al Simmons',
    'Chuck Klein',
    'Mel Ott',
    'Mark McGwire',
    'Nolan Ryan',
    'Ralph Kiner',
    'Yogi Berra',
    'Goose Goslin',
    'Greg Maddux',
    'Frankie Frisch',
    'Ernie Banks',
    'Ozzie Smith',
    'Hank Greenberg',
    'Kirby Puckett',
    'Bob Feller',
    'Dizzy Dean',
    'Joe Jackson',
    'Sam Crawford',
    'Barry Bonds',
    'Duke Snider',
    'George Sisler',
    'Ed Walsh',
    'Tom Seaver',
    'Willie Stargell',
    'Bob Gibson',
    'Brooks Robinson',
    'Steve Carlton',
    'Joe Medwick',
    'Nap Lajoie',
    'Cal Ripken, Jr.',
    'Mike Schmidt',
    'Eddie Murray',
    'Tris Speaker',
    'Al Kaline',
    'Sandy Koufax',
    'Willie Keeler',
    'Pete Rose',
    'Robin Roberts',
    'Eddie Collins',
    'Lefty Gomez',
    'Lefty Grove',
    'Carl Yastrzemski',
    'Frank Robinson',
    'Juan Marichal',
    'Warren Spahn',
    'Pie Traynor',
    'Roberto Clemente',
    'Harmon Killebrew',
    'Satchel Paige',
    'Eddie Plank',
    'Josh Gibson',
    'Oscar Charleston',
    'Mickey Mantle',
    'Cool Papa Bell',
    'Johnny Bench',
    'Mickey Cochrane',
    'Jimmie Foxx',
    'Jim Palmer',
    'Cy Young',
    'Eddie Mathews',
    'Honus Wagner',
    'Paul Waner',
    'Grover Alexander',
    'Rod Carew',
    'Joe DiMaggio',
    'Joe Morgan',
    'Stan Musial',
    'Bill Terry',
    'Rogers Hornsby',
    'Lou Brock',
    'Ted Williams',
    'Bill Dickey',
    'Christy Mathewson',
    'Willie McCovey',
    'Lou Gehrig',
    'George Brett',
    'Hank Aaron',
    'Harry Heilmann',
    'Walter Johnson',
    'Roger Clemens',
    'Ty Cobb',
    'Whitey Ford',
    'Willie Mays',
    'Rickey Henderson',
    'Babe Ruth',
];

app.post('/api/addcard', async (req, res, next) => {
    // incoming: userId, color
    // outgoing: error
    var error = '';
    const { userId, card } = req.body;
    // TEMP FOR LOCAL TESTING.
    cardList.push(card);
    var ret = { error: error };
    res.status(200).json(ret);
});
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
    var name = '';
    var score = '';
    if (results.length > 0) {
        id = results[0].id;
        name = results[0].Name;
        score = results[0].Score;
    }
    var ret = { id: id, name: name, score: score, error: '' };
    res.status(200).json(ret);
});
app.post('/api/searchcards', async (req, res, next) => {
    // incoming: userId, search
    // outgoing: results[], error
    var error = '';
    const { userId, search } = req.body;
    var _search = search.toLowerCase().trim();
    var _ret = [];
    for (var i = 0; i < cardList.length; i++) {
        var lowerFromList = cardList[i].toLocaleLowerCase();
        if (lowerFromList.indexOf(_search) >= 0) {
            _ret.push(cardList[i]);
        }
    }
    var ret = { results: _ret, error: '' };
    res.status(200).json(ret);
});

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
        error =
            'A user with the same username already exists, Please try again';
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

//////////////////////////////////////////////////
// For Heroku deployment
// Server static assets if in production
if (process.env.NODE_ENV === 'production') {
    // Set static folder
    app.use(express.static('frontend/build'));
    app.get('*', (req, res) => {
        res.sendFile(
            path.resolve(__dirname, 'frontend', 'build', 'index.html')
        );
    });
}
