import crypto from 'crypto'
import process from 'node:process'

import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import bcrypt from 'bcrypt'
import { configDotenv } from 'dotenv'

import { setupDatabase, db } from './db/config.mjs'

import {
    FingerprintJsServerApiClient
} from '@fingerprintjs/fingerprintjs-pro-server-api'

configDotenv({ path: new URL('../.env', import.meta.url) })

const app = express()

await setupDatabase()

const fpjsClient = new FingerprintJsServerApiClient({
    apiKey: process.env.SERVER_FPJS_API_KEY,
    region: process.env.FPJS_REGION
})

const allowedOrigins = ['http://localhost:5173'];

app.use(cors())

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/users/add', async (req, res) => {
    const hash = bcrypt.hashSync(req.body.password, 5);

    try {

        const visitorId = await validateVisitor(req)

        const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000); // 30 minutes ago
        const MAX_ALLOWED_SIGNUPS = 3

        // Check if the number of signups with this visitorId are within the set limits
        const existingUsersForVisitorId = await new Promise((resolve, reject) => {
            db.all(`select * from users where visitor_id = $visitorId AND created_at > $thirtyMinutesAgo;`, {
                $visitorId: visitorId,
                $thirtyMinutesAgo: thirtyMinutesAgo.valueOf()
            }, function (err, rows) {
                if (err) {
                    reject(err)
                }
                resolve(rows)
            })
        })

        if (existingUsersForVisitorId.length >= MAX_ALLOWED_SIGNUPS) {
            throw new Error('You have exceeded the maximum number of signups allowed every 30 minutes!');
        }

        // Check if the given username already has an account
        const existingUsersForUsername = await new Promise((resolve, reject) => {
            db.all(`select * from users where username = $username;`, {
                $username: req.body.username,
            }, function (err, rows) {
                if (err) {
                    reject(err)
                }
                resolve(rows)
            })
        })

        if (existingUsersForUsername.length !== 0) {
            throw new Error('User with this username already exists!');
        }

        // Create the account
        await new Promise((resolve, reject) => {
            db.run(`insert into users values($id, $username, $password, $visitorId, $createdAt);`, {
                $id: crypto.randomUUID(),
                $username: req.body.username,
                $password: hash,
                $visitorId: visitorId,
                $createdAt: Date.now()
            }, function (error) {
                if (error) {
                    reject(error)
                }
                resolve()
            })
        })
        res.status(200).json({
            success: true,
            message: `Inserted user ${req.body.username}`
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success: false,
            message: `Oops! Failed to sign up. ${error.message}`
        })
    }
})


app.post('/users/auth', async (req, res) => {
    const { username, password } = req.body
    try {
        const userData = await new Promise((resolve, reject) => {
            db.get(`select username, password, visitor_id from users where username = $username;`, {
                $username: username
            }, function (err, row) {
                if (err) {
                    reject(err)
                }
                resolve(row)
            })
        })

        if (!userData) {
            throw new Error("No user found")
        }

        const visitorId = await validateVisitor(req)

        const passwordVerified = bcrypt.compareSync(password, userData.password)

        if (!passwordVerified) {
            throw new Error('Incorrect password')
        }

        if (userData.visitorId !== visitorId) {
            // Perform some additional checks, such as sending a login link to email or asking a security question
        }
        res.status(200).json({
            success: true,
            message: `Logged in as ${req.body.username}`
        })

    } catch (error) {
        res.status(500).json({
            success: false,
            message: `Failed to log in. ${error.message}`
        })
    }
})


const validateVisitor = async (req) => {
    const fpjsVisitor = req.body.fpjsVisitor
    const event = await fpjsClient.getEvent(fpjsVisitor.requestId)
    const visitorId = event.products.identification.data.visitorId;
    const visitorOrigin = new URL(event.products.identification.data.url).origin

    // Check if the visitorId has been modified by the client
    if (fpjsVisitor.visitorId !== visitorId) {
        throw new Error('Tampered Visitor ID')
    }

    // Check if the request is coming from a verified origin
    if (
        !(visitorOrigin === req.headers['origin'] &&
            allowedOrigins.includes(visitorOrigin))
    ) {
        throw new Error('Invalid origin!')
    }

    // Check if the visitor identification was done in the last 30 minutes
    if ((Date.now() - event.products.identification.data.timestamp) > 90 * 60 * 1000) {
        throw new Error('Expired request')
    }

    // Check if the user might be a bot
    if (event.products.botd.data.bot.result === "bad") {
        // Additionally, consider throwing a CAPTCHA or MFA to verify the user is human
        throw new Error('Possibly a bot')
    }

    return visitorId

}

app.listen(process.env.PORT || 5000, () => {
    console.log(`listening to port ${process.env.PORT || 5000}`)
});