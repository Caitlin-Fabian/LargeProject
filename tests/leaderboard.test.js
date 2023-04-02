//NOTE: MAKE A NEW FILE FOR EACH "describe" BLOCK
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

describe("POST /api/leaderboard", () => {

    it("should return 200 status code", async () => {
        const token = await request(app).post("/api/leaderboard").send({
        });

        //gets the token from what was sent to the DB and formats it like a response
        const response = await request(app).post("/api/leaderboard")
            .set({
                Authorization: "bearer " + token.body.token,
                "Content-Type": "application/json",
            });
        //from there, you are able to expect different responses from the DB
        expect(response.statusCode).toBe(200);

    });
    it("should return 3 users, with the first one having a greater than (or equal to) score to the second", async () => {
        const token = await request(app).post("/api/leaderboard").send({
        });

        //gets the token from what was sent to the DB and formats it like a response
        const response = await request(app).post("/api/leaderboard")
            .set({
                Authorization: "bearer " + token.body.token,
                "Content-Type": "application/json",
            });
        //from there, you are able to expect different responses from the DB. if you have access, use postman to know the ids of what is being called back in
        console.log(response.body.userList[0].Score);
        expect(response.body.userList).toBeDefined();
        expect(response.body.userList[0].Score).toBeGreaterThanOrEqual(response.body.userList[1].Score);
        expect(response.body.userList[1].Score).toBeGreaterThanOrEqual(response.body.userList[2].Score);


    });

});