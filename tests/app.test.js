const mongoose = require("mongoose");
const request = require("supertest");
const bodyParser = require('body-parser');
const cors = require('cors');
const express = require("express");
require("dotenv").config();

const PORT = process.env.PORT || 5000;
const app = express();
app.set('port', PORT);
app.use(cors());
app.use(bodyParser.json());
var api;

const MongoClient = require('mongodb').MongoClient;
var client = new MongoClient(process.env.MONGODB_URI);


/* Connecting to the database before each test. */
beforeAll(async () => {
  client.connect();
  api = require('../api.js');
  api.setApp(app, client);
});

/* Closing database connection after each test. */
afterAll(async () => {
  client.close();
});

describe("POST /api/login", () => {
  it("should return 200 status code, as user exists", async () => {
    const user = {
      username: "Cait",
      password: "password",
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(user);

    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse.body.accessToken).toBeDefined();

  });

  it("should return 406 status code, as user does not exist", async () => {
    const user = {
      username: "nonexistentUser",
      password: "invalidPassword",
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(user);

    expect(loginResponse.statusCode).toBe(200);
    expect(loginResponse.body.error).toBe("Wrong Credentials");

  });

  it("should return 406 status code, no username or password passed", async () => {
    const user = {
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(user);

    expect(loginResponse.statusCode).toBe(406);
    expect(loginResponse.body.error).toBe("Invalid Login");

  });

  it("should return 406 status code, no password passed", async () => {
    const user = {
      username: "nonexistentUser",
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(user);

    expect(loginResponse.statusCode).toBe(406);
    expect(loginResponse.body.error).toBe("Invalid Login");

  });

  it("should return 406 status code, no username passed", async () => {
    const user = {
      password: "invalidPassword",
    };

    const loginResponse = await request(app)
      .post("/api/login")
      .send(user);

    expect(loginResponse.statusCode).toBe(406);
    expect(loginResponse.body.error).toBe("Invalid Login");

  });
});
describe("POST /api/register", () => {
  it("should return 200 status code", async () => {
    const response = await request(app).post("/api/register")
    .send({
      name:"TACC",
      username:"TACC",
      password:"TACC",
      email:"TACC@gmail.com"
    })
    //from there, you are able to expect different responses from the DB
    expect(response.statusCode).toBe(200);
    expect(response.body.score).toBe(0);
    expect(response.body.id).toBeDefined();
    expect(response.body.Name).toBe("TACC");

    //deletes the user made
    await request(app).post("/api/deleteUser")
    .send({
      username:"TACC"
    })
  })

  it("should return 200 status code but error as the username exists in the db", async () => {
    const response = await request(app).post("/api/register")
    .send({
      name:"TACC",
      username:"Bryson",
      password:"TACC",
      email:"TACC@gmail.com"
    })
    //from there, you are able to expect different responses from the DB
    expect(response.statusCode).toBe(200);
    expect(response.body.error).toBe('A user with the same username or email already exists, Please try again');
    
  })

  it("should return 200 status code but error as the email exists in the db", async () => {
    const response = await request(app).post("/api/register")
    .send({
      name:"TACC",
      username:"TACC",
      password:"TACC",
      email:"Bryson@email.com"
    })
    //from there, you are able to expect different responses from the DB
    expect(response.statusCode).toBe(200);
    expect(response.body.error).toBe('A user with the same username or email already exists, Please try again');
  })

})
describe("POST /api/getUserList", () => {

  it("should return 200 status code, and return 20 to 21 users all having a lesser or equal score to the person behind", async () => {

    //gets the token from what was sent to the DB and formats it like a response
    const response = await request(app).post("/api/getUserList")
    .send({
      userId: "643c477864d30ee4b6afe1ac",
      jwtToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2NDNjNDc3ODY0ZDMwZWU0YjZhZmUxYWMiLCJOYW1lIjoidW5kZWZpbmVkMSIsIlNjb3JlIjo5MDAsImlzVmVyaWZpZWQiOnRydWUsImlhdCI6MTY4MTc2NjU2OH0.rNfhyRm7Tvylb6D3TXMlexFKKtG1HjYBevAKzIk6ZEA"
    })
    //from there, you are able to expect different responses from the DB
    expect(response.statusCode).toBe(200);
    expect(response.body.userList).toBeDefined();
    for (let x = 0; x < response.body.userList.length - 1; x++) {
      expect(response.body.userList[x].Score).toBeGreaterThanOrEqual(response.body.userList[x + 1].Score);
    }

  });
  it("should return 406 status code,no user id ", async () => {

    //gets the token from what was sent to the DB and formats it like a response
    const response = await request(app).post("/api/getUserList")
      .send()
    //from there, you are able to expect different responses from the DB
    expect(response.statusCode).toBe(406);
    expect(response.body.error).toBe("No User ID passed");

  });
});
describe("POST /api/getUserInfo", () => {
  it("should return 200 status code ", async () => {
    const response = await request(app).post("/api/getUserInfo")
      .send({
        userId: "643c477864d30ee4b6afe1ac",
        jwtToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2NDNjNDc3ODY0ZDMwZWU0YjZhZmUxYWMiLCJOYW1lIjoidW5kZWZpbmVkMSIsIlNjb3JlIjo5MDAsImlzVmVyaWZpZWQiOnRydWUsImlhdCI6MTY4MTc2NjU2OH0.rNfhyRm7Tvylb6D3TXMlexFKKtG1HjYBevAKzIk6ZEA"
      })
    //from there, you are able to expect different responses from the DB
    expect(response.statusCode).toBe(200);
    expect(response.body.Email).toBeDefined();
    expect(response.body.Name).toBeDefined();
    expect(response.body.id).toBeDefined();
    expect(response.body.character).toBeDefined();
    expect(response.body.monsters).toBeDefined();

  });
  it("should return 406 status code ", async () => {
    const response = await request(app).post("/api/getUserInfo")
      .send()
    //from there, you are able to expect different responses from the DB
    expect(response.statusCode).toBe(406);
    expect(response.body.error).toBe("No User ID passed");

  });

});
//need a test for when it works fine, none of the properties added and what happens if a user already has that monster
describe("POST /api/giveMonster", () => {
  it("should return 200 status code ", async () => {
    const inc = 5;
    const mid = 1;
    const beforeResponse = await request(app).post("/api/getUserInfo")
      .send({
        userId: "643c477864d30ee4b6afe1ac",
        jwtToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2NDNjNDc3ODY0ZDMwZWU0YjZhZmUxYWMiLCJOYW1lIjoidW5kZWZpbmVkMSIsIlNjb3JlIjo5MDAsImlzVmVyaWZpZWQiOnRydWUsImlhdCI6MTY4MTc2NjU2OH0.rNfhyRm7Tvylb6D3TXMlexFKKtG1HjYBevAKzIk6ZEA"
      })
    const actual = await request(app).post("/api/giveMonster")
      .send({
        userId: "643c477864d30ee4b6afe1ac",
        monsterId: mid,
        monsterScore: inc
      })
    const afterResponse = await request(app).post("/api/getUserInfo")
      .send({
        userId: "643c477864d30ee4b6afe1ac",
        jwtToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2NDNjNDc3ODY0ZDMwZWU0YjZhZmUxYWMiLCJOYW1lIjoidW5kZWZpbmVkMSIsIlNjb3JlIjo5MDAsImlzVmVyaWZpZWQiOnRydWUsImlhdCI6MTY4MTc2NjU2OH0.rNfhyRm7Tvylb6D3TXMlexFKKtG1HjYBevAKzIk6ZEA"
      })
    //from there, you are able to expect different responses from the DB
    expect(actual.statusCode).toBe(200);
    expect(actual.body.error).toBe("N/A");
    expect(afterResponse.statusCode).toBe(200);
    expect(beforeResponse.statusCode).toBe(200);
    expect(afterResponse.body.monsters).toContainEqual(mid);
    expect(afterResponse.body.score).toBe(beforeResponse.body.score + inc);
  });
  it("should return 406 status code ", async () => {
    const response = await request(app).post("/api/giveMonster")
      .send()
    //from there, you are able to expect different responses from the DB
    expect(response.statusCode).toBe(406);
    expect(response.body.error).toBe("No User ID passed");

  });

});

describe("POST /api/updateUser", () => {
  it("should return 200 status code ", async () => {
    const before = await request(app).post("/api/getUserInfo")
      .send({
        userId: "643c477864d30ee4b6afe1ac",
        jwtToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2NDNjNDc3ODY0ZDMwZWU0YjZhZmUxYWMiLCJOYW1lIjoidW5kZWZpbmVkMSIsIlNjb3JlIjo5MDAsImlzVmVyaWZpZWQiOnRydWUsImlhdCI6MTY4MTc2NjU2OH0.rNfhyRm7Tvylb6D3TXMlexFKKtG1HjYBevAKzIk6ZEA"
      })
    const response = await request(app).post("/api/updateUser")
      .send({
        userId: "643c477864d30ee4b6afe1ac",
        name: before.body.Name + "1",
        email: null,
        character: null,
      })
    const after = await request(app).post("/api/getUserInfo")
      .send({
        userId: "643c477864d30ee4b6afe1ac",
        jwtToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySUQiOiI2NDNjNDc3ODY0ZDMwZWU0YjZhZmUxYWMiLCJOYW1lIjoidW5kZWZpbmVkMSIsIlNjb3JlIjo5MDAsImlzVmVyaWZpZWQiOnRydWUsImlhdCI6MTY4MTc2NjU2OH0.rNfhyRm7Tvylb6D3TXMlexFKKtG1HjYBevAKzIk6ZEA"
      })
    //from there, you are able to expect different responses from the DB
    expect(response.statusCode).toBe(200);
    expect(after.statusCode).toBe(200);
    expect(before.statusCode).toBe(200);
    expect(after.body.Name).toBe(before.body.Name + "1");
    expect(after.body.Email).toBe(before.body.Email);
    expect(after.body.character).toBe(before.body.character);


    //change it back
    await request(app).post("/api/updateUser")
      .send({
        userId: "643c477864d30ee4b6afe1ac",
        name: before.body.Name,
        username: null,
        email: null,
        character: null,
      })

  });

  it("should return 406 status code, no userId ", async () => {
    const response = await request(app).post("/api/updateUser")
      .send()
    //from there, you are able to expect different responses from the DB
    expect(response.statusCode).toBe(406);
    expect(response.body.error).toBe("No User ID passed");

  });

  it("should return 500 status code, userId has no user associated ", async () => {
    const response = await request(app).post("/api/updateUser")
      .send({
        userId: "542331512c80d63d9009a352",
        name: null,
        username: null,
        email: null,
        character: null,
      })
    //from there, you are able to expect different responses from the DB
    expect(response.statusCode).toBe(500);
    expect(response.body.error).toBe("Unable to update user");

  });
});

describe("POST /api/getMonsterList", () => {
  it("should return 200 status code and monsters ", async () => {
    const response = await request(app).post("/api/getMonsterList")
      .send()
    //from there, you are able to expect different responses from the DB
    expect(response.statusCode).toBe(200);
    expect(response.body.monsterList).toBeDefined();
  });

});