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
    
    expect(loginResponse.statusCode).toBe(406);
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

describe("POST /api/getUserList", () => {

  it("should return 200 status code, and return 20 to 21 users all having a lesser or equal score to the person behind", async () => {
      
      //gets the token from what was sent to the DB and formats it like a response
      const response = await request(app).post("/api/getUserList")
          .send({userId: "642381512c80d6309009a352"})
      //from there, you are able to expect different responses from the DB
      expect(response.statusCode).toBe(200);
      expect(response.body.userList).toBeDefined();
      for(let x=0;x<response.body.userList.length-1;x++){
          expect(response.body.userList[x].Score).toBeGreaterThanOrEqual(response.body.userList[x+1].Score);
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
          .send({userId: "642381512c80d6309009a352"})
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
            userId: "642381512c80d6309009a352"
          })
        const actual = await request(app).post("/api/giveMonster")
        .send({
          userId: "642381512c80d6309009a352",
          monsterId: mid,
          monsterScore: 5
        })
        const afterResponse = await request(app).post("/api/getUserInfo")
          .send({
            userId: "642381512c80d6309009a352"
          })
      //from there, you are able to expect different responses from the DB
      expect(actual.statusCode).toBe(200);
      expect(actual.body.error).toBe("N/A");
      expect(afterResponse.statusCode).toBe(200);
      expect(beforeResponse.statusCode).toBe(200);
      expect(afterResponse.body.monsters).toContainEqual(mid);
      //expect(afterResponse.body.score).toBe(beforeResponse.body.score+inc);
     

  });
  // it("should return 406 status code ", async () => {
  //   const response = await request(app).post("/api/getUserInfo")
  //      .send()
  //   //from there, you are able to expect different responses from the DB
  //   expect(response.statusCode).toBe(406);
  //   expect(response.body.error).toBe("No User ID passed");

  // });
      
});