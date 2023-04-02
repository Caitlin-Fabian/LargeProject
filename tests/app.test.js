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
  it("should return 200 status code", async () => {
    //can but different tokens based on what is in the DB or not. A good new test would be to test if a user in the db is working right
    const token = await request(app).post("/api/login").send({
      username: "rickL",
      password: "COP4331",
    });

    //gets the token from what was sent to the DB and formats it like a response
    const response = await request(app).post("/api/login")
      .set({
        Authorization: "bearer " + token.body.token,
        "Content-Type": "application/json",
      });
    //from there, you are able to expect different responses from the DB
    expect(response.statusCode).toBe(200);

  });

});